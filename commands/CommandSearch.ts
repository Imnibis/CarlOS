import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, Client, CommandInteraction, GuildMember } from "discord.js";
import Bot from "../bot";
import MusicPlayer from "../music/musicplayer";
import MusicQueue from "../music/musicqueue";
import YoutubeVideo from "../music/youtubeVideo";
import Command from "../util/command";
import ListMessage, { ElementList } from "../util/listmessage";

class CommandSearch implements Command
{
    data = new SlashCommandBuilder()
        .setName("search")
        .setDescription("Chercher une musique sur YouTube")
        .addStringOption(option => (
            option.setName("keywords")
                .setDescription("Mots clés de la recherche")
                .setRequired(true)
        ));

    run(interaction: ChatInputCommandInteraction)
    {
        if (!MusicPlayer.checkVoiceChannel(Bot.client, interaction))
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
                        interaction.followUp({embeds:[video.embed(Bot.client)]});
                    }
                })
                .send(interaction);
        }).catch(console.error)
    }
}

export default new CommandSearch();