import { Client, CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import Vote from "../../democracy/Vote";
import Command from "../../util/command";

export default class CommandVoteDiscard extends Command
{
    constructor()
    {
        super("discard", "Annuler un vote", true)
    }

    async run(client: Client, interaction: CommandInteraction): Promise<void>
    {
        if (!await Vote.checkGuild(interaction.guild, interaction.reply.bind(interaction)))
            return;
        const res = await Vote.discard(
            interaction.member as GuildMember,
        );

        if (res) {
            const embed = new MessageEmbed()
                .setColor("#00bfff")
                .setTitle("Vote annulé")
                .setDescription("Le vote a été annulé.")
                .setFooter(client.user.username, client.user.avatarURL());
            await interaction.reply({embeds: [embed]});
        } else {
            const embed = new MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Erreur")
                .setDescription("Il n'y a aucun vote à annuler.")
                .setFooter(client.user.username, client.user.avatarURL());
            await interaction.reply({embeds: [embed]})
        }
    }
}