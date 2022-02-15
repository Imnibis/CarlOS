import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, Embed, ChatInputCommandInteraction } from "discord.js";
import Bot from "../../bot";
import Vote from "../../democracy/Vote";
import CarlOSEmbed from "../../util/carlosEmbed";
import { Subcommand } from "../../util/subcommand";

class CommandVoteBegin implements Subcommand
{
    data = new SlashCommandSubcommandBuilder()
        .setName("begin")
        .setDescription("Commencer un vote")

    async run(interaction: ChatInputCommandInteraction): Promise<void>
    {
        if (!await Vote.checkGuild(interaction.guild, interaction.reply.bind(interaction)))
            return;
        const res = await Vote.begin(
            interaction.member as GuildMember,
        );

        if (res) {
            const embed = CarlOSEmbed.infoEmbed()
                .setTitle("Vote commencé !")
                .setDescription("Le vote a commencé dans le channel de vote !")
            await interaction.reply({embeds: [embed]});
        } else {
            const embed = CarlOSEmbed.errorEmbed("Il n'y a aucun vote à commencer.")
            await interaction.reply({embeds: [embed]})
        }
    }
}

export default new CommandVoteBegin()