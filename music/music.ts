import { Guild, GuildMember, GuildMemberEditData } from "discord.js";
import Bot from "../bot";
import YoutubeVideo from "./youtubeVideo";

class Music
{
    video: YoutubeVideo
    guildID: string
    userID: string

    constructor(video: YoutubeVideo, user: GuildMember)
    {
        this.video = video;
        this.guildID = user.guild.id;
        this.userID = user.id;
    }

    getUser() : GuildMember
    {
        const guild = Bot.client.guilds.resolve(this.guildID);
        const guildMember = guild.members.resolve(this.userID);

        return guildMember;
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