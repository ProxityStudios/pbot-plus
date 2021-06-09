import { IntCommand, CommandContext } from '..';

export default class InviteCommand implements IntCommand {
  name = 'invite';
  description = 'Allows you to add the bot';
  example = 'invite';
  aliases = ['davet-et'];

  async execute(ctx: CommandContext): Promise<void> {
    const invite_url = `https://discord.com/oauth2/authorize?client_id=${ctx.bot.user.id}&scope=bot&permissions=8`;
    await ctx.channel.send(
      await ctx.embed.info(ctx.message, {
        description: `Hello, [click here](${invite_url}) to invite me to guild`
      })
    );
  }
}
