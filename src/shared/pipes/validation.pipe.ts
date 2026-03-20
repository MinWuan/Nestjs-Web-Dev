import {
  ValidationPipeOptions,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import { GraphQLError } from 'graphql';

import { ValidationError } from 'class-validator';
import { RestAppException } from '@/common/exception/RestAppException';

export const restValidationPipe = new ValidationPipe({
  whitelist: true, // loại bỏ các thuộc tính không được định nghĩa trong DTO
  transform: true, // chuyển đổi kiểu dữ liệu
  forbidNonWhitelisted: true, // ném lỗi nếu có thuộc tính không được định nghĩa trong DTO
  forbidUnknownValues: true, // ném lỗi nếu có giá trị không phải là object hoặc array
  transformOptions: { enableImplicitConversion: false }, // tắt chuyển đổi kiểu ngầm định để tránh lỗi không mong muốn
  exceptionFactory: (errors: ValidationError[]) => {
    const formatErrors = (
      errors: ValidationError[],
      parent?: string,
    ): any[] => {
      return errors.flatMap((err) => {
        const field = parent ? `${parent}.${err.property}` : err.property;

        if (err.children && err.children.length > 0) {
          return formatErrors(err.children, field);
        }

        return {
          field,
          message: Object.values(err.constraints || {}).join(', '),
        };
      });
    };

    const formattedErrors = formatErrors(errors);

    // return new BadRequestException({
    //   message: 'Dữ liệu đầu vào không hợp lệ!',
    //   details: formattedErrors.length > 0 ? formattedErrors : undefined,
    // });
    return RestAppException.BadRequest(
      'Dữ liệu đầu vào không hợp lệ!',
      'VALIDATION_ERROR',
      formattedErrors.length > 0 ? formattedErrors : undefined,
    );
  },
});

export const graphqlValidationPipe: ValidationPipe = new ValidationPipe({
  whitelist: false, // loại bỏ các thuộc tính không được định nghĩa trong DTO
  transform: true, // chuyển đổi kiểu dữ liệu
  validateCustomDecorators: true, // bật validation cho custom decorators

  exceptionFactory: (errors: ValidationError[]) => {
    // const formattedErrors = errors.map((err: ValidationError) => ({
    // }));
    return new GraphQLError('Dữ liệu đầu vào không hợp lệ!', {
      extensions: {
        code: 'VALIDATION_ERROR',
        details: errors,
      },
    });
  },
});
