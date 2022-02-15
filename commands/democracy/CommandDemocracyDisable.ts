import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Guild from "../../models/guild.model";
import CarlOSEmbed from "../../util/carlosEmbed";
import { Subcommand } from "../../util/subcommand";

class CommandDemocracyDisable implements Subcommand
{
    data = new SlashCommandSubcommandBuilder()
        .setName("disable")
        .setDescription("Désactiver la démocratie sur ce serveur")

    async run(interaction: CommandInteraction): Promise<void>
    {
        const guild = await Guild.findOne({where: {id: interaction.guildId}})
        await guild.setSetting('democracy', false);
        const embed = CarlOSEmbed.successEmbed("Démocratie désactivée!")
        interaction.reply({embeds: [embed]})
    }
}

export default new CommandDemocracyDisable()