import { IntentsString, PartialTypes } from 'discord.js-light';

import { CommandType } from './command.type';
import { EventType } from './event.type';

export interface ConfigType {
  client: {
    defaultPrefix: string;
    token: string;
    intents: Array<IntentsString>;
    presence: boolean;
    disabledEvents: Array<EventType>;
    partials: Array<PartialTypes>;
    fetchNewGuilds: boolean;
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
      plugins: Array<CommandType>;
    };
  };
  color: {
    success: string;
    error: string;
    warn: string;
    info: string;
  };
  emojis: {
    success: string;
    error: string;
    warn: string;
  };
  tips: Array<string>;
  database: {
    local: boolean;
    hostname: string;
    base: string;
    port?: number;
    username?: string;
    password?: string;
  };
}
