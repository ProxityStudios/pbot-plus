import PbotPlus from './bot';
import { CustomClient } from './extensions';
import { Logger, Config } from './services';

async function initialize(): Promise<PbotPlus> {
  const client = new CustomClient({
    ws: { intents: Config.client.intents },
    partials: Config.client.partials,
    messageCacheMaxSize: Config.client.caches.messages.size,
    messageCacheLifetime: Config.client.caches.messages.lifetime,
    messageSweepInterval: Config.client.caches.messages.sweepInterval,
    cacheGuilds: Config.client.caches.guilds,
    cacheRoles: Config.client.caches.roles,
    cacheEmojis: Config.client.caches.emojis,
    cacheChannels: Config.client.caches.channels,
    cacheOverwrites: Config.client.caches.overwrites,
    cachePresences: Config.client.caches.presences,
    disabledEvents: Config.client.disabledEvents
  });

  const bot = new PbotPlus(client);
  await bot.initialize();

  return bot;
}

process.on('unhandledRejection', (reason) => {
  Logger.error('An unhandled promise rejection ocurred.', reason);
});

initialize().catch((error) => {
  Logger.error('An unspecified error ocurred.', error);
});
