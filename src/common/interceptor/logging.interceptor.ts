import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AppLogger } from '../logger/app.logger';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {
    this.logger.setPrefix('LoggingInterceptor');
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    const start = Date.now();

    const ctxType = context.getType();

    //console.log('ctxType: ', ctxType);
    let meta: any = {};

    if ((ctxType as string) === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const info = gqlCtx.getInfo();
      const req = gqlCtx.getContext().req;
      const headers = req ? req.headers : {};
      const requestId = Date.now();
      meta = {
        requestId,
        type: 'GraphQL',
        field: info.fieldName,
        variables: this.maskSensitive(gqlCtx.getArgs()),
        headers,
      };
      this.logger.log(`❄️ ➤`, meta);
    } else if ((ctxType as string) === 'http') {
      const req = context.switchToHttp().getRequest();
      const headers = req ? req.headers : {};
      const requestId = Date.now();
      meta = {
        requestId,
        type: 'HTTP',
        method: req.method,
        url: req.url,
        body: this.maskSensitive(req.body),
        headers,
      };
      this.logger.log(`🌐 ➤`, meta);
    }

    return next.handle().pipe(
      tap((res) => {
        this.logger.log(`${meta?.type === 'HTTP' ? '🌐' : '❄️'} ➤ 🟢 [${meta.requestId}] | ${Date.now() - start}ms | ${JSON.stringify(res)?.length} bytes`, 
      );
      }),
    );
  }

  private maskSensitive(data: any) {
    if (!data) return data;

    const clone = JSON.parse(JSON.stringify(data));
    ['password', 'token', 'email', 'phone'].forEach((key) => {
      if (clone[key]) clone[key] = '***';
    });
    return clone;
  }
}
