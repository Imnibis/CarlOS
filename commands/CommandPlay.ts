import { Client, CommandInteraction } from "discord.js";
import ArgType from "../util/argtype";
import Command from "../util/command";
import * as yt from "youtube-search-without-api-key";

class CommandPlay extends Command
{
    constructor() 
    {
        super("play", "Jouer une musique dans le channel actuel");
        this.addArgument("musique", "Nom ou lien de la musique", ArgType.STRING, true);
        this.register();
    }

    run(client: Client, interaction: CommandInteraction)
    {
        super.run(client, interaction);
        const input_string = interaction.options.getString("musique", true);
        const re = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
        const regexResult = re.exec(input_string);
        let searchQuery = "";
        
        if (regexResult !== null)
            searchQuery = regexResult[5];
        else
            searchQuery = input_string;
        console.log("Search query: " + searchQuery);
        (async () => {
            const searchResult = await yt.search(searchQuery);

            if (searchResult.length !== 0)
                interaction.reply(searchResult[0].title);
            else
                interaction.reply("Aucun résultat.");
        })();
    }
}

export default CommandPlay;