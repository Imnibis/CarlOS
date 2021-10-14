import { Client, Intents } from "discord.js";
import MusicPlayer from "./music/musicplayer";
import CommandManager from "./util/commandManager";
import ListMessage from "./util/listmessage";

class Bot
{
    static client: Client

    constructor(token)
    {
        Bot.client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES]});
        Bot.client.on("ready", this.onReady.bind(this));
        
        Bot.client.login(token);
    }

    onReady() {
        console.log(`Logged in as ${Bot.client.user.tag}`);
        console.log(`Registering commands...`);
        CommandManager.init(Bot.client);
        CommandManager.handleInteractionEvent();
    }
}

process.on("beforeExit", () => {
    MusicPlayer.destroyConnections();
})
process.on("SIGINT", () => {
    MusicPlayer.destroyConnections();
})

export default Bot;