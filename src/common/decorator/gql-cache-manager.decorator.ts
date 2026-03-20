import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import {
  GqlCacheManagerInterceptor,
  GQL_CACHE_MANAGER_METADATA,
  GqlCacheManagerOptions,
} from '../interceptor/gql-cache-manager.interceptor';

export function GqlCacheManager(options?: GqlCacheManagerOptions) {
  return applyDecorators(
    SetMetadata(GQL_CACHE_MANAGER_METADATA, options),
    UseInterceptors(GqlCacheManagerInterceptor),
  );
}
