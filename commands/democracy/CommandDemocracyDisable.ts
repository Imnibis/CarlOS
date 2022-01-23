import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import Guild from "../../models/guild.model";
import Command from "../../util/command";

export default class CommandDemocracyDisable extends Command
{
    constructor()
    {
        super("disable", "Désactiver la démocratie sur ce serveur", true);
    }

    async run(client: Client, interaction: CommandInteraction): Promise<void>
    {
        const guild = await Guild.findOne({where: {id: interaction.guildId}})
        guild.$get('settings').then(settings => {
            let democracySetting = settings.find(x => x.name === 'democracy');
            let promise;

            if (democracySetting)
                promise = democracySetting.update({value: false})
            else
                promise = guild.$create('setting', {name: 'democracy', value: false})
            promise.then(() => {
                const embed = new MessageEmbed()
                    .setColor("#00bfff")
                    .setTitle("Succès")
                    .setDescription("Démocratie déactivée!")
                    .setFooter(client.user.username, client.user.avatarURL());
                interaction.reply({embeds: [embed]})
            })
        })
    }
}