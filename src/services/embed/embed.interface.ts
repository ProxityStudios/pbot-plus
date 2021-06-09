import { MessageEmbedOptions } from 'discord.js';

export interface IntEmbed extends MessageEmbedOptions {
  withTips?: boolean;
}
