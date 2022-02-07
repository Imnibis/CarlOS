import { ButtonInteraction, Client, CommandInteraction, GuildMember, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import Vote from "../../democracy/Vote";
import ArgType from "../../util/argtype";
import Command from "../../util/command";

export default class CommandVoteCreate extends Command
{
    constructor()
    {
        super("create", "Créer un vote", true);
        this.addArgument("nom", "Nom du vote", ArgType.STRING, true);
        this.addArgument("description", "Description du vote", ArgType.STRING, false);
    }

    async run(client: Client, interaction: CommandInteraction): Promise<void>
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
                .setFooter(client.user.username, client.user.avatarURL());
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('beginVote')
                        .setEmoji('✅')
                        .setLabel('Commencer le vote')
                        .setStyle('PRIMARY')
                )
            await interaction.reply({embeds: [embed], components: [row], ephemeral: true});
            const msg = await interaction.fetchReply() as Message;
            const collector = msg.createMessageComponentCollector({componentType:'BUTTON'});
            
            collector.on('collect', async (inter: ButtonInteraction) => {
                if (interaction.user.id !== inter.user.id)
                    return;
                const res = await Vote.begin(interaction.member as GuildMember);
                if (res) {
                    const embed = new MessageEmbed()
                        .setColor("#00bfff")
                        .setTitle("Vote commencé !")
                        .setDescription("Le vote a commencé dans le channel de vote !")
                        .setFooter(client.user.username, client.user.avatarURL());
                    await inter.reply({embeds: [embed], ephemeral: true})
                } else {
                    const embed = new MessageEmbed()
                        .setColor("#ff0000")
                        .setTitle("Erreur")
                        .setDescription("Il n'y a aucun vote à commencer.")
                        .setFooter(client.user.username, client.user.avatarURL());
                    await inter.reply({embeds: [embed], ephemeral: true})
                }
            });
        } else {
            const embed = new MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Erreur")
                .setDescription("Vous avez déjà un vote en cours de création.")
                .setFooter(client.user.username, client.user.avatarURL());
            await interaction.reply({embeds: [embed], ephemeral: true})
        }
    }
}