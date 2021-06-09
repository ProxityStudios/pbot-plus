import { Message, MessageEmbed } from 'discord.js';

import { PbotPlus } from '../../bot';
import { IntEmbed } from './embed.interface';
import { EmojiType } from './emoji.type';

export class EmbedService {
  /**
   * Embed service
   * @param pbot
   */
  constructor(protected pbot: PbotPlus) {}

  /**
   * Create error embed
   * @param content
   * @returns Message Embed
   */
  public error(content: string): MessageEmbed {
    return new MessageEmbed({
      color: this.pbot.config.color.error,
      description: `${this.getEmoji('error')} ${content}`
    });
  }

  /**
   * Create warn embed
   * @param content
   * @returns Message Embed
   */
  public warn(content: string): MessageEmbed {
    return new MessageEmbed({
      color: this.pbot.config.color.warn,
      description: `${this.getEmoji('warn')} ${content}`
    });
  }

  /**
   * Create success embed
   * @param content
   * @returns Message Embed
   */
  public success(content: string): MessageEmbed {
    return new MessageEmbed({
      color: this.pbot.config.color.success,
      description: `${this.getEmoji('success')} ${content}`
    });
  }

  /**
   * Create info embed
   * @param withTips
   * @param options
   * @param color
   * @returns Message Embed
   */
  public async info(
    message: Message,
    options: IntEmbed
  ): Promise<MessageEmbed> {
    const prefix =
      (await this.pbot.database.findGuildById(message.guild.id))?.main.prefix ??
      this.pbot.config.client.defaultPrefix;
    const tip = this.getRandomTip().replace('{{prefix}}', prefix);

    return options.withTips
      ? new MessageEmbed({
          ...options,
          color: this.pbot.config.color.info,
          footer: { text: `TIP: ${tip}` }
        })
      : new MessageEmbed({
          ...options,
          color: this.pbot.config.color.info
        });
  }

  /**
   * Get random tip
   * @returns Tip
   */
  private getRandomTip(): string {
    const commandTips = this.pbot.config.tips;
    return commandTips[Math.floor(Math.random() * commandTips.length)];
  }

  /**
   * Get emoji
   * @param name
   * @returns Emoji
   */
  private getEmoji(name: EmojiType): string {
    return `<:${name}:${this.pbot.config.emojis[name]}>`;
  }
}
