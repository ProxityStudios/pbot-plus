import { DiscordAPIError } from 'discord.js-light';
import { Response } from 'node-fetch';

import { LevelType } from './level.type';

export class LoggerService {
  /**
   * Log with [INFO] tag
   * @param message
   */
  public static info(message: string): void {
    const log = this.getFormatedContent(message, 'info');
    console.log(log);
  }

  /**
   * Log with [WARN] tag
   * @param message
   */
  public static warn(message: string): void {
    const log = this.getFormatedContent(message, 'warn');
    console.warn(log);
  }

  /**
   * Log with [ERROR] tag
   * @param message
   * @param error
   */
  public static async error(message: string, error?: any): Promise<void> {
    const log = this.getFormatedContent(message, 'error');
    console.error(log);

    if (!error) {
      return;
    }

    switch (error.constructor) {
      case Response: {
        const res = error as Response;
        let resText: string;
        try {
          resText = await res.text();
        } catch (error) {
          this.error(error);
        }
        console.error({
          path: res.url,
          statusCode: res.status,
          statusName: res.statusText,
          headers: res.headers.raw(),
          body: resText
        });
        break;
      }
      case DiscordAPIError: {
        const discordError = error as DiscordAPIError;
        console.error({
          message: discordError.message,
          code: discordError.code,
          statusCode: discordError.httpStatus,
          method: discordError.method,
          path: discordError.path,
          stack: discordError.stack
        });
        break;
      }
      default: {
        console.error(error);
        break;
      }
    }
  }

  /**
   *  Get formated content
   * @param message
   * @param level
   * @returns Formated content
   */
  private static getFormatedContent(message: string, level: LevelType): string {
    return `[${new Date().toLocaleString()}] [${level.toUpperCase()}] ⁒ ${message}`;
  }
}
