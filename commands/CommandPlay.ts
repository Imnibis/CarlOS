import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import Command from "../util/command";
import YoutubeVideo from "../music/youtubeVideo";
import MusicQueue from "../music/musicqueue";
import MusicPlayer from "../music/musicplayer";
import { SlashCommandBuilder } from "@discordjs/builders";
import Bot from "../bot";

class CommandPlay implements Command {
    data= new SlashCommandBuilder()
        .setName("play")
        .setDescription("Jouer une musique dans le channel actuel")
        .addStringOption(option => (
            option.setName("musique")
                .setDescription("Nom ou lien de la musique")
                .setRequired(true)
        ));

    run(interaction: CommandInteraction)
    {
        const input_string = interaction.options.getString("musique", true);
        const re = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
        const regexResult = re.exec(input_string);
        
        if (!MusicPlayer.checkVoiceChannel(Bot.client, interaction))
            return;
        new Promise<YoutubeVideo>((resolve, reject) => {
            if (regexResult !== null) resolve(new YoutubeVideo(regexResult[5]));
            else YoutubeVideo.search(input_string).then(async videos =>
                (videos.length === 0 ? resolve(null) : resolve(await videos[0])));
        }).then(video => {
            if (video === null) {
                this.sendDoesntExistMessage(interaction);
                return;
            }
            video.ready.then(() => {
                if (!video.exists) this.sendDoesntExistMessage(interaction)
                else {
                    MusicQueue.append(video, interaction.member as GuildMember);
                    interaction.reply({embeds:[video.embed(Bot.client)]});
                }
            });
        }).catch(() => {});
    }

    sendDoesntExistMessage(interaction: CommandInteraction)
    {
        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Erreur")
            .setDescription("Vidéo introuvable")
            .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
        interaction.reply({embeds:[embed]});
    }
}

export default new CommandPlay();