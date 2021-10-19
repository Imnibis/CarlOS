import { Client, Intents } from "discord.js";
import MusicPlayer from "./music/musicplayer";
import CommandManager from "./util/commandManager";
import ListMessage from "./util/listmessage";

class Bot
{
    static client: Client

    constructor(token)
    {
        Bot.client = new Client({intents: [
            Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS]});
        Bot.client.on("ready", this.onReady.bind(this));
        
        Bot.client.login(token);
    }

    onReady() {
        console.log(`Logged in as ${Bot.client.user.tag}`);
        console.log(`Registering commands...`);
        CommandManager.init(Bot.client);
        CommandManager.handleInteractionEvent();
        Bot.client.on("messageCreate" , message => {
            console.log(`Message reçu de ${message.author.username}: ${message.content}`);
            if(message.author.bot)
                return;
            let splitString = message.content.split("di");
            splitString.shift();
            if (splitString.length == 0 || splitString[0] == "")
                return;
            message.reply(splitString.join("di"));
        })
    }
}

export default Bot;