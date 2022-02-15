import { Client, IntentsBitField, Message } from "discord.js";
import Guild from "./models/guild.model";
import MusicPlayer from "./music/musicplayer";
import CommandManager from "./util/commandManager";
import FunReplies from "./util/funReplies";
import ListMessage from "./util/listmessage";

class Bot
{
    static client: Client

    constructor(token)
    {
        Bot.client = new Client({intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMembers,
            IntentsBitField.Flags.GuildBans,
            IntentsBitField.Flags.GuildVoiceStates,
            IntentsBitField.Flags.GuildMessageReactions,
            IntentsBitField.Flags.GuildMessages,
        ]});
        Bot.client.on("ready", this.onReady.bind(this));
        
        Bot.client.login(token);
    }

    onReady() {
        console.log(`Logged in as ${Bot.client.user.tag}`);
        
        Bot.client.guilds.cache.forEach(guild => {
            Guild.findOrCreate({
                where: { id: guild.id },
                defaults: { id: guild.id, name: guild.name }
            });
        });
        console.log(`Registering commands...`);
        CommandManager.init(Bot.client);
        CommandManager.handleInteractionEvent();
        Bot.client.on("messageCreate" , (message: Message) => {
            if(message.author.bot)
                return;
            FunReplies.replyDis(message);
            FunReplies.replyFeur(message);
        })
    }
}

export default Bot;