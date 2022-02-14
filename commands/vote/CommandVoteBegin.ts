import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import Bot from "../../bot";
import Vote from "../../democracy/Vote";
import { Subcommand } from "../../util/subcommand";

class CommandVoteBegin implements Subcommand
{
    data = new SlashCommandSubcommandBuilder()
        .setName("begin")
        .setDescription("Commencer un vote")

    async run(interaction: CommandInteraction): Promise<void>
    {
        if (!await Vote.checkGuild(interaction.guild, interaction.reply.bind(interaction)))
            return;
        const res = await Vote.begin(
            interaction.member as GuildMember,
        );

        if (res) {
            const embed = new MessageEmbed()
                .setColor("#00bfff")
                .setTitle("Vote commencé !")
                .setDescription("Le vote a commencé dans le channel de vote !")
                .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
            await interaction.reply({embeds: [embed]});
        } else {
            const embed = new MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Erreur")
                .setDescription("Il n'y a aucun vote à commencer.")
                .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
            await interaction.reply({embeds: [embed]})
        }
    }
}

export default new CommandVoteBegin()