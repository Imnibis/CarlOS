import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ButtonInteraction, Client, CommandInteraction, GuildMember, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import Bot from "../../bot";
import Vote from "../../democracy/Vote";
import { Subcommand } from "../../util/subcommand";

class CommandVoteCreate implements Subcommand
{
    data = new SlashCommandSubcommandBuilder()
        .setName("create")
        .setDescription("Créer un vote")
        .addStringOption(option => (
            option.setName("nom")
                .setDescription("Nom du vote")
                .setRequired(true)
        ))
        .addStringOption(option => (
            option.setName("description")
                .setDescription("Description du vote")
                .setRequired(false)
        ))

    async run(interaction: CommandInteraction): Promise<void>
    {
        if (!await Vote.checkGuild(interaction.guild, interaction.reply.bind(interaction)))
            return;
        const res = Vote.create(
            interaction.member as GuildMember,
            interaction.options.getString('nom'),
            interaction.options.getString('description', false)
        );

        if (res) {
            const embed = new MessageEmbed()
                .setColor("#00bfff")
                .setTitle("Vote créé !")
                .setDescription("Votre vote a été créé. Vous pouvez maintenant exécuter toutes les actions nécessaires puis commencer le vote en exécutant /vote begin ou en cliquant sur le bouton ci dessous.")
                .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('beginVote')
                        .setEmoji('✅')
                        .setLabel('Commencer le vote')
                        .setStyle('PRIMARY')
                )
            await interaction.reply({embeds: [embed], components: [row]});
            const msg = await interaction.fetchReply() as Message;
            const collector = msg.createMessageComponentCollector({componentType:'BUTTON'});
            
            collector.on('collect', async (inter: ButtonInteraction) => {
                if (interaction.user.id !== inter.user.id) {
                    const embed = new MessageEmbed()
                        .setColor("#ff0000")
                        .setTitle("Erreur")
                        .setDescription("Seul la personne ayant créé le vote peut le commencer.")
                        .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
                    await inter.reply({embeds: [embed]})
                    return;
                }
                const res = await Vote.begin(interaction.member as GuildMember);
                if (res) {
                    const embed = new MessageEmbed()
                        .setColor("#00bfff")
                        .setTitle("Vote commencé !")
                        .setDescription("Le vote a commencé dans le channel de vote !")
                        .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
                    await inter.reply({embeds: [embed]})
                } else {
                    const embed = new MessageEmbed()
                        .setColor("#ff0000")
                        .setTitle("Erreur")
                        .setDescription("Il n'y a aucun vote à commencer.")
                        .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
                    await inter.reply({embeds: [embed]})
                }
            });
        } else {
            const embed = new MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Erreur")
                .setDescription("Vous avez déjà un vote en cours de création.")
                .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
            await interaction.reply({embeds: [embed]})
        }
    }
}

export default new CommandVoteCreate();