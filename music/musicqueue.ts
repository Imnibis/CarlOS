import { Guild, GuildMember } from "discord.js";
import Database from "../util/database";
import Music from "./music";
import MusicPlayer from "./musicplayer";
import YoutubeVideo from "./youtubeVideo";

class MusicQueue
{
    static queue: [{guild: Guild, queue: Music[]}?] = [];

    static pop(guild: Guild) : Music | null
    static pop(guildId: string) : Music | null
    static pop(arg: Guild | string) : Music | null
    {
        let guildId : string = (arg instanceof Guild ? arg.id : arg);
        let list = MusicQueue.list(guildId, 0, 1);
        
        if (list.length === 0) return null;
        else {
            MusicQueue.remove(guildId, 0);
            return list[0];
        }
    }
    
    static remove(guild: Guild, id: number) : void
    static remove(guildId: string, id: number) : void
    static remove(arg: Guild | string, id: number) : void
    {
        let guildId : string = (arg instanceof Guild ? arg.id : arg);
        this.queue.find(elem => elem.guild.id == guildId)?.queue.splice(id);
    }

    static list(guild: Guild, from: number, nb: number) : Music[]
    static list(guildId: string, from: number, nb: number) : Music[]
    static list(arg: Guild | string, from: number, nb: number) : Music[]
    {
        let guildId : string = (arg instanceof Guild ? arg.id : arg);
        return this.queue.find(elem => elem.guild.id == guildId) ?
            this.queue.find(elem => elem.guild.id == guildId).queue.slice(from, from + nb) :
            [];
    }

    static append(music: Music) : void;
    static append(video: YoutubeVideo, user: GuildMember) : void
    static append(arg1: Music | YoutubeVideo, arg2?: GuildMember) : void
    {
        let music: Music;
        if (arg1 instanceof YoutubeVideo && arg2 instanceof GuildMember)
            music = new Music(arg1, arg2);
        else if (arg1 instanceof Music)
            music = arg1;
        else throw new Error();
        let guildElem = this.queue.find(elem => elem.guild.id == music.user.guild.id);
        if (!guildElem) {
            this.queue.push({guild: music.user.guild, queue: [music]});
            MusicPlayer.playNext(music.user.guild);
        } else
            guildElem.queue.push(music);
    }
}

export default MusicQueue;