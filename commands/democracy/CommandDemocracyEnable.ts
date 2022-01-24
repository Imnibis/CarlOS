import { Client, CommandInteraction, Message, MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction, TextChannel } from "discord.js";
import Guild from "../../models/guild.model";
import Command from "../../util/command";

export default class CommandDemocracyEnable extends Command
{
    constructor()
    {
        super("enable", "Activer la démocratie sur ce serveur", true);
    }

    async run(client: Client, interaction: CommandInteraction): Promise<void>
    {
        const guild = await Guild.findOne({where: {id: interaction.guildId}})
        await guild.setSetting('democracy', true);
        const embed = new MessageEmbed()
            .setColor("#00bfff")
            .setTitle("Succès")
            .setDescription("Démocratie activée!")
            .setFooter(client.user.username, client.user.avatarURL());
        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId('selectChannel')
                .setPlaceholder('Sélectionnez le channel de vote')
                .addOptions(interaction.guild.channels.cache.filter(channel => channel.isText()).map(channel => (
                    {
                        label: `#${channel.name}`,
                        value: channel.id,
                    }
                )))
        )
        interaction.reply({embeds: [embed], components: [row]});
        const msg = await interaction.fetchReply() as Message;
        const collector = msg.createMessageComponentCollector({componentType: 'SELECT_MENU'});

        collector.on('collect', async (inter: SelectMenuInteraction) => {
            if (inter.user.id !== interaction.user.id) {
                const embed = new MessageEmbed()
                    .setColor("#ff0000")
                    .setTitle("Erreur")
                    .setDescription("Seul l'utilisateur ayant activé la démocratie peut choisir le channel.")
                    .setFooter(client.user.username, client.user.avatarURL());
                inter.reply({embeds:[embed], ephemeral: true});
                return;
            }
            await guild.setSetting('voteChannel', inter.values[0]);
            const embed = new MessageEmbed()
                .setColor("#00bfff")
                .setTitle("Succès")
                .setDescription("Channel défini !")
                .setFooter(client.user.username, client.user.avatarURL());
            inter.reply({embeds: [embed], ephemeral: true});
            inter.guild.channels.fetch(inter.values[0]).then((channel: TextChannel) => {
                const embed = new MessageEmbed()
                    .setColor("#00bfff")
                    .setTitle("Information")
                    .setDescription("Ce channel a été défini comme channel de vote démocratique.")
                    .setFooter(client.user.username, client.user.avatarURL());
                channel.send({embeds: [embed]});
            })
        });
    }
}