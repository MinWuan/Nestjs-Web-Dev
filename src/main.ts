import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RunServer } from './server.app';
import { logger } from './common/logger/app.logger';
import { ConsoleLogger } from '@nestjs/common';

declare const module: any;


class Application {
  public async initialize(): Promise<void> {
    const app = await NestFactory.create(AppModule, {
      logger: new ConsoleLogger({
        prefix: 'App',
        timestamp: true,
        colors: true,
        logLevels: ['log', 'error', 'warn', 'debug', 'verbose'],
      }),
    });


    
    app.enableShutdownHooks();// Kích hoạt các hook tắt ứng dụng
    const server = new RunServer(app);
    server.start();

    // Hot Module Replacement
    if (typeof module !== 'undefined' && module.hot) {
      module.hot.accept();
      module.hot.dispose(() => {
        // Bọc trong try-catch để nếu app cũ chết không toàn thây
        // thì app mới vẫn chạy tiếp được, không bị văng ra ngoài.
        try {
          app.close();
        } catch (error) {
          logger.error({ message: 'Error during HMR dispose: ', trace: error });
        }
      });
    }
    //Application.handleExit();
  }

  private static handleExit(): void {
    process.on('uncaughtException', (error: Error) => {
      logger.error({ message: 'Uncaught Exception: ', trace: error });
      //Application.shutDownProperly(1);
    });

    process.on('unhandleRejection', (reason: Error) => {
      logger.error({ message: 'Unhandled Rejection: ', trace: reason });
      //Application.shutDownProperly(2);
    });

    process.on('SIGTERM', () => {
      logger.warn('⚠ Caught SIGTERM');
      //Khi nhận được tín hiệu SIGTERM, ta sẽ tiến hành tắt ứng dụng một cách an toàn
      //Application.shutDownProperly(2);
    });

    process.on('SIGINT', () => {
      logger.warn('⚠ Caught SIGINT');
      //Khi nhận được tín hiệu SIGINT (Ctrl+C), ta sẽ tiến hành tắt ứng dụng một cách an toàn
      //Application.shutDownProperly(2);
    });

    process.on('exit', (listener) => {
      logger.log(`🔵 Application exiting with code: ${listener}`);
    });
  }

  private static shutDownProperly(exitCode: number): void {
    Promise.resolve()
      .then(() => {
        logger.warn('🔴 Shutting down application...');
        //process.exit(exitCode);
      })
      .catch((error) => {
        // log.error(`Error during shutdown: ${error}`);
        logger.error({ message: 'Error during shutdown: ', trace: error });
        //process.exit(1);
      });
  }
}

const application: Application = new Application();
application.initialize();
