import request = require("request");
import youtubeSearch = require("youtube-search");
import YouTube = require("ytube-api");
import Database from "../util/database";
import moment = require("moment");
import mdfSetup = require("moment-duration-format");
import { Client, MessageEmbed } from "discord.js";

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
    ready: Promise<void>;

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
        this.ready = new Promise((resolve, reject) => {
            const youtube = new YouTube();
            Database.getSetting("youtube-api-key", "YOUR API KEY HERE").then(key => {
                youtube.setKey(key);
                youtube.getById([videoID], (err, res) => {
                    if (err) {
                        this.exists = false;
                        resolve();
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
                            resolve();
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

    embed(client: Client) : MessageEmbed
    {
        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle(this.title)
            .setURL(`https://www.youtube.com/watch?v=${this.id}`)
            .setDescription(this.formattedDuration())
            .setAuthor(this.channelTitle, this.channelPicture,
                `https://www.youtube.com/channel/${this.channelId}`)
            .setThumbnail(this.thumbnail)
            .setFooter(client.user.username, client.user.avatarURL());
        return embed;
    }

    static search(searchQuery: string) : Promise<YoutubeVideo[]>
    {
        return new Promise((resolve, reject) => {
            Database.getSetting("youtube-api-key", "YOUR API KEY HERE").then(key => {
                let opts: youtubeSearch.YouTubeSearchOptions = {
                    maxResults: 10,
                    key: key
                };
                youtubeSearch(searchQuery, opts, (err, results) => {
                    if (err) {
                        reject();
                        return;
                    }
                    if (results.length === 0) reject();
                    else {
                        let videos = []
                        for (let i = 0; i < results.length; i++)
                            videos.push(new YoutubeVideo(results[i].id));
                        resolve(videos);
                    }
                });
            });
        });
    }
}

export default YoutubeVideo;