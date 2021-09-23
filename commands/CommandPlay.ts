import { Client, CommandInteraction } from "discord.js";
import ArgType from "../util/argtype";
import Command from "../util/command";
import * as youtubeSearch from "youtube-search";
import Database from "../util/database";
import { InteractionResponseType } from "discord-api-types";

class CommandPlay extends Command
{
    constructor() 
    {
        super("play", "Jouer une musique dans le channel actuel");
        this.addArgument("musique", "Nom ou lien de la musique", ArgType.STRING, true);
        this.register();
    }

    run(client: Client, db: Database, interaction: CommandInteraction)
    {
        super.run(client, db, interaction);
        const input_string = interaction.options.getString("musique", true);
        const re = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
        const regexResult = re.exec(input_string);
        let videoID = "";
        
        if (regexResult !== null)
            interaction.reply("https://www.youtube.com/watch?v=" + regexResult[5]);
        else {
            const searchQuery = input_string;
            db.getSetting("youtube-api-key", "YOUR API KEY HERE").then(key => {
                let opts: youtubeSearch.YouTubeSearchOptions = {
                    maxResults: 10,
                    key: key
                };
                youtubeSearch(searchQuery, opts, (err, results) => {
                    if (err) {
                        interaction.reply(err.message);
                        return;
                    }
                    if (results.length === 0)
                        interaction.reply("Aucun resultat.");
                    else
                        interaction.reply(results[0].link);
                })
            });
        }
        
    }
}

export default CommandPlay;