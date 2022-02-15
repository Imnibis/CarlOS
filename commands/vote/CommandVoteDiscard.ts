import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import Bot from "../../bot";
import Vote from "../../democracy/Vote";
import CarlOSEmbed from "../../util/carlosEmbed";
import { Subcommand } from "../../util/subcommand";

class CommandVoteDiscard implements Subcommand
{
    data = new SlashCommandSubcommandBuilder()
        .setName("discard")
        .setDescription("Annuler un vote")

    async run(interaction: CommandInteraction): Promise<void>
    {
        if (!await Vote.checkGuild(interaction.guild, interaction.reply.bind(interaction)))
            return;
        const res = await Vote.discard(
            interaction.member as GuildMember,
        );

        if (res) {
            const embed = CarlOSEmbed.infoEmbed()
                .setTitle("Vote annulé")
                .setDescription("Le vote a été annulé.")
            await interaction.reply({embeds: [embed]});
        } else {
            const embed = CarlOSEmbed.errorEmbed("Il n'y a aucun vote à annuler.")
            await interaction.reply({embeds: [embed]})
        }
    }
}

export default new CommandVoteDiscard()