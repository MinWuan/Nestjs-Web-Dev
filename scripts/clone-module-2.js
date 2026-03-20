const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// --- CẤU HÌNH ---
const SOURCE_DIR = path.join(__dirname, '../src/modules/demo');
const SOURCE_NAME = 'demo';

// --- TIỆN ÍCH CHUYỂN ĐỔI TÊN ---
const toPascalCase = (str) =>
  str.replace(
    /(\w)(\w*)/g,
    (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase(),
  );
const toCamelCase = (str) =>
  str.charAt(0).toLowerCase() + toPascalCase(str).slice(1);
const toKebabCase = (str) =>
  str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

// --- HÀM HỖ TRỢ NHẬP LIỆU ---
const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

// --- LOGIC XỬ LÝ KIỂU DỮ LIỆU ---
function getFieldTypes(typeInput) {
  const t = typeInput.toLowerCase().trim();
  switch (t) {
    case 'number':
    case 'int':
    case 'integer':
      return { ts: 'number', gql: 'Int', mongoose: 'Number' };
    case 'float':
    case 'double':
    case 'decimal':
      return { ts: 'number', gql: 'Float', mongoose: 'Number' };
    case 'boolean':
    case 'bool':
      return { ts: 'boolean', gql: 'Boolean', mongoose: 'Boolean' };
    case 'date':
    case 'datetime':
      return { ts: 'Date', gql: 'Date', mongoose: 'Date' };
    case 'id':
    case 'objectid':
      return { ts: 'string', gql: 'ID', mongoose: 'Schema.Types.ObjectId' };
    case 'json':
    case 'object':
      return {
        ts: 'Record<string, any>',
        gql: 'GraphQLJSON',
        mongoose: 'Object',
      }; // Cần import GraphQLJSON nếu dùng
    case 'string':
    case 'text':
    default:
      return { ts: 'string', gql: 'String', mongoose: 'String' };
  }
}

// --- HÀM SINH CODE CHO CÁC FILE ---
function generateFieldCode(fields, fileType, forceOptional = false) {
  if (!fields || fields.length === 0) return '';

  return fields
    .map((field) => {
      const { name, type, isOptional } = field;
      const types = getFieldTypes(type);

      // Logic xác định optional: Nếu forceOptional (dùng cho Update/Filter) thì luôn true, ngược lại theo user chọn
      const finalOptional = forceOptional || isOptional;
      
      const tsOptionalMark = finalOptional ? '?' : '';
      
      // GraphQL options
      const gqlNullable = finalOptional ? 'nullable: true' : '';
      
      // Mongoose options
      // Nếu optional -> không cần required: true. Nếu mandatory -> required: true.
      const mongooseRequired = finalOptional ? 'nullable: true' : '';

      if (fileType === 'schema') {
        // Mongoose Schema
        return `  @Field({${mongooseRequired}})\n  ${name}${tsOptionalMark}: ${types.ts};\n`;
      } else if (fileType === 'entity') {
        // GraphQL Entity / Object Type
        return `  @Column({${gqlNullable}})\n  ${name}${tsOptionalMark}: ${types.ts};\n`;
      } else if (fileType === 'args') {
        // GraphQL Args / Input
        return `  @Field({${gqlNullable}})\n  ${name}${tsOptionalMark}: ${types.ts};\n`;
      }
      return '';
    })
    .join('\n');
}

// --- HÀM CHÈN CODE VÀO CLASS CỤ THỂ ---
function injectCodeIntoClass(content, className, codeToInject) {
  if (!codeToInject) return content;

  // Regex tìm định nghĩa class: export class ClassName ... {
  // Cập nhật regex để chấp nhận extends, implements và khoảng trắng linh hoạt
  const classRegex = new RegExp(
    `export\\s+class\\s+${className}[^{]*\\{`,
    'g',
  );
  const match = classRegex.exec(content);

  if (!match) return content;

  const startIndex = match.index + match[0].length;
  let braceCount = 1;
  let endIndex = -1;

  // Duyệt từ sau dấu { mở đầu class để tìm dấu } đóng tương ứng
  for (let i = startIndex; i < content.length; i++) {
    if (content[i] === '{') braceCount++;
    else if (content[i] === '}') braceCount--;

    if (braceCount === 0) {
      endIndex = i;
      break;
    }
  }

  if (endIndex !== -1) {
    // Chèn code vào trước dấu } cuối cùng của class
    return (
      content.slice(0, endIndex) + '\n' + codeToInject + content.slice(endIndex)
    );
  }

  return content;
}

// --- HÀM THAY THẾ NỘI DUNG ---
function replaceContent(content, sourceName, targetName, fileName, fields) {
  const sourcePascal = toPascalCase(sourceName);
  const sourceCamel = toCamelCase(sourceName);
  const sourceKebab = toKebabCase(sourceName);

  const targetPascal = toPascalCase(targetName);
  const targetCamel = toCamelCase(targetName);
  const targetKebab = toKebabCase(targetName);

  // 1. Thay thế tên (Pascal, camel, kebab)
  let newContent = content.split(sourcePascal).join(targetPascal);
  newContent = newContent.split(sourceCamel).join(targetCamel);
  newContent = newContent.split(sourceKebab).join(targetKebab);

  // 2. Inject Fields thông minh dựa trên loại file và tên class
  if (fields && fields.length > 0) {
    if (fileName.includes('.schema.ts')) {
      // Inject vào class Schema chính (VD: Product)
      const schemaClass = targetPascal;
      const code = generateFieldCode(fields, 'schema', false);
      newContent = injectCodeIntoClass(newContent, schemaClass, code);
    } else if (fileName.includes('.entity.ts')) {
      // Inject vào class Entity chính
      const entityClass = targetPascal;
      const code = generateFieldCode(fields, 'entity', false); // Tuân theo user option
      newContent = injectCodeIntoClass(newContent, entityClass, code);
    } else if (fileName.includes('.args.ts') || fileName.includes('.dto.ts')) {
      // 1. Inject vào Create...Args (Tuân theo user option)
      const createClass = `Create${targetPascal}Args`;
      const createCode = generateFieldCode(fields, 'args', false);
      newContent = injectCodeIntoClass(newContent, createClass, createCode);

      // 2. Inject vào Update...Args (Tuân theo user option)
      const updateClass = `Update${targetPascal}Args`;
      const updateCode = generateFieldCode(fields, 'args', true); // Bắt buộc optional cho Update
      newContent = injectCodeIntoClass(newContent, updateClass, updateCode);

      // 3. Inject vào Get...sArgs (Filter - Tuân theo user option)
      // Lưu ý: Tên class filter thường là số nhiều (Products) hoặc thêm chữ s
      // Logic đơn giản: thử tìm class Get...sArgs
      // const filterClass = `Get${targetPascal}sArgs`;
      // const filterCode = generateFieldCode(fields, 'args', false);
      // newContent = injectCodeIntoClass(newContent, filterClass, filterCode);
    }
  }

  return newContent;
}

// --- HÀM COPY ĐỆ QUY ---
function copyRecursiveSync(src, dest, sourceName, targetName, fields) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (path.basename(src) === 'test') return;

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }

    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName),
        sourceName,
        targetName,
        fields,
      );
    });
  } else {
    const content = fs.readFileSync(src, 'utf8');

    const newFileName = path
      .basename(dest)
      .replace(sourceName, toKebabCase(targetName));
    const targetFilePath = path.join(path.dirname(dest), newFileName);

    const newContent = replaceContent(
      content,
      sourceName,
      targetName,
      newFileName,
      fields,
    );

    fs.writeFileSync(targetFilePath, newContent);
    console.log(`Created: ${targetFilePath}`);
  }
}

