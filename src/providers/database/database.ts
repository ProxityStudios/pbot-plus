import { Guild } from 'discord.js-light';
import Mongoose, { ConnectOptions, Connection } from 'mongoose';

import { GuildModel, IGuildModel } from '..';
import { PbotPlus } from '../../bot';

export class DatabaseProvider {
  /**
   * Connection options for database
   */
  public options: ConnectOptions;

  /**
   * Default database connection
   */
  public connection: Connection = this.getConnection();

  /**
   * Database provider
   * @param options
   * @param pbot
   */
  constructor(private pbot: PbotPlus, options: ConnectOptions) {
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
        this.pbot.logger.warn('Already connected to database');
      } else {
        await Mongoose.connect(connectionUri, this.options);
      }
    } catch (error) {
      this.pbot.logger.error('Failed while connecting to database', error);
    }
  }

  /**
   * Fetch new guilds | Create
   * @param bot
   */
  public async fetchNewGuilds(): Promise<void> {
    try {
      this.pbot.bot.guilds.cache.map(async (guild: Guild) => {
        const id = guild.id;
        const guildExists = await this.findGuildById(id);

        if (!guildExists) {
          const newGuild = new GuildModel({ _id: id });
          await newGuild.save();
          this.pbot.logger.info(
            `Guild with id '${id}' is saved to database [OFFLINE_GUILD_CREATE]`
          );
        }
      });
    } catch (error) {
      this.pbot.logger.error('Failed while fetching new guilds', error);
    }
  }

  /**
   * Register listeners
   */
  private registerListeners(): void {
    try {
      this.connection.on('open', () => this.onReady());
    } catch (error) {
      this.pbot.logger.error(
        'Failed while registering listeners for database',
        error
      );
    }
  }

  /**
   * Find guild by id
   * @param id
   * @returns Guild Model
   */
  public async findGuildById(id: string): Promise<IGuildModel | null> {
    const guild = await GuildModel.findById(id);
    return guild ?? null;
  }

  /**
   * Get database connection
   */
  private getConnection(): Connection | null {
    const connection = Mongoose.connection;
    return connection ?? null;
  }

  /**
   * Get connection URI
   */
  private getConnectionUri(): string {
    const config = this.pbot.config.database;

    return config.local
      ? `mongodb://${config.hostname}:${config.port}/${config.base}`
      : `mongodb+srv://${config.username}:${config.password}@${config.hostname}/${config.base}?retryWrites=true&w=majority`;
  }

  /**
   * On ready
   */
  private onReady(): void {
    this.pbot.logger.info('Connected to database');
  }
}
