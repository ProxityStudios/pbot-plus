import { Message } from 'discord.js-light';
import fs from 'fs';
import { promisify } from 'util';

import { ConfigService, ConfigTypes, LoggerTypes, LoggerService } from '..';
import { PbotPlus } from '../../bot';
import { ICommand, CommandContext } from '../../commands';
import { GuildModel } from '../../providers';

const readdir = promisify(fs.readdir);

export class CommandService {
  /**
   * Commands for bot
   */
  public readonly commands = new Map<string, ICommand>();

  private readonly config: ConfigTypes = ConfigService;
  private readonly logger: LoggerTypes = LoggerService;

  /**
   * Initialize the command service
   */
  public initialize(): void {
    try {
      this.config.client.commands.plugins.map(async (plugin: any) => {
        const commands = (
          await readdir(`${__dirname}/../../commands/${plugin}`)
        ).filter((c) => c.endsWith('.js'));

        for (const file of commands) {
          const cleanName = file.replace(/(\..*)/, '');

          const { default: Command } = await import(
            `../../commands/${plugin}/${cleanName}`
          );
          if (!Command) continue;

          const command: ICommand = new Command();
          this.commands.set(command.name, command);
        }
      });
    } catch (error) {
      this.logger.error('Failed while registering commands', error);
    }
  }

  /**
   * Run commands
   * @param pbot
   * @param message
   */
  public async run(pbot: PbotPlus, message: Message): Promise<void> {
    const commandPrefix =
      (await GuildModel.findById(message.guild.id))?.main.prefix ||
      this.config.client.defaultPrefix;

    const slicedContent = message.content.slice(commandPrefix.length);
    try {
      const command = this.getCommand(slicedContent);
      if (!command) return;

      const ctx = new CommandContext(pbot, message, command);
      await command.execute(ctx, ...this.getCommandArgs(slicedContent));
    } catch (error) {
      const content = error?.message ?? 'Un unknown error occurred.';
      await message.channel.send(`Error: ${content}`);
      this.logger.error(
        `Failed while executing command ${this.getCommandName(slicedContent)}`,
        error
      );
    }
  }

  /**
   * Get command
   * @param slicedContent
   * @returns
   */
  private getCommand(slicedContent: string): ICommand {
    const name = this.getCommandName(slicedContent);
    return this.commands.get(name);
  }

  /**
   * Get command args
   * @param slicedContent
   * @returns
   */
  private getCommandArgs(slicedContent: string): string[] {
    return slicedContent.split(' ').slice(1);
  }

  /**
   * Get command name
   * @param slicedContent
   * @returns
   */
  private getCommandName(slicedContent: string): string {
    return slicedContent.toLowerCase().split(' ')[0];
  }
}
