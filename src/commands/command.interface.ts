import { CommandContext } from './command';

export interface IntCommand {
  /**
   * Command name
   */
  name: string;

  /**
   * Command description
   */
  description?: string;

  /**
   * Command example
   */
  example?: string;

  /**
   * Command aliases
   */
  aliases?: string[];

  /**
   * Execute command
   */
  execute: (ctx: CommandContext, ...args: any) => Promise<any> | void;
}
