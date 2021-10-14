import { AudioResource, createAudioResource, demuxProbe } from "@discordjs/voice";
import { Guild, GuildMember, GuildMemberEditData } from "discord.js";
import Bot from "../bot";
import YoutubeVideo from "./youtubeVideo";
import { raw as ytdl } from "youtube-dl-exec";


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

    createAudioResource(): Promise<AudioResource<Music>> {
		return new Promise((resolve, reject) => {
			const process = ytdl(
				this.video.id,
				{
					o: '-',
					q: true,
					f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
					r: '100K',
				},
				{ stdio: ['ignore', 'pipe', 'ignore'] },
			);
			if (!process.stdout) {
				reject(new Error('No stdout'));
				return;
			}
			const stream = process.stdout;
			const onError = (error: Error) => {
				if (!process.killed) process.kill();
				stream.resume();
				reject(error);
			};
			process.once('spawn', () => {
					demuxProbe(stream)
						.then((probe) => resolve(createAudioResource(probe.stream, { metadata: this, inputType: probe.type })))
						.catch(onError);
				})
				.catch(onError);
		});
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