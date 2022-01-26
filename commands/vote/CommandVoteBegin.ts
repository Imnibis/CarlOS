import { Client, CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import Vote from "../../democracy/Vote";
import Command from "../../util/command";

export default class CommandVoteBegin extends Command
{
    constructor()
    {
        super("begin", "Commencer un vote", true)
    }

    async run(client: Client, interaction: CommandInteraction): Promise<void>
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
                .setFooter(client.user.username, client.user.avatarURL());
            await interaction.reply({embeds: [embed], ephemeral: true});
        } else {
            const embed = new MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Erreur")
                .setDescription("Il n'y a aucun vote à commencer.")
                .setFooter(client.user.username, client.user.avatarURL());
            await interaction.reply({embeds: [embed], ephemeral: true})
        }
    }
}