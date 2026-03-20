import { Injectable, LoggerService } from '@nestjs/common';
import { paint, color } from './ansi';

@Injectable()
export class AppLogger implements LoggerService {
  private prefix?: string;

  setPrefix(prefix: string) {
    this.prefix = prefix;
    return this;
  }

  withPrefix(prefix: string) {
    const logger = new AppLogger();
    logger.prefix = prefix;
    return logger;
  }

  private time(): string {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(
      d.getSeconds(),
    )} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  }

  private print(
    level: string,
    levelColor: string,
    message: string,
    meta?: any,
  ) {
    // PROD (nếu bạn vẫn muốn JSON thì bật, không thì bỏ luôn block này)

    // console.log({
    //   timestamp: new Date().toISOString(),
    //   level,
    //   message,
    //   ...meta,
    // });

    const time = paint(this.time(), color.gray);
    const lvl = paint(level.padEnd(5), levelColor);
    const prefix = this.prefix
      ? paint(`[${this.prefix}]`, color.brightGreen)
      : paint(`[AppLogger]`, color.brightGreen);

    if (meta && Object.keys(meta).length) {
      console.log(`${prefix} ${time} ${lvl} ${message}`);
      console.log(paint('↳ meta:', color.gray), meta);
    } else {
      console.log(`${prefix} ${time} ${lvl} ${message}`);
    }
  }

  log(message: string, meta?: any) {
    this.print('INFO', color.brightBlue, message, meta);
  }

  success(message: string, meta?: any) {
    this.print('SUCCESS', color.brightGreen, message, meta);
  }

  warn(message: string, meta?: any) {
    this.print('WARN', color.yellow, message, meta);
  }

  error(data: { message: string; meta?: any; trace?: any }) {
    this.print('ERROR', color.red, data.message, data.meta);

    if (data.trace) {
      console.error(paint('↳ trace:', color.red));
      console.error(data.trace);
    }
  }

  debug(message: string, meta?: any) {
    this.print('DEBUG', color.magenta, message, meta);
  }
}

export const logger = new AppLogger();
