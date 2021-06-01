import { CommandContext } from './command';

export interface ICommand {
  /**
   * Command name
   */
  name: string;

  /**
   * Execute command
   */
  execute: (ctx: CommandContext, ...args: any) => Promise<any> | void;
}
