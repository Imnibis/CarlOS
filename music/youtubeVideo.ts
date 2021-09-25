import request = require("request");
import youtubeSearch = require("youtube-search");
import YouTube from "ytube-api";
import Database from "../util/database";

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
                        this.exists = true;
                        this.title = res.snippet.title;
                        this.description = res.snippet.description;
                        this.thumbnail = res.snippet.thumbnails.maxres.url;
                        this.duration = res.contentDetails.duration;
                        this.channelId = res.snippet.channelId;
                        this.channelTitle = res.snippet.channelTitle;
                        youtube.getChannelById([res.snippet.channelId], (err, chan) => {
                            if (err) this.channelPicture = "";
                            else this.channelPicture = chan.snippet.thumbnails.high.url;
                            resolve();
                        });
                    }
                });
            });
        });
    }

    static search(searchQuery: string) : Promise<YoutubeVideo>
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
                    if (results.length === 0)
                        reject();
                    else
                        resolve(new YoutubeVideo(results[0].id));
                });
            });
        });
    }
}

export default YoutubeVideo;