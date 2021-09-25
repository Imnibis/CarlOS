import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import ArgType from "../util/argtype";
import Command from "../util/command";
import * as youtubeSearch from "youtube-search";
import Database from "../util/database";
import YoutubeVideo from "../music/youtubeVideo";
import { InteractionResponseType } from "discord-api-types";

class CommandPlay extends Command
{
    constructor() 
    {
        super("play", "Jouer une musique dans le channel actuel");
        this.addArgument("musique", "Nom ou lien de la musique", ArgType.STRING, true);
        this.register();
    }

    run(client: Client, interaction: CommandInteraction)
    {
        super.run(client, interaction);
        const input_string = interaction.options.getString("musique", true);
        const re = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
        const regexResult = re.exec(input_string);
        new Promise<YoutubeVideo>((resolve, reject) => {
            if (regexResult !== null) resolve(new YoutubeVideo(regexResult[5]));
            else YoutubeVideo.search(input_string).then(resolve);
        }).then(video => {
            video.ready.then(() => {
                if (!video.exists) {
                    const embed = new MessageEmbed()
                        .setColor("#ff0000")
                        .setTitle("Erreur")
                        .setDescription("Vidéo introuvable")
                        .setFooter(client.user.username, client.user.avatarURL());
                    interaction.reply({embeds:[embed]});
                } else {
                    const embed = new MessageEmbed()
                        .setColor("#ff0000")
                        .setTitle(video.title)
                        .setURL(`https://www.youtube.com/watch?v=${video.id}`)
                        .setDescription(video.duration)
                        .setAuthor(video.channelTitle, video.channelPicture,
                            `https://www.youtube.com/channel/${video.channelId}`)
                        .setThumbnail(video.thumbnail)
                        .setFooter(client.user.username, client.user.avatarURL());
                    interaction.reply({embeds:[embed]});
                }
            });
        });
    }
}

export default CommandPlay;