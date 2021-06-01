import { ConfigServiceTypes } from './config.interface';

export const ConfigService: ConfigServiceTypes = {
  // Client configurations
  client: {
    defaultPrefix: '!', // Client prefix for messages
    token: '<BOT_TOKEN>', // Client token for login application
    intents: [
      'GUILDS',
      'GUILD_MESSAGES',
      'GUILD_MESSAGE_REACTIONS',
      'DIRECT_MESSAGES',
      'DIRECT_MESSAGE_REACTIONS'
    ],
    disabledEvents: [],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    caches: {
      guilds: true,
      roles: true,
      emojis: false,
      channels: true,
      overwrites: true,
      presences: false,
      messages: {
        size: 0,
        lifetime: 0,
        sweepInterval: 0
      }
    },
    commands: {
      plugins: ['core']
    }
  },

  // Color configurations for message embed
  color: {
    success: '<HEX_CODE>', // success color (hexCode)
    error: '<HEX_CODE>', // error color (hexCode)
    warn: '<HEX_CODE>', // warn color (hexCode)
    info: '<HEX_CODE>' // info color (hexCode)
  },

  // Database provider configurations
  dbProvider: {
    local: false, // if you are going to use the local connection(localhost), change the value to true
    hostname: '<DB_HOSTNAME>', // Example: 'localhost' or 'examplecluster0.eidb2.mongodb.net'
    database: '<DATABASE_NAME>' // Example: 'pbot-database'
    // port: 27017,               /** if local connection is not enabled, this options is required to connect to the database */

    // username: '<DB_USERNAME>', /** if local connection is not enabled, this options is required to connect to the database */
    // password: '<DB_PASSWORD>'  /** if local connection is not enabled, this options is required to connect to the database */
  }
};
