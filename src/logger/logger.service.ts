import { ConsoleLogger, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { appendFile, mkdir } from 'fs/promises';
import path from 'path';

interface LogPayload {
  message: string;
  context?: string;
  ip?: string;
  userId?: string;
  requestId?: string;
  [key: string]: any;
}

@Injectable()
export class LoggerService extends ConsoleLogger {
  private readonly logDir = path.join(__dirname, '..', '..', 'logs');

  constructor(private readonly ctx: string = 'App') {
    super(ctx);
  }

  private async writeToFile(level: string, payload: LogPayload): Promise<void> {
    if (!existsSync(this.logDir)) await mkdir(this.logDir);

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      context: payload.context ?? this.ctx,
      ...payload,
    };

    const fileName = level === 'error' ? 'error.log' : 'app.log';

    await appendFile(
      path.join(this.logDir, fileName),
      JSON.stringify(logEntry) + '\n',
    );
  }

  logWithPayload(
    message: string,
    payload: Omit<LogPayload, 'message'> = {},
  ): void {
    const data = { message, ...payload };
    this.writeToFile('log', data).catch(console.error);
    super.log(message, payload.context);
  }

  errorWithPayload(message: string, payload: Omit<LogPayload, 'message'> = {}) {
    const data = { message, ...payload };
    this.writeToFile('error', data).catch(console.error);
    super.error(message, payload.context);
  }
}
