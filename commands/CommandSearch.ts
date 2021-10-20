import { Client, CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import MusicPlayer from "../music/musicplayer";
import MusicQueue from "../music/musicqueue";
import YoutubeVideo from "../music/youtubeVideo";
import ArgType from "../util/argtype";
import Command from "../util/command";
import ListMessage, { ElementList } from "../util/listmessage";

class CommandSearch extends Command
{
    constructor() 
    {
        super("search", "Chercher une musique sur YouTube");
        this.addArgument("keywords", "Mots clés de la recherche", ArgType.STRING, true);
        this.register();
    }

    run(client: Client, interaction: CommandInteraction)
    {
        super.run(client, interaction);
        if (!MusicPlayer.checkVoiceChannel(client, interaction))
            return;
        this.sendFuckYoutubeMessage(client, interaction);
        return;
        YoutubeVideo.search(interaction.options.getString("keywords", true)).then(videos => {
            new ListMessage("Résultats de recherche", "Aucun résultat.", 1, true)
                .setUpdateFunction((from, nb) => {
                    let elementList: ElementList = []
                    let i = 0;
                    videos.forEach(video => {
                        if (i >= from && i < from + nb) {
                            elementList.push({title: video.title, description:
                                `${video.formattedDuration()} - par ${video.channelTitle}`});
                        }
                        i++;
                    });
                    return elementList;
                })
                .setInterractFunction(function(nb) {
                    if (nb >= videos.length) return;
                    const video = videos[nb];
                    if (video === null) return;
                    if (!video.exists) return;
                    else {
                        MusicQueue.append(video, interaction.member as GuildMember);
                        this.delete();
                        interaction.followUp({embeds:[video.embed(client)]});
                    }
                })
                .send(interaction);
        }).catch(console.error)
    }

    sendFuckYoutubeMessage(client: Client, interaction: CommandInteraction)
    {
        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Erreur")
            .setDescription("Youtube est ultra chiant avec les quotas donc j'ai désactivé "
                + "la recherche jusqu'à trouver une bonne alternative")
            .setFooter(client.user.username, client.user.avatarURL());
        interaction.reply({embeds:[embed]});
    }
}

export default CommandSearch;