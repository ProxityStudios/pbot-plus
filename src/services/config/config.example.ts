import { ConfigTypes } from './config.interface';

export const Config: ConfigTypes = {
  client: {
    prefix: '!',
    token: '<BOT_TOKEN>',
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
    }
  },
  color: {
    success: '<HEX_CODE>', // success color (hexCode)
    error: '<HEX_CODE>', // error color (hexCode)
    warn: '<HEX_CODE>', // warn color (hexCode)
    info: '<HEX_CODE>' // info color (hexCode)
  }
};
