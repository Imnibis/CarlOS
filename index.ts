import { Client, Guild } from "discord.js"
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
        this.client = new Client();
        this.client.on("ready", this.onReady.bind(this));
        
        this.client.login(token);
    }

    onReady() {
        console.log(`Logged in as ${this.client.user.tag}`);
        CommandManager.registerCommand(this.client, {name: "ping", description: "A simple ping command"});
        CommandManager.handleInteractionEvent(this.client);
    }
}

var db = new Database(settings.host, settings.user,
    settings.password, settings.database);
var bot: Bot;
db.getSetting("token", "YOUR TOKEN HERE")
    .then(token => {
    bot = new Bot(db, token);
})