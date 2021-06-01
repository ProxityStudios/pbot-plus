import { ICommand, CommandContext } from '..';

export default class InviteCommand implements ICommand {
  name = 'invite';

  async execute(ctx: CommandContext) {
    ctx.channel.send(
      `https://discord.com/oauth2/authorize?client_id=${ctx.bot.user.id}&scope=bot&permissions=8`
    );
  }
}
