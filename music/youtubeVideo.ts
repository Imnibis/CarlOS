import * as request from "request";
import * as youtubeSearch from "youtube-search-api";
import * as YouTube from "ytube-api";
import * as moment from "moment";
const mdfSetup = require("moment-duration-format");
import { Client, Colors, Embed } from "discord.js";
import Setting from "../models/setting.model";

mdfSetup(moment);

class YoutubeVideo
{
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    duration: string;
    channelId: string;
    channelTitle: string;
    channelPicture: string;
    exists: boolean;
    ready: Promise<YoutubeVideo>;

    constructor(videoID: string)
    {
        this.id = videoID;
        this.title = null;
        this.description = null;
        this.thumbnail = null;
        this.duration = null;
        this.channelId = null;
        this.channelTitle = null;
        this.channelPicture = null;
        this.exists = false;
        this.ready = new Promise<YoutubeVideo>((resolve, reject) => {
            const youtube = new YouTube();
            Setting.findOrCreate({
                where: {
                    name: "youtube-api-key",
                },
                defaults: {
                    name: "youtube-api-key",
                    value: "YOUTUBE API KEY HERE",
                }
            }).then(row => {
                const key = row[0].value;
                youtube.setKey(key);
                youtube.getById([videoID], (err, res) => {
                    if (err) {
                        this.exists = false;
                        resolve(this);
                    } else {
                        let video = res.items[0];
                        this.exists = true;
                        this.title = video.snippet.title;
                        this.description = video.snippet.description;
                        this.thumbnail = video.snippet.thumbnails.default.url;
                        this.duration = video.contentDetails.duration;
                        this.channelId = video.snippet.channelId;
                        this.channelTitle = video.snippet.channelTitle;
                        youtube.getChannelById([video.snippet.channelId], (err, chan) => {
                            if (err) this.channelPicture = "";
                            else this.channelPicture = chan.items[0].snippet.thumbnails.high.url;
                            resolve(this);
                        });
                    }
                });
            });
        });
    }

    formattedDuration() : string
    {
        return (moment.duration(this.duration).asHours() >= 1) ?
        moment.duration(this.duration).format("hh:mm:ss") :
        moment.duration(this.duration).format("mm:ss");
    }

    embed(client: Client) : Embed
    {
        const embed = new Embed()
            .setColor(Colors.Red)
            .setTitle(this.title)
            .setURL(`https://www.youtube.com/watch?v=${this.id}`)
            .setDescription(this.formattedDuration())
            .setAuthor({name: this.channelTitle, iconURL: this.channelPicture,
                url: `https://www.youtube.com/channel/${this.channelId}`})
            .setThumbnail(this.thumbnail)
            .setFooter({text: client.user.username, iconURL: client.user.avatarURL()});
        return embed;
    }

    static search(searchQuery: string, amount: number = 10) : Promise<YoutubeVideo[]>
    {
        return new Promise(async (resolve, reject) => {
            let results = await youtubeSearch.GetListByKeyword(searchQuery, false, amount);
            let videos: YoutubeVideo[] = [];
            if (!results?.items?.length)
                resolve(videos);
            for (let i = 0; i < results?.items?.length && i < amount; i++) {
                videos.push(await new YoutubeVideo(results.items[i].id).ready);
            }
            resolve(videos);
        });
    }
}

export default YoutubeVideo;