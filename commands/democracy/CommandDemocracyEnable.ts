import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, Message, MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction, TextChannel } from "discord.js";
import Bot from "../../bot";
import Guild from "../../models/guild.model";
import { Subcommand } from "../../util/subcommand";

class CommandDemocracyEnable implements Subcommand
{
    data = new SlashCommandSubcommandBuilder()
        .setName("enable")
        .setDescription("Activer la démocratie sur ce serveur");

    async run(interaction: CommandInteraction): Promise<void>
    {
        const guild = await Guild.findOne({where: {id: interaction.guildId}})
        await guild.setSetting('democracy', true);
        const embed = new MessageEmbed()
            .setColor("#00bfff")
            .setTitle("Succès")
            .setDescription("Démocratie activée!")
            .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
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
                    .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
                inter.reply({embeds:[embed], ephemeral: true});
                return;
            }
            await guild.setSetting('voteChannel', inter.values[0]);
            const embed = new MessageEmbed()
                .setColor("#00bfff")
                .setTitle("Succès")
                .setDescription("Channel défini !")
                .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
            inter.reply({embeds: [embed], ephemeral: true});
            inter.guild.channels.fetch(inter.values[0]).then((channel: TextChannel) => {
                const embed = new MessageEmbed()
                    .setColor("#00bfff")
                    .setTitle("Information")
                    .setDescription("Ce channel a été défini comme channel de vote démocratique.")
                    .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
                channel.send({embeds: [embed]});
            })
        });
    }
}

export default new CommandDemocracyEnable();