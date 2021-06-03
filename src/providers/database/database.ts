import { Guild } from 'discord.js-light';
import Mongoose, { ConnectOptions, Connection } from 'mongoose';

import { CustomClient } from '../../extensions';
import {
  ConfigService,
  ConfigTypes,
  LoggerTypes,
  LoggerService
} from '../../services';
import { GuildModel } from './models/guild/guild';

export class DatabaseProvider {
  /**
   * Connection options for database
   */
  public options: ConnectOptions;

  /**
   * Default database connection
   */
  public connection: Connection = this.getConnection();

  private readonly config: ConfigTypes = ConfigService;
  private readonly logger: LoggerTypes = LoggerService;

  /**
   * Database provider
   * @param options
   */
  constructor(options: ConnectOptions) {
    this.options = options;
  }

  /**
   * Initialize database provider
   */
  public async initialize(): Promise<void> {
    const connectionUri = this.getConnectionUri();

    try {
      this.registerListeners();

      if (Mongoose.connections[0].readyState) {
        this.logger.warn('Already connected to database');
      } else {
        await Mongoose.connect(connectionUri, this.options);
      }
    } catch (error) {
      this.logger.error('Failed while connecting to database', error);
    }
  }

  /**
   * Fetch new guilds | Create
   * @param bot
   */
  public async fetchNewGuilds(bot: CustomClient): Promise<void> {
    try {
      bot.guilds.cache.map(async (guild: Guild) => {
        const guildExists = await GuildModel.findById(guild.id);

        if (!guildExists) {
          const newGuild = new GuildModel({ _id: guild.id });
          await newGuild.save();
          this.logger.info(
            `Guild with the id ${guild.id} is saved to database [OFFLINE_GUILD_CREATE]`
          );
        }
      });
    } catch (error) {
      this.logger.error('Failed while fetching new guilds', error);
    }
  }

  /**
   * Register listeners
   */
  private registerListeners(): void {
    try {
      Mongoose.connection.on('open', () => this.onReady());
    } catch (error) {
      this.logger.error('Failed while registering listeners', error);
    }
  }

  /**
   * Get database connection
   */
  private getConnection(): Connection {
    return Mongoose.connection;
  }

  /**
   * Get connection URI
   */
  private getConnectionUri(): string {
    const providerConfig = this.config.dbProvider;

    if (providerConfig.local) {
      return `mongodb://${providerConfig.hostname}:${providerConfig.port}/${providerConfig.database}`;
    } else {
      return `mongodb+srv://${providerConfig.username}:${providerConfig.password}@${providerConfig.hostname}/${providerConfig.database}?retryWrites=true&w=majority`;
    }
  }

  /**
   * On ready
   */
  private async onReady(): Promise<void> {
    this.logger.info('Connected to database');
  }
}
