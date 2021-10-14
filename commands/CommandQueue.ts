import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import MusicQueue from "../music/musicqueue";
import ArgType from "../util/argtype";
import Command from "../util/command";
import ListMessage, { ElementList } from "../util/listmessage";

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
        new ListMessage("File d'attente", "La file d'attente est vide.")
            .setUpdateFunction((from, nb) => {
                let elementList: ElementList = []
                let i = 0;
                let queue = MusicQueue.list(interaction.guild, from, nb);
                queue.forEach(element => {
                    const video = element.video;
                    elementList.push({title: video.title, description:
                        `${video.formattedDuration()} - par ${video.channelTitle}`});
                });
                return elementList;
            })
            .send(interaction);
    }
}

export default CommandQueue;