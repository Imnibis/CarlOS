import * as request from "request";
import youtubeSearch = require("youtube-search");
import yt = require("youtube.get-video-info");
import Database from "../util/database";

class YoutubeVideo
{
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    duration: number;

    constructor(videoID: string)
    {
        this.id = videoID;
        this.name = null;
        this.description = null;
        this.thumbnail = null;
        this.duration = null;
        this.exists().then(videoExists => {
            if (videoExists) {
                yt.retrieve(videoID, (err, res) => {
                    if (err) throw err;
                    console.log(res);
                })
            }
        });
    }

    exists() : Promise<boolean>
    {
        return new Promise((resolve, reject) => {
            request.get(`https://img.youtube.com/vi/${this.id}/0.jpg`, (err, res, body) => {
                resolve(res.statusCode === 200);
            });
        });
    }

    static searchVideo(searchQuery: string) : Promise<YoutubeVideo>
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