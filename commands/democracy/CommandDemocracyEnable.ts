import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction, ComponentType, Message, ActionRow, SelectMenuComponent, SelectMenuInteraction, TextChannel, SelectMenuOption } from "discord.js";
import Guild from "../../models/guild.model";
import CarlOSEmbed from "../../util/carlosEmbed";
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
        const embed = CarlOSEmbed.successEmbed("Démocratie activée!")
        const selectMenu = new SelectMenuComponent()
            .setCustomId('selectChannel')
            .setPlaceholder('Sélectionnez le channel de vote');
        interaction.guild.channels.cache.filter(channel => channel.isTextBased()).forEach(channel => {
            selectMenu.addOptions(
                new SelectMenuOption()
                    .setLabel(`#${channel.name}`)
                    .setValue(channel.id)
            );
        });
        const row = new ActionRow().addComponents(selectMenu)
        interaction.reply({embeds: [embed], components: [row]});
        const msg = await interaction.fetchReply() as Message;
        const collector = msg.createMessageComponentCollector({componentType: ComponentType.SelectMenu});

        collector.on('collect', async (inter: SelectMenuInteraction) => {
            if (inter.user.id !== interaction.user.id) {
                const embed = CarlOSEmbed.errorEmbed("Seul l'utilisateur ayant activé la démocratie peut choisir le channel.")
                inter.reply({embeds:[embed], ephemeral: true});
                return;
            }
            await guild.setSetting('voteChannel', inter.values[0]);
            const embed = CarlOSEmbed.successEmbed("Channel défini !")
            inter.reply({embeds: [embed], ephemeral: true});
            inter.guild.channels.fetch(inter.values[0]).then((channel: TextChannel) => {
                const embed = CarlOSEmbed.infoEmbed()
                    .setTitle("Information")
                    .setDescription("Ce channel a été défini comme channel de vote démocratique.")
                channel.send({embeds: [embed]});
            })
        });
    }
}

export default new CommandDemocracyEnable();