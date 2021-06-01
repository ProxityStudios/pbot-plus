import { ICommand, CommandContext } from '..';

export default class InviteCommand implements ICommand {
  name = 'invite';

  async execute(ctx: CommandContext) {
    ctx.channel.send(
      'https://discord.com/oauth2/authorize?client_id=835258987800821791&scope=bot&permissions=8&redirect_uri=http://proxity.ml'
    );
  }
}
