import {
  Message,
  GuildMember,
  TextChannel,
  Guild,
  User
} from 'discord.js-light';

import { ICommand } from './command.interface';
import { CustomClient } from '../extensions';

export class CommandContext {
  /**
   * Guild member
   */
  member: GuildMember;

  /** Text channel */
  channel: TextChannel;

  /**
   * Guild
   */
  guild: Guild;

  /**
   * User
   */
  user: User;

  /** Bot */
  bot: CustomClient;

  /**
   * Command context
   * @param message
   * @param command
   */
  constructor(
    bot: CustomClient,
    public message: Message,
    public command: ICommand
  ) {
    this.member = message.member;
    this.channel = message.channel as TextChannel;
    this.guild = message.guild;
    this.user = message.member.user;
    this.bot = bot;
  }
}
