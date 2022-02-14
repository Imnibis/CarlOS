import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import Bot from "../../bot";
import Guild from "../../models/guild.model";
import { Subcommand } from "../../util/subcommand";

class CommandDemocracyDisable implements Subcommand
{
    data = new SlashCommandSubcommandBuilder()
        .setName("disable")
        .setDescription("Désactiver la démocratie sur ce serveur")

    async run(interaction: CommandInteraction): Promise<void>
    {
        const guild = await Guild.findOne({where: {id: interaction.guildId}})
        await guild.setSetting('democracy', false);
        const embed = new MessageEmbed()
            .setColor("#00bfff")
            .setTitle("Succès")
            .setDescription("Démocratie désactivée!")
            .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
        interaction.reply({embeds: [embed]})
    }
}

export default new CommandDemocracyDisable()