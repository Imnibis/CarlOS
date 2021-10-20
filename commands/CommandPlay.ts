import { Client, CommandInteraction, GuildMember, MessageEmbed, VoiceChannel } from "discord.js";
import ArgType from "../util/argtype";
import Command from "../util/command";
import * as youtubeSearch from "youtube-search";
import Database from "../util/database";
import YoutubeVideo from "../music/youtubeVideo";
import { InteractionResponseType } from "discord-api-types";
import MusicQueue from "../music/musicqueue";
import MusicPlayer from "../music/musicplayer";

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
        
        if (!MusicPlayer.checkVoiceChannel(client, interaction))
            return;
        new Promise<YoutubeVideo>((resolve, reject) => {
            if (regexResult !== null) resolve(new YoutubeVideo(regexResult[5]));
            else {
                this.sendFuckYoutubeMessage(client, interaction);
                reject();
                //YoutubeVideo.search(input_string).then(async videos =>
                //(videos.length === 0 ? resolve(null) : resolve(await videos[0])));
            }
        }).then(video => {
            if (video === null) {
                this.sendDoesntExistMessage(client, interaction);
                return;
            }
            video.ready.then(() => {
                if (!video.exists) this.sendDoesntExistMessage(client, interaction)
                else {
                    MusicQueue.append(video, interaction.member as GuildMember);
                    interaction.reply({embeds:[video.embed(client)]});
                }
            });
        }).catch();
    }

    sendFuckYoutubeMessage(client: Client, interaction: CommandInteraction)
    {
        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Erreur")
            .setDescription("Utilisez le lien de la vidéo SVP. " + 
                "Youtube est ultra chiant avec les quotas donc j'ai désactivé "
                + "la recherche jusqu'à trouver une bonne alternative")
            .setFooter(client.user.username, client.user.avatarURL());
        interaction.reply({embeds:[embed]});
    }

    sendDoesntExistMessage(client: Client, interaction: CommandInteraction)
    {
        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Erreur")
            .setDescription("Vidéo introuvable")
            .setFooter(client.user.username, client.user.avatarURL());
        interaction.reply({embeds:[embed]});
    }

    
}

export default CommandPlay;