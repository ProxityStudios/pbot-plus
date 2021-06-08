import { Constants, Guild, Message } from 'discord.js-light';

import { CustomClient } from './extensions';
import { DatabaseProvider, GuildModel } from './providers';
import {
  LoggerType,
  LoggerService,
  ConfigService,
  ConfigType,
  CommandService,
  EmbedService
} from './services';

export class PbotPlus {
  /**
   * Custom logger for Pbot-plus
   */
  public readonly logger: LoggerType = LoggerService;

  /**
   * Configuration files for Pbot-plus
   */
  public readonly config: ConfigType = ConfigService;

  /**
   * Embed service
   */
  public embed: EmbedService = new EmbedService(this);

  /**
   * Database provider
   */
  public database: DatabaseProvider;

  /**
   * Command service
   */
  public commandService: CommandService;

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
    try {
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
    } catch (error) {
      this.logger.error('Failed while registering listeners for bot', error);
    }
  }

  /**
   * Register providers
   */
  private async registerProviders(): Promise<void> {
    try {
      const database = new DatabaseProvider(this, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      await database.initialize();
      this.database = database;
    } catch (error) {
      this.logger.error('Failed while registering providers', error);
    }
  }

  /**
   * Register commands
   */
  private registerCommands(): void {
    try {
      const commandService = new CommandService(this);
      commandService.initialize();
      this.commandService = commandService;
    } catch (error) {
      this.logger.error('Failed while registering commands', error);
    }
  }

  /**
   * On message
   * @param message
   */
  private async onMessage(message: Message): Promise<void> {
    if (message.author.bot ?? !message.guild?.member) return;

    const guild = await this.database.findGuildById(message.guild.id);
    const commandPrefix = guild?.main.prefix;

    if (guild) {
      if (message.content.match(new RegExp(`^<@!?${this.bot.user.id}>( |)$`))) {
        const prefixEmbed = this.embed.info(true, {
          description: `My command prefix on this server: \`${commandPrefix}\``
        });
        await message.channel.send(prefixEmbed);
      } else if (message.content.startsWith(commandPrefix)) {
        await this.commandService.run(message);
      }
    } else {
      await message.channel.send(
        this.embed.error(
          `Guild with id **${message.guild.id}** not found in database`
        )
      );
    }
  }

  /**
   * On guild create
   * @param guild
   */
  private async onGuildCreate(guild: Guild): Promise<void> {
    try {
      const savedGuild = await this.database.findGuildById(guild.id);

      if (savedGuild) {
        this.logger.warn(`Guild with id ${guild.id} is already in database`);
      } else {
        const newGuild = new GuildModel({ _id: guild.id });
        await newGuild.save();
        this.logger.info(`Guild with id ${guild.id} is saved to database`);
      }
    } catch (error) {
      this.logger.error('Failed while saving new guild to database', error);
    }
  }

  /**
   * On ready
   */
  private async onReady(): Promise<void> {
    if (this.config.client.fetchNewGuilds) {
      await this.database.fetchNewGuilds();
    }

    if (this.config.client.presence) {
      await this.bot.setPresence(
        'WATCHING',
        `to ${this.bot.guilds.cache.size.toLocaleString()} guilds | @${
          this.bot.user.username
        }`
      );
    }

    this.logger.info(`Signed in as ${this.bot.user.tag}`);
  }
}
