import { INestApplication } from '@nestjs/common';
import { config } from './config.app';
import { logger } from './common/logger/app.logger';
import {
  AllExceptionsFilter,
  NotFoundFilter,
} from './common/exception/HttpException.filter';
import {
  restValidationPipe,
  graphqlValidationPipe,
  smartValidationPipe,
  SmartValidationPipe,
} from '@/shared/pipes/validation.pipe';
// import * as cookieParser from 'cookie-parser';
import cookieParser = require('cookie-parser');
import { AppLogger } from '@/common/logger/app.logger';
import { LoggingInterceptor } from '@/common/interceptor/logging.interceptor';
import { EncryptionInterceptor } from '@/common/interceptor/encryption.interceptor';
import { ValidationExceptionFilter } from '@/common/exception/ValidationException.filter';

export class RunServer {
  private app: INestApplication;

  constructor(app: INestApplication) {
    this.app = app;
  }

  public start(): void {
    this.initializeApp();
    this.logger();
    this.globalMiddleware();
    this.standardMiddleware();
    this.securityMiddleware();
    this.startServer();
  }

  private initializeApp(): void {
    //initializeEnvFiles();
  }

  //logger
  private logger(): void {
    this.app.useLogger(new AppLogger());
    this.app.useGlobalInterceptors(new LoggingInterceptor(new AppLogger()));
  }

  private globalMiddleware(): void {
    //validation pipe for rest api
    // this.app.useGlobalPipes(restValidationPipe);
    // this.app.useGlobalPipes(graphqlValidationPipe);
    this.app.useGlobalPipes(new SmartValidationPipe());

    this.app.useGlobalInterceptors(new EncryptionInterceptor());
    this.app.useGlobalFilters(
      //new AllExceptionsFilter(),
      new ValidationExceptionFilter(),
      new NotFoundFilter(),
    );
  }

  private standardMiddleware(): void {
    this.app.setGlobalPrefix('/api/v2');
  }

  private securityMiddleware(): void {
    const allowedOrigins = [
      config.CLIENT_URL, // miền 1
      config.CLIENT_URL2, // miền 2
      config.CLIENT_URL3, // miền 3
      config.CLIENT_URL4, // miền 4
    ];

    const corsOptions = {
      origin: function (origin, callback) {
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          var msg =
            '--- The CORS policy for this site does not ' +
            'allow access from the specified Origin ---';
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
      exposedHeaders: [
        'Authorization',
        'content-type',
        'x-encrypted-response',
        'x-encrypted-request',
        'x-signature',
        'Cookie',
        'Set-Cookie',
      ],
      credentials: true, // Nếu bạn cần gửi cookie hoặc thông tin xác thực
    };

    this.app.enableCors(corsOptions);
    this.app.use(cookieParser());
  }

  private async startServer(): Promise<void> {
    try {
      await this.startHttpServer();
    } catch (error) {
      logger.error({ message: 'Failed to start server: ', trace: error });
      process.exit(1);
    }
  }

  private async startHttpServer(): Promise<void> {
    this.app.enableShutdownHooks(); // Kích hoạt các hook tắt ứng dụng
    //Run http server
    await this.app
      .listen(config.PORT, '0.0.0.0')
      .then(() => {
        logger.log('Using environment: ' + config.NODE_ENV);
        logger.log(
          'Using runtime: ' + (process.versions.bun ? 'Bun' : 'Node.js'),
        );
        logger.success(
          `Application is running on: ${`http://${config.HOST}:${config.PORT}`}`,
        );
        if (config.NODE_ENV === 'production') {
          console.log(
            '\x1b[35m%s\x1b[0m',
            `Config:`,
            JSON.stringify(config, null, 2),
          );
        } else if (
          config.NODE_ENV === 'local' ||
          config.NODE_ENV === 'development'
        ) {
          console.log('Config:', JSON.stringify(config, null, 2));
        } else {
          console.log(
            '\x1b[33m%s\x1b[0m',
            'Unknown environment, please check!',
          );
        }
      })
      .catch((err) => {
        logger.error({ message: 'Failed to start server: ', trace: err });
        process.exit(1);
      });
  }
}
