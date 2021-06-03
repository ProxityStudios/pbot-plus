import { MessageEmbed } from 'discord.js';

import { ICommand, CommandContext } from '..';

export default class InviteCommand implements ICommand {
  name = 'invite';

  async execute(ctx: CommandContext): Promise<void> {
    const invite_url = `https://discord.com/oauth2/authorize?client_id=${ctx.bot.user.id}&scope=bot&permissions=8`;
    const InviteEmbed = new MessageEmbed({
      color: ctx.config.color.info,
      description: `Hello, [click here](${invite_url}) to invite me to guild`
    });

    await ctx.channel.send(InviteEmbed);
  }
}
