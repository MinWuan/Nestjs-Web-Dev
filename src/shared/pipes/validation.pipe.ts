import {
  ValidationPipeOptions,
  BadRequestException,
  ValidationPipe,
  ArgumentMetadata,
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
    return RestAppException.BadRequest({
      errorCode: 'VALIDATION_ERROR',
      message: 'Dữ liệu đầu vào không hợp lệ!',
      details: formattedErrors.length > 0 ? formattedErrors : undefined,
    });
  },
});

export const graphqlValidationPipe = new ValidationPipe({
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

export const smartValidationPipe = new ValidationPipe({
  whitelist: false, // loại bỏ các thuộc tính không được định nghĩa trong DTO
  transform: true, // chuyển đổi kiểu dữ liệu
  validateCustomDecorators: true, // bật validation cho custom decorators
  exceptionFactory: (errors: ValidationError[]) => {
    // Hàm format lỗi lồng nhau của bạn
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

    // Thay vì return trực tiếp Exception của REST hoặc GraphQL,
    // ta ném ra một "Generic Validation Exception" để Filter xử lý sau
    return new BadRequestException({
      code: 'VALIDATION_ERROR',
      message: 'Dữ liệu đầu vào không hợp lệ!',
      formattedErrors: formattedErrors,
      rawErrors: errors, // Giữ lại để GraphQL dùng nếu cần
    });
  },
});

export class SmartValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      //whitelist: true, // Tắt mặc định để không lỗi GraphQL
      //forbidNonWhitelisted: true, // Ném lỗi nếu có thuộc tính không được định nghĩa trong DTO
      validateCustomDecorators: true, //Bật validation cho custom decorators
      transformOptions: {
        enableImplicitConversion: true, // Tự động đoán kiểu dữ liệu dựa trên Type của TS
      },
      exceptionFactory: (errors: ValidationError[]) => {
        // Hàm format lỗi lồng nhau của bạn
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

        // Thay vì return trực tiếp Exception của REST hoặc GraphQL,
        // ta ném ra một "Generic Validation Exception" để Filter xử lý sau
        return new BadRequestException({
          code: 'VALIDATION_ERROR',
          message: 'Dữ liệu đầu vào không hợp lệ!',
          formattedErrors: formattedErrors,
          rawErrors: errors, // Giữ lại để GraphQL dùng nếu cần
        });
      },
    });
  }

  // async transform(value: any, metadata: ArgumentMetadata) {
  //   const isGraphQL = metadata?.data === 'input';
   
  //   // Can thiệp trực tiếp vào object options nội bộ của ValidationPipe
  //   const options = (this as any).validatorOptions;

  //   if (options) {
  //     options.whitelist = !isGraphQL;
  //     options.forbidNonWhitelisted = !isGraphQL;
  //   }

  //   return super.transform(value, metadata);
  // }
}
