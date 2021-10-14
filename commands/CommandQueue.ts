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
        const embed = new MessageEmbed()
            .setColor("#00bfff")
            .setTitle("File d'attente")
            .setFooter(client.user.username, client.user.avatarURL());
        const queue = MusicQueue.list(interaction.guild, 0, 10);
        new ListMessage("File d'attente")
            .setUpdateFunction((from, nb) => {
                let elementList: ElementList = []
                let i = 0;
                queue.forEach(element => {
                    if (i >= from && i < from + nb) {
                        const video = element.video;
                        elementList.push({title: video.title, description:
                            `${video.formattedDuration()} - Ajoutée par ${element.user.nickname}`});
                    }
                });
                return elementList;
            })
            .send(interaction);
    }
}

export default CommandQueue;