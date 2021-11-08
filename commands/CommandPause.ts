import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import MusicPlayer from "../music/musicplayer";
import Command from "../util/command";

class CommandPause extends Command
{
    constructor() 
    {
        super("pause", "Mettre en pause la musique actuelle");
        this.register();
    }

    run(client: Client, interaction: CommandInteraction)
    {
        super.run(client, interaction);
        if (MusicPlayer.isPlaying(interaction.guild)) {
            MusicPlayer.pause(interaction.guild);
            const embed = new MessageEmbed()
                .setColor("#00bfff")
                .setTitle(":pause: Pause")
                .setDescription("Musique mise en pause.")
                .setFooter(client.user.username, client.user.avatarURL());
            interaction.reply({embeds:[embed]});
        } else {
            const embed = new MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Erreur")
                .setDescription("Aucune musique n'est en cours.")
                .setFooter(client.user.username, client.user.avatarURL());
            interaction.reply({embeds:[embed]});
        }
    }
}

export default CommandPause;