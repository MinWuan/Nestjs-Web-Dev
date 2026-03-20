import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Inject,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { of, tap } from 'rxjs';
import { AppLogger } from '@/common/logger/app.logger';

export const GQL_CACHE_MANAGER_METADATA = 'GQL_CACHE_MANAGER_METADATA';
export interface GqlCacheManagerOptions {
  ttl?: number; // TTL tính theo giây
  key?: string; // Tiền tố custom cho cache key
}

@Injectable()
export class GqlCacheManagerInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly logger: AppLogger,
    private readonly reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = GqlExecutionContext.create(context);
    const info = ctx.getInfo();
    if (!info || info.operation.operation !== 'query') return next.handle();

    const args = ctx.getArgs();

    // 1. Lấy metadata từ Decorator
    const cacheOptions =
      this.reflector.getAllAndOverride<GqlCacheManagerOptions>(
        GQL_CACHE_MANAGER_METADATA,
        [context.getHandler(), context.getClass()],
      );

    const cacheKey = cacheOptions?.key
      ? `${cacheOptions.key}:${JSON.stringify(args)}`
      : `gql:${info.fieldName}:${JSON.stringify(args)}`;

    //console.log(`CacheManager Key: ${cacheKey}, TTL: ${cacheOptions?.ttl}`);

    // 2. Kiểm tra Cache
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
      return of(this.reviveDates(cachedData));
    }

    return next.handle().pipe(
      tap(async (data) => {
        if (data) {
            console.log("Data to cache:", data);
          const safeData = JSON.parse(JSON.stringify(data));

          // 3. Sử dụng TTL từ decorator, nếu không có thì dùng mặc định (VD: 10 phút)
          // Lưu ý: cache-manager mới nhất dùng ms, nên ttl * 1000
          const finalTtl = cacheOptions?.ttl ? cacheOptions.ttl * 1000 : 600000;

          await this.cacheManager.set(cacheKey, safeData, finalTtl).catch((e) => {
            this.logger.error({
              message: `Failed to set cache for key: ${cacheKey}`,
              trace: e instanceof Error ? e.stack : String(e),
            });
          });
          this.logger.log(`Cache set for key: ${cacheKey}`);
        }
      }),
    );
  }

  private reviveDates(data: any): any {
    if (typeof data !== 'object' || data === null) return data;
    for (const key in data) {
      const val = data[key];
      if (
        typeof val === 'string' &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(val)
      ) {
        data[key] = new Date(val);
      } else if (typeof val === 'object') {
        this.reviveDates(val);
      }
    }
    return data;
  }
}
