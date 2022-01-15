import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import ArgType from "../../util/argtype";
import Command from "../../util/command";

class CommandChannelAdd extends Command
{
    constructor() 
    {
        super("add", "Créer un channel", true);
        this.addArgument("nom", "Nom du channel", ArgType.STRING, true);
        this.addArgument("catégorie", "Catégorie où placer le channel", ArgType.CHANNEL, true);
    }

    run(client: Client, interaction: CommandInteraction)
    {
        super.run(client, interaction);
        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Erreur")
            .setDescription("aaa")
            .setFooter(client.user.username, client.user.avatarURL());
        interaction.reply({embeds:[embed], ephemeral: true});
    }
}

export default CommandChannelAdd;