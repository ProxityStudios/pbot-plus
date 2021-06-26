import { IntCommand, CommandContext } from '..';

export default class ChangePrefixCommand implements IntCommand {
  name = 'change-prefix';
  description = "Allows you to change the bot's prefix";
  example = 'change-prefix <prefix>';
  aliases = ['onek-degistir'];

  async execute(ctx: CommandContext, prefix: string): Promise<void> {
    if (ctx.member.hasPermission('ADMINISTRATOR')) {
      const guild = await ctx.database.findGuildById(ctx.guild.id);

      if (prefix) {
        if (prefix === guild.main.prefix) {
          await ctx.channel.send(ctx.embed.error('Please provide a different prefix than the previous prefix'));
        } else {
          guild.main.prefix = prefix;
          await guild.save();

          const PrefixChangedEmbed = ctx.embed.success(`My command prefix changed to: \`${guild?.main.prefix}\``);
          await ctx.channel.send(PrefixChangedEmbed);
        }
      } else {
        await ctx.channel.send(ctx.embed.warn('Please provide a prefix to replace my prefix'));
      }
    } else {
      await ctx.channel.send(ctx.embed.error("You don't have permission(`ADMINISTRATOR`) to use this command"));
    }
  }
}
