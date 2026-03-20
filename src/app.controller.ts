import { Controller, Get, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from '@/config.app';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('dev')
export class AppController {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Get('generate-signature')
  generateSignature() {
    // Chỉ hoạt động trên môi trường phát triển (local)
    if (config.NODE_ENV === 'production') {
      throw new UnauthorizedException('Not allowed in production');
    }

    const payload = {
      // Dữ liệu tuỳ chỉnh nếu cần
    };

    const signature = this.jwtService.sign(payload, {
      secret: config.SINATURE_KEY,
      algorithm: 'HS256',
      audience: 'server',
      issuer: 'client',
      subject: 'signature',
      expiresIn: '1d', // Thời gian tồn tại của chữ ký
    });

    return { 
      signature,
      message: "Vui lòng copy signature này vào header 'x-signature'" 
    };
  }

  @Get('cache')
  async getCacheInfo() {
    // Chỉ hoạt động trên môi trường phát triển (local)
    if (config.NODE_ENV === 'production') {
      throw new UnauthorizedException('Not allowed in production');
    }

    try {
      const cacheAny = this.cacheManager as any;
      const stores = Array.isArray(cacheAny.stores) ? cacheAny.stores : [cacheAny.store || cacheAny];
      
      const keys: string[] = [];
      const cacheData: Record<string, any> = {};

      for (const store of stores) {
        // cache-manager v5+ thường bọc store qua đối tượng có function iterator()
        if (store && typeof store.iterator === 'function') {
          for await (const [key, value] of store.iterator()) {
            keys.push(key);
            // Có thể lấy value trực tiếp hoặc qua cacheManager.get
            cacheData[key] = await this.cacheManager.get(key);
            
            // Lấy thêm thông tin ttl/expires qua hàm getRaw nếu có (cache-manager v5/keyv)
            if (typeof store.getRaw === 'function') {
              const rawData = await store.getRaw(key);
              if (rawData && rawData.expires) {
                const ttlMs = rawData.expires - Date.now();
                // Lưu thêm thông tin ttl vào cacheData
                cacheData[key] = {
                  value: cacheData[key],
                  expiresAt: new Date(rawData.expires).toISOString(),
                  ttlSeconds: ttlMs > 0 ? Math.round(ttlMs / 1000) : 0
                };
              }
            }
          }
        } else if (store?.store && typeof store.store.keys === 'function') {
          // Fallback cho in-memory cơ bản
          for (const key of store.store.keys()) {
            const cleanKey = key.toString().replace(/^keyv:/, '');
            if (!keys.includes(cleanKey)) {
              keys.push(cleanKey);
              cacheData[cleanKey] = await this.cacheManager.get(cleanKey);
            }
          }
        }
      }

      if (keys.length === 0 && Object.keys(cacheData).length === 0) {
         return {
           message: "Cache hiện đang rỗng hoặc Cache Store không hỗ trợ lấy danh sách keys().",
           total: 0,
           keys: [],
           data: {}
         }
      }

      return {
        total: keys.length,
        keys,
        data: cacheData,
      };
    } catch (error: any) {
      return {
        error: error.message,
        message: "Đã xảy ra lỗi khi lấy dữ liệu cache từ cache-manager."
      };
    }
  }
}
