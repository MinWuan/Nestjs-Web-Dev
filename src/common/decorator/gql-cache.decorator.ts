import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { GqlCacheInterceptor, GQL_CACHE_METADATA, GqlCacheOptions } from '../interceptor/gql-cache.interceptor';

export function GqlCache(options?: GqlCacheOptions) {
  return applyDecorators(
    SetMetadata(GQL_CACHE_METADATA, options),
    UseInterceptors(GqlCacheInterceptor),
  );
}
