import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import Command from "../../util/command";
import CommandChannelAdd from "./CommandChannelAdd";

class CommandChannel extends Command
{
    constructor() 
    {
        super("channel", "Créer, supprimer ou modifier un channel");
        this.addSubcommand(new CommandChannelAdd());
        this.register();
    }

    run(client: Client, interaction: CommandInteraction)
    {
        super.run(client, interaction);
        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Erreur")
            .setDescription("Veuillez préciser une action")
            .setFooter(client.user.username, client.user.avatarURL());
        interaction.reply({embeds:[embed], ephemeral: true});
    }
}

export default CommandChannel;