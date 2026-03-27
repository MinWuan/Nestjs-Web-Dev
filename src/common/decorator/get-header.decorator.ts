import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetHeader = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    // Lấy req từ context bạn đã định nghĩa

    const headers = req?.headers;
    return data ? headers?.[data.toLowerCase()] : headers;
  },
);

// @Query(() => String)
// async myProfile(
//   @GetHeader('authorization') auth: string,
//   @GetHeader('x-signature') signature: string
// ) {
//   console.log('Token:', auth);
//   console.log('Signature:', signature);
//   return 'Done';
// }
