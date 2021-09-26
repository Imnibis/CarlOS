import { Guild, GuildMember, GuildMemberEditData } from "discord.js";
import Bot from "../bot";
import YoutubeVideo from "./youtubeVideo";

class Music
{
    video: YoutubeVideo
    user: GuildMember

    constructor(video: YoutubeVideo, user: GuildMember)
    {
        this.video = video;
        this.user = user;
    }

    static fromIds(videoId: string, userId: string, guildId: string) : Music
    {
        const video = new YoutubeVideo(videoId);
        const guild = Bot.client.guilds.resolve(guildId);
        const guildMember = guild.members.resolve(userId);
        
        return new Music(video, guildMember);
    }
}

export default Music;