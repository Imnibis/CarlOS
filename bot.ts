import { Client, Intents } from "discord.js";
import CommandManager from "./util/commandManager";

class Bot
{
    static client: Client
    constructor(token)
    {
        Bot.client = new Client({intents: [Intents.FLAGS.GUILDS]});
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

export default Bot;