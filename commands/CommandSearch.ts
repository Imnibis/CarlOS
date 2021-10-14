import { Client, CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
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
        this.addArgument("mots clés", "Mots clés de la recherche", ArgType.STRING, true);
        this.register();
    }

    run(client: Client, interaction: CommandInteraction)
    {
        super.run(client, interaction);
        YoutubeVideo.search(interaction.options.getString("mots clés", true)).then(videos => {
            new ListMessage("Résultats de recherche", "Aucun résultat.", 1, true)
                .setUpdateFunction((from, nb) => {
                    let elementList: ElementList = []
                    let i = 0;
                    videos.forEach(video => {
                        elementList.push({title: video.title, description:
                            `${video.formattedDuration()} - par ${video.channelTitle}`});
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
        })
    }
}

export default CommandSearch;