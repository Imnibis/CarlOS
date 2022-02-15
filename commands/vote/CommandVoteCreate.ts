import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ButtonInteraction, GuildMember, Message, ActionRow, ButtonComponent, ChatInputCommandInteraction, ButtonStyle, ComponentType } from "discord.js";
import Bot from "../../bot";
import Vote from "../../democracy/Vote";
import CarlOSEmbed from "../../util/carlosEmbed";
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

    async run(interaction: ChatInputCommandInteraction): Promise<void>
    {
        if (!await Vote.checkGuild(interaction.guild, interaction.reply.bind(interaction)))
            return;
        const res = Vote.create(
            interaction.member as GuildMember,
            interaction.options.getString('nom'),
            interaction.options.getString('description', false)
        );

        if (res) {
            const embed = CarlOSEmbed.infoEmbed()
                .setTitle("Vote créé !")
                .setDescription("Votre vote a été créé. Vous pouvez maintenant exécuter toutes les actions nécessaires puis commencer le vote en exécutant /vote begin ou en cliquant sur le bouton ci dessous.")
            const row = new ActionRow()
                .addComponents(
                    new ButtonComponent()
                        .setCustomId('beginVote')
                        .setEmoji({name: ':white_check_mark:'})
                        .setLabel('Commencer le vote')
                        .setStyle(ButtonStyle.Primary)
                )
            await interaction.reply({embeds: [embed], components: [row]});
            const msg = await interaction.fetchReply() as Message;
            const collector = msg.createMessageComponentCollector({componentType: ComponentType.Button});
            
            collector.on('collect', async (inter: ButtonInteraction) => {
                if (interaction.user.id !== inter.user.id) {
                    const embed = CarlOSEmbed.errorEmbed("Seul la personne ayant créé le vote peut le commencer.")
                    await inter.reply({embeds: [embed]})
                    return;
                }
                const res = await Vote.begin(interaction.member as GuildMember);
                if (res) {
                    const embed = CarlOSEmbed.infoEmbed()
                        .setTitle("Vote commencé !")
                        .setDescription("Le vote a commencé dans le channel de vote !")
                    await inter.reply({embeds: [embed]})
                } else {
                    const embed = CarlOSEmbed.errorEmbed("Il n'y a aucun vote à commencer.")
                    await inter.reply({embeds: [embed]})
                }
            });
        } else {
            const embed = CarlOSEmbed.errorEmbed("Vous avez déjà un vote en cours de création.")
            await interaction.reply({embeds: [embed]})
        }
    }
}

export default new CommandVoteCreate();