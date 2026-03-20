import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Inject,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Redis } from 'ioredis';
import { of, tap } from 'rxjs';
import { AppLogger } from '@/common/logger/app.logger';

export const GQL_CACHE_METADATA = 'GQL_CACHE_METADATA';
export interface GqlCacheOptions {
  ttl?: number; // TTL tính theo giây
  key?: string; // Tiền tố custom cho cache key
}

@Injectable()
export class GqlCacheInterceptor implements NestInterceptor {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly logger: AppLogger,
    private readonly reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = GqlExecutionContext.create(context);
    const info = ctx.getInfo();
    if (!info || info.operation.operation !== 'query') return next.handle();

    const args = ctx.getArgs();

    // 1. Lấy metadata từ Decorator
    const cacheOptions = this.reflector.getAllAndOverride<GqlCacheOptions>(
      GQL_CACHE_METADATA,
      [context.getHandler(), context.getClass()],
    );

    const cacheKey = cacheOptions?.key
      ? `gql:${cacheOptions.key}:${JSON.stringify(args)}`
      : `gql:${info.fieldName}:${JSON.stringify(args)}`;

    //console.log(`Cache Key: ${cacheKey}, TTL: ${cacheOptions?.ttl}`);

    // 2. Kiểm tra Cache
    const cachedDataStr = await this.redisClient.get(cacheKey);
    if (cachedDataStr) {
      try {
        const cachedData = JSON.parse(cachedDataStr);
        this.logger.log(`Cache hit for key: ${cacheKey}`);
        return of(this.reviveDates(cachedData));
      } catch (e) {
        this.logger.error({
          message: `Failed to parse cached data for key: ${cacheKey}`,
          trace: e instanceof Error ? e.stack : String(e),
        });
      }
    }

    return next.handle().pipe(
      tap(async (data) => {
        if (data) {
          const safeData = JSON.parse(JSON.stringify(data));

          // 3. Sử dụng TTL từ decorator, nếu không có thì dùng mặc định (VD: 10 phút)
          const finalTtl = cacheOptions?.ttl ? cacheOptions.ttl * 1000 : 600000;

          // Lưu vào Redis với thời gian hết hạn theo milliseconds (PX)
          await this.redisClient
            .set(cacheKey, JSON.stringify(safeData), 'PX', finalTtl)
            .catch((e) => {
              this.logger.error({
                message: `Failed to save cache for key: ${cacheKey}`,
                trace: e instanceof Error ? e.stack : String(e),
              });
            });
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
