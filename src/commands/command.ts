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
import { ConfigType, LoggerType, EmbedService } from '../services';
import { DatabaseProvider } from '../providers';

export class CommandContext {
  /**
   * Embed
   */
  public embed: EmbedService;

  /**
   * Database
   */
  public database: DatabaseProvider;

  /**
   * Logger
   */
  public logger: LoggerType;

  /**
   * Config
   */
  public config: ConfigType;

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
    protected _pbot: PbotPlus,
    public message: Message,
    public command: ICommand
  ) {
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
