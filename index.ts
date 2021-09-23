import { Client, Guild, Intents } from "discord.js"
import Database from "./util/database"
import * as settings from "./settings.json"
import CommandManager from "./util/commandManager"

class Bot
{
    client: Client
    db: Database
    constructor(db, token)
    {
        this.db = db;
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

var db = new Database(settings.host, settings.user,
    settings.password, settings.database);
var bot: Bot;
db.getSetting("token", "YOUR TOKEN HERE")
    .then(token => {
    bot = new Bot(db, token);
})