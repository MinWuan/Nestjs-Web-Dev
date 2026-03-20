import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const DeviceId = createParamDecorator(
  (headerName: string = 'x-device-id', context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    // Guard clause: Nếu req không tồn tại (lỗi config context)
    if (!req || !req.headers) return null;
    //console.log('Request Headers:', req.headers);
    // Lấy header theo key (mặc định là 'x-device-id')
    // Header key luôn là lowercase
    return req.headers[headerName.toLowerCase()];
  },
);
