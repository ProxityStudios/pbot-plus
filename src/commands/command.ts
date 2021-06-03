import {
  Message,
  GuildMember,
  TextChannel,
  Guild,
  User
} from 'discord.js-light';

import { ICommand } from './command.interface';
import { CustomClient } from '../extensions';
import { PbotPlus } from '../bot';
import { ConfigTypes, LoggerTypes } from '../services';
import { DatabaseProvider } from '../providers';

export class CommandContext {
  /**
   * Database
   */
  public database: DatabaseProvider;

  /**
   * Logger
   */
  public logger: LoggerTypes;

  /**
   * Config
   */
  public config: ConfigTypes;

  /**
   * Guild member
   */
  public member: GuildMember;

  /**
   * Text channel
   */
  public channel: TextChannel;

  /**
   * Guild
   */
  public guild: Guild;

  /**
   * User
   */
  public user: User;

  /**
   * PBot
   */
  public pbot: PbotPlus;

  /**
   * Bot
   */
  public bot: CustomClient;

  /**
   * Command context
   * @param message
   * @param command
   */
  constructor(
    pbot: PbotPlus,
    public message: Message,
    public command: ICommand
  ) {
    this.member = message.member;
    this.channel = message.channel as TextChannel;
    this.guild = message.guild;
    this.user = message.member.user;
    this.pbot = pbot;
    this.bot = pbot.bot;
    this.config = pbot.config;
    this.logger = pbot.logger;
    this.database = pbot.database;
  }
}
