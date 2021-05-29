import { ConfigTypes } from './config.interface';

export const Config: ConfigTypes = {
  client: {
    prefix: '!',
    token: 'ODM1MjU4OTg3ODAwODIxNzkx.YIM1jQ.Uj2JtZ9Ie2tWWucBHWEydS_hH6s',
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
    success: '#2ecc71',
    error: '#e74c3c',
    warn: '#e7c83c',
    info: '#7578da'
  }
};
