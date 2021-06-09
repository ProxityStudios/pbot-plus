import { IntCommand, CommandContext } from '..';

export default class HelpCommand implements IntCommand {
  name = 'help';
  description = 'Shows all commands';
  example = 'help [command-name]';
  aliases = ['yardım'];

  async execute(ctx: CommandContext, commandName: string): Promise<void> {
    const guild = await ctx.database.findGuildById(ctx.guild.id);

    if (!commandName) {
      const HelpEmbed = await ctx.embed.info(ctx.message, {
        withTips: true,
        title: 'Command Page',
        description: 'The commands you can use are listed',
        fields: [
          {
            name: 'Admin',
            value: '`change-prefix`',
            inline: true
          },
          {
            name: 'Core',
            value: '`invite`**,** `help`',
            inline: true
          }
        ]
      });
      await ctx.channel.send(HelpEmbed);
    } else {
      const commands = ctx.pbot.commandService.commands;
      const command =
        commands.get(commandName) ??
        Array.from(commands.values()).find((c) =>
          c.aliases?.some((a) => a === commandName)
        );

      if (command) {
        const commandDescription =
          command.description ?? "I couldn't find the command description";
        const commandExample =
          command.example ?? "I couldn't find the command example";
        const commandAliases =
          command.aliases?.map((alias) => `\`${alias}\``).join('**,** ') ??
          "I couldn't find the command aliases";
        const commandName = command.name;

        const CommandInfoEmbed = await ctx.embed.info(ctx.message, {
          withTips: true,
          title: `[HELP] Command: ${commandName.toUpperCase()}`,
          description: commandDescription,
          fields: [
            {
              name: 'Example Usage',
              value: command.example
                ? `\`${guild?.main.prefix}${commandExample}\``
                : commandExample
            },
            {
              name: 'Aliases',
              value: commandAliases
            }
          ]
        });
        await ctx.channel.send(CommandInfoEmbed);
      } else {
        await ctx.channel.send(ctx.embed.error("I couldn't find this command"));
      }
    }
  }
}
