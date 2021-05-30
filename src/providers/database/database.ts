import Mongoose, { ConnectOptions, Connection } from 'mongoose';

import {
  ConfigService,
  ConfigServiceTypes,
  ILoggerService,
  LoggerService
} from '../../services';
import { GuildModel } from './models';

export class DatabaseProvider {
  /**
   * Connection options for database
   */
  public options: ConnectOptions;

  /**
   * Default database connection
   */
  public connection: Connection = this.getConnection();

  private readonly config: ConfigServiceTypes = ConfigService;
  private logger: ILoggerService = LoggerService;

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
      this.logger.error('Failed while connecting to the database', error);
    }
  }

  /**
   * Get database connection
   */
  private getConnection(): Connection {
    return Mongoose.connection;
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
   * Get connection URI
   */
  private getConnectionUri(): string {
    const dbProvider = this.config.dbProvider;

    if (dbProvider.local) {
      return `mongodb://${dbProvider.hostname}:${dbProvider.port}/${dbProvider.database}`;
    } else {
      return `mongodb+srv://${dbProvider.username}:${dbProvider.password}@${dbProvider.hostname}/${dbProvider.database}?retryWrites=true&w=majority`;
    }
  }

  /**
   * On ready
   */
  private async onReady(): Promise<void> {
    this.logger.info('Connected to the database');

    if (await GuildModel.findById('0000000000000')) {
      this.logger.error('Guild model has already been saved');
    } else {
      try {
        const newGuild = new GuildModel({
          _id: '0000000000000'
        });
        await newGuild.save();
        this.logger.info('New guild model is saved');
      } catch (error) {
        this.logger.error('Failed while saving new model to database', error);
      }
    }
  }
}
