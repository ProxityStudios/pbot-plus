import Mongoose, { ConnectOptions, Connection } from 'mongoose';

import {
  ConfigService,
  ConfigServiceTypes,
  ILoggerService,
  LoggerService
} from '../../services';

export class DatabaseProvider {
  /**
   * Connection options for database
   */
  public options: ConnectOptions;
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
  public getConnection(): Connection {
    return Mongoose.connection;
  }

  /**
   * Register listeners
   */
  private registerListeners(): void {
    Mongoose.connection.on('open', () => this.onReady());
  }

  /**
   * Get connection uri
   */
  private getConnectionUri(): string {
    const dbProvider = this.config.dbProvider;

    if (dbProvider.local) {
      return `mongodb://${dbProvider.hostname}:${dbProvider.port}/${dbProvider.database}`;
    } else {
      return `mongodb+srv://${dbProvider.username}:${dbProvider.password}@${dbProvider.hostname}/${dbProvider.database}?retryWrites=true&w=majority`;
    }
  }

  private onReady(): void {
    this.logger.info('Connected to the database');
  }
}
