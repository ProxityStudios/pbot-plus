import { DiscordAPIError } from 'discord.js-light';
import { Response } from 'node-fetch';

export class LoggerService {
  /**
   * Log with [INFO] tag
   * @param message
   */
  public static info(message: string): void {
    const log = `[INFO] ${message}`;
    console.log(log);
  }

  /**
   * Log with [WARN] tag
   * @param message
   */
  public static warn(message: string): void {
    const log = `[WARN] ${message}`;
    console.warn(log);
  }

  /**
   * Log with [ERROR] tag
   *
   * @param message
   * @param error
   */
  public static async error(message: string, error?: any): Promise<void> {
    const log = `[ERROR] ${message}`;
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
        } catch (err) {
          this.error(err);
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
}
