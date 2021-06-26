import { Message, GuildMember, TextChannel, Guild, User } from 'discord.js-light';

import { IntCommand } from './command.interface';
import { CustomClient } from '../extensions';
import { PbotPlus } from '../bot';
import { IntConfig, IntLogger, EmbedService } from '../services';
import { DatabaseProvider } from '../providers';

export class CommandContext {
  /**
   * Embed
   */
  embed: EmbedService;

  /**
   * Database
   */
  database: DatabaseProvider;

  /**
   * Logger
   */
  logger: IntLogger;

  /**
   * Config
   */
  config: IntConfig;

  /**
   * Guild member
   */
  member: GuildMember;

  /**
   * Text channel
   */
  channel: TextChannel;

  /**
   * Guild
   */
  guild: Guild;

  /**
   * User
   */
  user: User;

  /**
   * Pbot
   */
  pbot: PbotPlus;

  /**
   * Bot
   */
  bot: CustomClient;

  /**
   * Command context
   * @param message
   * @param command
   */
  constructor(protected _pbot: PbotPlus, public message: Message, public command: IntCommand) {
    this.member = message.member;
    this.channel = message.channel as TextChannel;
    this.guild = message.guild;
    this.user = message.member.user;
    this.pbot = _pbot;
    this.bot = _pbot.bot;
    this.config = _pbot.config;
    this.logger = _pbot.logger;
    this.database = _pbot.database;
    this.embed = _pbot.embed;
  }
}
