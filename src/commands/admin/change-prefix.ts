import { ICommand, CommandContext } from '..';

export default class ChangePrefixCommand implements ICommand {
  name = 'change-prefix';

  async execute(ctx: CommandContext, prefix: string): Promise<void> {
    if (ctx.guild.me.hasPermission('ADMINISTRATOR')) {
      const guild = await ctx.database.findGuildById(ctx.guild.id);

      if (guild) {
        if (prefix) {
          if (prefix === guild.main.prefix) {
            await ctx.channel.send(
              'Please provide a different prefix than the previous prefix'
            );
          } else {
            guild.main.prefix = prefix;
            await guild.save();
            await ctx.channel.send('Prefix changed to: ' + guild?.main.prefix);
          }
        } else {
          await ctx.channel.send('Please provide a valid prefix');
        }
      } else {
        await ctx.channel.send(
          `Guild with id **'${ctx.guild.id}'** not found in database`
        );
      }
    } else {
      await ctx.channel.send(
        "You don't have permission(`ADMINISTRATOR`) for use this command"
      );
    }
  }
}
