import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const AuthData = createParamDecorator(
  (data: string = 'auth', context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    // Trả về cái user mà ta đã gán ở AuthGuard bước 1
    return request[data] as AuthPayload;
  },
);