// --- MAIN ---
async function main() {
  console.log('--- Module Cloner Tool (Pro) ---');

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Lỗi: Không tìm thấy thư mục mẫu tại ${SOURCE_DIR}`);
    process.exit(1);
  }

  // 1. Nhập thông tin cơ bản
  const targetNameInput = await question(
    'Nhập tên module mới (ví dụ: product): ',
  );
  if (!targetNameInput) {
    console.error('Tên không được để trống');
    process.exit(1);
  }

  const parentFolder = await question(
    'Nhập thư mục cha (ví dụ: user, để trống nếu ở root): ',
  );

  // 2. Nhập danh sách Fields
  console.log('\n--- Cấu hình Fields (Nhấn Enter tại tên field để dừng) ---');
  console.log(
    'Supported types: string, number, boolean, date, id, float, json',
  );

  const fields = [];
  while (true) {
    const fieldName = await question(`\nField #${fields.length + 1} Name: `);
    if (!fieldName.trim()) break;

    const fieldType = await question(`   Type [string]: `);
    const isOptionalInput = await question(`   Is Optional? (y/N) [N]: `);

    fields.push({
      name: toCamelCase(fieldName),
      type: fieldType || 'string',
      isOptional: isOptionalInput.toLowerCase() === 'y',
    });
  }

  // 3. Chuẩn bị đường dẫn
  const targetKebab = toKebabCase(targetNameInput);
  const modulesRoot = path.join(__dirname, '../src/modules');
  let targetDir = path.join(modulesRoot, targetKebab);

  if (parentFolder.trim()) {
    targetDir = path.join(modulesRoot, parentFolder, targetKebab);
  }

  if (fs.existsSync(targetDir)) {
    console.error(`Lỗi: Thư mục ${targetDir} đã tồn tại!`);
    process.exit(1);
  }

  console.log(`\nĐang sao chép từ 'demo' sang '${targetNameInput}'...`);
  if (fields.length > 0) {
    console.log(
      `Đang thêm ${fields.length} fields vào Schema, Entity và Args (Create/Update/Filter)...`,
    );
  }

  try {
    copyRecursiveSync(
      SOURCE_DIR,
      targetDir,
      SOURCE_NAME,
      targetNameInput,
      fields,
    );
    console.log(
      '\nHoàn tất! Module mới đã được tạo với logic y hệt module gốc.',
    );
  } catch (err) {
    console.error('Có lỗi xảy ra:', err);
  }

  rl.close();
}

main();
