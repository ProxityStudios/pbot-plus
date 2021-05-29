import { Client, Constants, Message, MessageEmbed } from 'discord.js-light';

import { ILogger, Logger, Config } from './services';

export default class PbotPlus {
  /**
   * Custom logger for Pbot-plus
   */
  public logger: ILogger = Logger;

  /**
   * Configuration files for Pbot-plus
   */
  public readonly config = Config;

  /**
   * @param client Client
   */
  constructor(private client: Client) {}

  /**
   * Initialize the bot
   */
  public async initialize(): Promise<void> {
    try {
      this.registerListeners();
      await this.client.login(this.config.client.token);
    } catch (err) {
      this.logger.error('Failed while initializing to the bot', err);
    }
  }

  /**
   * Register listeners
   */
  private registerListeners(): void {
    // on message
    this.client.on(Constants.Events.MESSAGE_CREATE, (message: Message) =>
      this.onMessage(message)
    );

    // on ready
    this.client.on(Constants.Events.CLIENT_READY, () => this.onReady());
  }

  /**
   * On message
   * @param message
   * @returns
   */
  private onMessage(message: Message): void {
    if (message.author.bot ?? !message.guild?.member) return;

    const DevelopingErrorEmbed = new MessageEmbed({
      color: this.config.color.error,
      description:
        'I am currently under development so only my developers can use my commands'
    });

    if (
      message.content.match(new RegExp(`^<@!?${this.client.user?.id}>( |)$`))
    ) {
      message.channel.send(DevelopingErrorEmbed);
    } else if (message.content.startsWith(this.config.client.prefix)) {
      message.channel.send(DevelopingErrorEmbed);
    }
  }

  /**
   * On ready
   */
  private onReady(): void {
    this.logger.info(`Signed in as ${this.client.user?.tag}`);
  }
}
