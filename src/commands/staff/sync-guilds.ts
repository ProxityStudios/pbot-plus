import { IntCommand, CommandContext } from '..';

export default class SyncGuildsCommand implements IntCommand {
  name = 'sync-guilds';
  aliases = ['sg', 'sguilds', 'sunuculari-guncelle'];

  async execute(ctx: CommandContext): Promise<void> {
    if (!ctx.config.client.staffs.includes(ctx.user.id)) return;
    await ctx.database.fetchNewGuilds();
    await ctx.channel.send(ctx.embed.success('All guilds synced to database'));
  }
}
