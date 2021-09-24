import { Client, Guild, Intents } from "discord.js"
import Database from "./util/database"
import * as settings from "./settings.json"
import CommandManager from "./util/commandManager"

class Bot
{
    client: Client
    constructor(token)
    {
        this.client = new Client({intents: [Intents.FLAGS.GUILDS]});
        this.client.on("ready", this.onReady.bind(this));
        
        this.client.login(token);
    }

    onReady() {
        console.log(`Logged in as ${this.client.user.tag}`);
        console.log(`Registering commands...`);
        CommandManager.init(this.client);
        CommandManager.handleInteractionEvent();
    }
}

Database.init(settings.host, settings.user, settings.password, settings.database);
var bot: Bot;
Database.getSetting("token", "YOUR TOKEN HERE")
    .then(token => { bot = new Bot(token); })