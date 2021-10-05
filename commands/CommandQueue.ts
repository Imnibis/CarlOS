import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import MusicQueue from "../music/musicqueue";
import ArgType from "../util/argtype";
import Command from "../util/command";

class CommandQueue extends Command
{
    constructor() 
    {
        super("queue", "Afficher les musiques dans la file d'attente");
        this.register();
    }

    run(client: Client, interaction: CommandInteraction)
    {
        super.run(client, interaction);
        const embed = new MessageEmbed()
            .setColor("#00bfff")
            .setTitle("File d'attente")
            .setFooter(client.user.username, client.user.avatarURL());
        const queue = MusicQueue.list(interaction.guild, 0, 10);
        
    }
}

export default CommandQueue;