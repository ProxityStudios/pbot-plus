import PbotPlus from './bot';
import { CustomClient } from './extensions';
import { LoggerService, ConfigService } from './services';

async function initialize(): Promise<PbotPlus> {
  const client = new CustomClient({
    ws: { intents: ConfigService.client.intents },
    partials: ConfigService.client.partials,
    messageCacheMaxSize: ConfigService.client.caches.messages.size,
    messageCacheLifetime: ConfigService.client.caches.messages.lifetime,
    messageSweepInterval: ConfigService.client.caches.messages.sweepInterval,
    cacheGuilds: ConfigService.client.caches.guilds,
    cacheRoles: ConfigService.client.caches.roles,
    cacheEmojis: ConfigService.client.caches.emojis,
    cacheChannels: ConfigService.client.caches.channels,
    cacheOverwrites: ConfigService.client.caches.overwrites,
    cachePresences: ConfigService.client.caches.presences,
    disabledEvents: ConfigService.client.disabledEvents
  });

  const bot = new PbotPlus(client);
  await bot.initialize();

  return bot;
}

process.on('unhandledRejection', (reason) => {
  LoggerService.error('An unhandled promise rejection ocurred.', reason);
});

initialize().catch((error) => {
  LoggerService.error('An unspecified error ocurred.', error);
});
