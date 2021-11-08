import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import MusicPlayer from "../music/musicplayer";
import Command from "../util/command";

class CommandResume extends Command
{
    constructor() 
    {
        super("resume", "Reprendre la musique actuelle");
        this.register();
    }

    run(client: Client, interaction: CommandInteraction)
    {
        super.run(client, interaction);
        if (MusicPlayer.isPaused(interaction.guild)) {
            MusicPlayer.resume(interaction.guild);
            const embed = new MessageEmbed()
                .setColor("#00bfff")
                .setTitle(":arrow_forward: Play")
                .setDescription("Musique reprise.")
                .setFooter(client.user.username, client.user.avatarURL());
            interaction.reply({embeds:[embed]});
        } else {
            const embed = new MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Erreur")
                .setDescription("Aucune musique n'est en pause.")
                .setFooter(client.user.username, client.user.avatarURL());
            interaction.reply({embeds:[embed]});
        }
    }
}

export default CommandResume;