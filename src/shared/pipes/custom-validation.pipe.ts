// import {
//   PipeTransform,
//   Injectable,
//   ArgumentMetadata,
//   BadRequestException,
// } from '@nestjs/common';
// import { validate } from 'class-validator';
// import { plainToInstance } from 'class-transformer';

// //bị lỗi khi không truyền tham số trong object
// @Injectable()
// export class CustomValidationPipe implements PipeTransform {
//   async transform(value: any, metadata: ArgumentMetadata) {
//     if (!metadata.metatype || !this.isCustomClass(metadata.metatype)) {
//       return value;
//     }

//     const object = plainToInstance(metadata.metatype, value);
//     const errors = await validate(object);

//     if (errors.length > 0) {
//       const formattedErrors = errors.map((err) => ({
//         field: err.property,
//         message: Object.values(err.constraints || {}).join(', '),
//       }));

//       throw new BadRequestException({
//         statusCode: 400,
//         message: 'Dữ liệu đầu vào không hợp lệ!',
//         errors: formattedErrors,
//       });
//     }

//     return value;
//   }

//   private isCustomClass(metatype: Function): boolean {
//     const builtInTypes: Function[] = [String, Boolean, Number, Array, Object];
//     return !builtInTypes.includes(metatype);
//   }
// }
