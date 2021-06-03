import { Constants, Guild, Message, MessageEmbed } from 'discord.js-light';

import { CustomClient } from './extensions';
import { DatabaseProvider, GuildModel } from './providers';
import {
  LoggerTypes,
  LoggerService,
  ConfigService,
  ConfigTypes,
  CommandService
} from './services';

export class PbotPlus {
  /**
   * Custom logger for Pbot-plus
   */
  public readonly logger: LoggerTypes = LoggerService;

  /**
   * Configuration files for Pbot-plus
   */
  public readonly config: ConfigTypes = ConfigService;

  /**
   * Database provider
   */
  public database: DatabaseProvider;

  /**
   * Command service
   */
  public commands: CommandService;

  /**
   * @param bot Client
   */
  constructor(public bot: CustomClient) {}

  /**
   * Initialize the bot
   */
  public async initialize(): Promise<void> {
    try {
      await this.registerProviders();
      this.registerCommands();
      this.registerListeners();

      await this.bot.login(this.config.client.token);
    } catch (err) {
      this.logger.error('Failed while initializing to the bot', err);
    }
  }

  /**
   * Register listeners
   */
  private registerListeners(): void {
    // On message
    this.bot.on(Constants.Events.MESSAGE_CREATE, (message: Message) =>
      this.onMessage(message)
    );

    // On ready
    this.bot.on(Constants.Events.CLIENT_READY, () => this.onReady());

    // On guild create
    this.bot.on(Constants.Events.GUILD_CREATE, (guild: Guild) =>
      this.onGuildCreate(guild)
    );
  }

  /**
   * Register providers
   */
  private async registerProviders(): Promise<void> {
    const database = new DatabaseProvider({
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    await database.initialize();
    this.database = database;
  }

  /**
   * Register commands
   */
  private registerCommands(): void {
    const commandService = new CommandService();

    commandService.initialize();
    this.commands = commandService;
  }

  /**
   * On message
   * @param message
   */
  private async onMessage(message: Message): Promise<void> {
    if (message.author.bot ?? !message.guild?.member) return;

    // const developingErrorEmbed = new MessageEmbed({
    //   color: this.config.color.error,
    //   description:
    //     'I am currently under development so only my developers can use my commands'
    // });

    const commandPrefix =
      (await GuildModel.findById(message.guild.id))?.main.prefix ||
      this.config.client.defaultPrefix;

    if (message.content.match(new RegExp(`^<@!?${this.bot.user?.id}>( |)$`))) {
      const PrefixEmbed = new MessageEmbed({
        color: this.config.color.info,
        description: `Command prefix: ${commandPrefix}`
      });
      message.channel.send(PrefixEmbed);
    } else if (message.content.startsWith(commandPrefix)) {
      await this.commands.run(this, message);
    }
  }

  /**
   * On guild create
   * @param guild
   */
  private async onGuildCreate(guild: Guild): Promise<void> {
    try {
      const savedGuild = await GuildModel.findById(guild.id);
      if (savedGuild) {
        this.logger.warn(
          `Guild with the id ${guild.id} is already in database`
        );
      } else {
        const newGuild = new GuildModel({ _id: guild.id });
        await newGuild.save();
        this.logger.info(`Guild with the id ${guild.id} is saved to database`);
      }
    } catch (error) {
      this.logger.error('Failed while saving new guild to database', error);
    }
  }

  /**
   * On ready
   */
  private async onReady(): Promise<void> {
    await this.database.fetchNewGuilds(this.bot);

    this.logger.info(`Signed in as ${this.bot.user?.tag}`);
    this.bot.setPresence(
      'WATCHING',
      `to ${this.bot.guilds.cache.size.toLocaleString()} guilds | @PBOT`
    );
  }
}
