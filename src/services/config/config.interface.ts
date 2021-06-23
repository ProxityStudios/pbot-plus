import { IntentsString, PartialTypes } from 'discord.js-light';

import { CommandType } from './command.type';
import { EventType } from './event.type';

export interface IntConfig {
  client: {
    defaultPrefix: string;
    token: string;
    intents: IntentsString[];
    presence: boolean;
    disabledEvents: EventType[];
    partials: PartialTypes[];
    staffs: string[];
    fetchNewGuilds: boolean;
    messageTyping: boolean;
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
      plugins: CommandType[];
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
  tips: string[];
  database: {
    local: boolean;
    hostname: string;
    base: string;
    port?: number;
    username?: string;
    password?: string;
  };
}
