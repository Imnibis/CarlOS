import { Client, Guild, Intents } from "discord.js"
import Database from "./util/database"
import * as settings from "./settings.json"
import CommandManager from "./util/commandManager"
import Bot from "./bot";
import MusicPlayer from "./music/musicplayer"


Database.init(settings.host, settings.user, settings.password, settings.database);
var bot: Bot;
Database.getSetting("token", "YOUR TOKEN HERE")
    .then(token => { bot = new Bot(token); })

process.on("beforeExit", () => {
    MusicPlayer.destroyConnections();
})
process.on("SIGINT", () => {
    MusicPlayer.destroyConnections();
})