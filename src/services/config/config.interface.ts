import { IntentsString, PartialTypes } from 'discord.js-light';

import { CommandTypes } from './command.type';
import { EventTypes } from './event.type';

export interface ConfigTypes {
  client: {
    defaultPrefix: string;
    token: string;
    intents: Array<IntentsString>;
    disabledEvents: Array<EventTypes>;
    partials: Array<PartialTypes>;
    caches: {
      guilds: boolean;
      roles: boolean;
      emojis: boolean;
      channels: boolean;
      overwrites: boolean;
      presences: boolean;
      messages: {
        size: number;
        lifetime: number;
        sweepInterval: number;
      };
    };
    commands: {
      plugins: Array<CommandTypes>;
    };
  };
  color: {
    success: string;
    error: string;
    warn: string;
    info: string;
  };
  dbProvider: {
    local: boolean;
    hostname: string;
    database: string;
    port?: number;
    username?: string;
    password?: string;
  };
}
