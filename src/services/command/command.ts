import { Message } from 'discord.js-light';
import fs from 'fs';
import { promisify } from 'util';

import { PbotPlus } from '../../bot';
import { IntCommand, CommandContext } from '../../commands';

const readdir = promisify(fs.readdir);

export class CommandService {
  /**
   * Commands for bot
   */
  public readonly commands = new Map<string, IntCommand>();

  /**
   * @param pbot
   */
  constructor(protected pbot: PbotPlus) {}

  /**
   * Initialize the command service
   */
  public _initialize(): void {
    try {
      this.pbot.config.client.commands.plugins.map(async (plugin: any) => {
        const commandsPath = `${__dirname}/../../commands/${plugin}`;
        const commands = (await readdir(commandsPath)).filter((c) =>
          c.endsWith('.js')
        );

        for (const file of commands) {
          const cleanName = file.replace(/(\..*)/, '');
          const { default: Command } = await import(
            `${commandsPath}/${cleanName}`
          );

          if (!Command) continue;

          const command: IntCommand = new Command();
          this.commands.set(command.name, command);
        }
      });
    } catch (error) {
      this.pbot.logger.error('Failed while registering commands', error);
    }
  }

  /**
   * Run commands
   * @param pbot
   * @param message
   */
  public async run(message: Message): Promise<void> {
    const commandPrefix =
      (await this.pbot.database.findGuildById(message.guild.id))?.main.prefix ||
      this.pbot.config.client.defaultPrefix;
    const slicedContent = message.content.slice(commandPrefix.length);

    try {
      const command = this.getCommand(slicedContent);
      if (!command) return;

      const ctx = new CommandContext(this.pbot, message, command);
      await command.execute(ctx, ...this.getCommandArguments(slicedContent));
    } catch (error) {
      const content = error?.message ?? 'Un unknown error occurred.';
      await message.channel.send(this.pbot.embed.error(`Error: ${content}`));
      this.pbot.logger.error(
        `Failed while executing command ${this.getCommandName(slicedContent)}`,
        error
      );
    }
  }

  /**
   * Get command
   * @param slicedContent
   * @returns Command
   */
  private getCommand(slicedContent: string): IntCommand {
    const name = this.getCommandName(slicedContent);
    return this.commands.get(name) ?? this.getCommandByAliases(name);
  }

  /**
   * Get command by aliases
   * @param name
   * @returns Command aliases
   */
  private getCommandByAliases(name: string): IntCommand {
    return Array.from(this.commands.values()).find((c) =>
      c.aliases?.some((a) => a === name)
    );
  }

  /**
   * Get command arguments
   * @param slicedContent
   * @returns
   */
  private getCommandArguments(slicedContent: string): string[] {
    return slicedContent.split(' ').slice(1);
  }

  /**
   * Get command name
   * @param slicedContent
   * @returns Command name
   */
  private getCommandName(slicedContent: string): string {
    return slicedContent.toLowerCase().split(' ')[0];
  }
}
