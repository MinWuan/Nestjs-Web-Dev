const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// CẤU HÌNH MẶC ĐỊNH
// Đường dẫn tới module mẫu (Demo)
const SOURCE_DIR = path.join(__dirname, '../src/modules/role');
// Tên gốc cần thay thế
const SOURCE_NAME = 'role';

// Hàm tiện ích chuyển đổi tên
const toPascalCase = (str) => {
  // Xử lý cả dấu gạch nối, gạch dưới và camelCase
  // "user-member" -> "UserMember"
  // "user_member" -> "UserMember"
  // "userMember" -> "UserMember"
  return str
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
    .replace(/^[a-z]/, (char) => char.toUpperCase());
};

const toCamelCase = (str) => {
  // "user-member" -> "userMember"
  // "user_member" -> "userMember"
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

const toKebabCase = (str) => {
  // "UserMember" -> "user-member"
  // "userMember" -> "user-member"
  // "user-member" -> "user-member"
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();
};

// Hàm thay thế nội dung
function replaceContent(content, sourceName, targetName) {
  const sourcePascal = toPascalCase(sourceName);
  const sourceCamel = toCamelCase(sourceName);
  const sourceKebab = toKebabCase(sourceName);

  const targetPascal = toPascalCase(targetName);
  const targetCamel = toCamelCase(targetName);
  const targetKebab = toKebabCase(targetName);

  // Thứ tự thay thế quan trọng để tránh lỗi chồng chéo
  // 1. Thay thế PascalCase (Demo -> Product)
  let newContent = content.split(sourcePascal).join(targetPascal);

  // 2. Thay thế camelCase (demo -> product)
  // Lưu ý: việc này cũng sẽ thay thế 'demos' thành 'products' nếu từ gốc là số nhiều
  newContent = newContent.split(sourceCamel).join(targetCamel);

  // 3. Thay thế kebab-case (user-demo -> user-product) nếu có
  newContent = newContent.split(sourceKebab).join(targetKebab);

  return newContent;
}

function copyRecursiveSync(src, dest, sourceName, targetName) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    // Bỏ qua thư mục test
    if (path.basename(src) === 'test') {
      return;
    }

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }

    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName),
        sourceName,
        targetName,
      );
    });
  } else {
    // Đọc nội dung file gốc
    const content = fs.readFileSync(src, 'utf8');

    // Thay thế nội dung
    const newContent = replaceContent(content, sourceName, targetName);

    // Đổi tên file - xử lý tất cả các case variants
    const sourcePascal = toPascalCase(sourceName);
    const sourceCamel = toCamelCase(sourceName);
    const sourceKebab = toKebabCase(sourceName);
    
    const targetPascal = toPascalCase(targetName);
    const targetCamel = toCamelCase(targetName);
    const targetKebab = toKebabCase(targetName);
    
    let newFileName = path.basename(dest);
    // Thay thế PascalCase trước (Demo -> Product)
    newFileName = newFileName.split(sourcePascal).join(targetPascal);
    // Thay thế camelCase (demo -> product)
    newFileName = newFileName.split(sourceCamel).join(targetCamel);
    // Thay thế kebab-case (demo -> product)
    newFileName = newFileName.split(sourceKebab).join(targetKebab);
    
    const targetFilePath = path.join(path.dirname(dest), newFileName);

    fs.writeFileSync(targetFilePath, newContent);
    console.log(`Created: ${targetFilePath}`);
  }
}

async function main() {
  console.log('--- Module Cloner Tool ---');
  console.log(`Source Module: ${SOURCE_DIR}`);

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Lỗi: Không tìm thấy thư mục module mẫu (${SOURCE_NAME})!`);
    process.exit(1);
  }

  let targetNameInput;
  let parentFolder;

  // Hỗ trợ tham số dòng lệnh: node scripts/clone-module.js <tên_module> [thư_mục_cha]
  const args = process.argv.slice(2);
  if (args.length > 0) {
    targetNameInput = args[0];
    parentFolder = args[1] || '';
    console.log(`Nhận được: tên='${targetNameInput}', cha='${parentFolder}'`);
  } else {
    targetNameInput = await new Promise((resolve) =>
      rl.question('Nhập tên module mới (ví dụ: product): ', resolve),
    );
    parentFolder = await new Promise((resolve) =>
      rl.question(
        'Nhập thư mục cha (ví dụ: user, để trống nếu nằm ở root modules): ',
        resolve,
      ),
    );
  }

  const targetKebab = toKebabCase(targetNameInput);

  // Xác định đường dẫn đích
  const modulesRoot = path.join(__dirname, '../src/modules');
  let targetDir = path.join(modulesRoot, targetKebab);

  if (parentFolder.trim()) {
    targetDir = path.join(modulesRoot, parentFolder, targetKebab);
  }

  if (fs.existsSync(targetDir)) {
    console.error(`Lỗi: Thư mục ${targetDir} đã tồn tại!`);
    process.exit(1);
  }

  console.log(`\nĐang sao chép từ ${SOURCE_NAME}} sang '${targetNameInput}'...`);

  try {
    copyRecursiveSync(SOURCE_DIR, targetDir, SOURCE_NAME, targetNameInput);
    console.log(
      '\nHoàn tất! Module mới đã được tạo với logic y hệt module gốc.',
    );
  } catch (err) {
    console.error('Có lỗi xảy ra:', err);
  }

  rl.close();
}

main();
//node scripts/clone-module.js
