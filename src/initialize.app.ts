// import * as path from 'path';
// import * as fs from 'fs';
// import { logger } from './common/util/logger';

// const fileEnvProduction = path.join(__dirname, '../.env.production');
// const fileEnvLocal = path.join(__dirname, '../.env.local');

// const createFile = async (filePath: string, content: any) => {
//   try {
//     fs.writeFileSync(filePath, content || '');
//     console.log(`------ File ${filePath} is created ------`);
//   } catch (error) {
//     console.error(`------ Error creating file: ${filePath}: ------`, error);
//   }
// };

// export const initializeEnvFiles = async () => {
//   if (!fs.existsSync(fileEnvProduction)) {
//     await createFile(fileEnvProduction, `# Nhập các biến môi trường vào đây`);
//     logger.yellow(
//       `Vui lòng cung cấp các biến môi trường trong file: .env.production`,
//     );
//     process.exit(1);
//   }
//   if (!fs.existsSync(fileEnvLocal)) {
//     await createFile(fileEnvLocal, `# Nhập các biến môi trường vào đây`);
//     logger.yellow(
//       `Vui lòng cung cấp các biến môi trường trong file: .env.local`,
//     );
//     process.exit(1);
//   }
// };
