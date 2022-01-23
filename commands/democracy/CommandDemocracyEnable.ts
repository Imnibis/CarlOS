import { Client, CommandInteraction, MessageEmbed } from "discord.js";
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
        interaction.reply({embeds: [embed]})
    }
}