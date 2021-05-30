import { Constants, Message, MessageEmbed } from 'discord.js-light';
import { Connection } from 'mongoose';

import { CustomClient } from './extensions';
import { DatabaseProvider } from './providers';
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
   * MongoDB database
   */
  public database!: Connection;

  /**
   * @param client Client
   */
  constructor(private client: CustomClient) {}

  /**
   * Initialize the bot
   */
  public async initialize(): Promise<void> {
    try {
      await this.registerProviders();
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
   * Register providers
   */
  private async registerProviders(): Promise<void> {
    const database = new DatabaseProvider(this.config, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    await database.initialize();
    this.database = database.getConnection();
  }

  /**
   * On message
   * @param message
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
