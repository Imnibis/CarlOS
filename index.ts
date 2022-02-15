import Bot from "./bot";
import MusicPlayer from "./music/musicplayer"
import Setting from "./models/setting.model";
import { sequelize } from "./util/sequelize";

var bot: Bot;

(async () => {
    await sequelize.sync();

    Setting.findOrCreate({
        where: {
            name: "token",
        },
        defaults: {
            name: "token", 
            value: "YOUR TOKEN HERE",
        },
    }).then(row => {
        bot = new Bot(row[0].value);
    })
})()

process.on("beforeExit", () => {
    MusicPlayer.destroyConnections();
})
process.on("SIGINT", () => {
    MusicPlayer.destroyConnections();
})