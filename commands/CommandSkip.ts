import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import MusicPlayer from "../music/musicplayer";
import Command from "../util/command";

class CommandSkip extends Command
{
    constructor() 
    {
        super("skip", "Skip la musique actuelle");
        this.register();
    }

    run(client: Client, interaction: CommandInteraction)
    {
        super.run(client, interaction);
        MusicPlayer.playNext(interaction.guild);
        const embed = new MessageEmbed()
            .setColor("#00bfff")
            .setTitle("Skip ! :fast_forward:")
            .setDescription("Musique skippée !")
            .setFooter(client.user.username, client.user.avatarURL());
        interaction.reply({embeds:[embed]});
    }
}

export default CommandSkip;