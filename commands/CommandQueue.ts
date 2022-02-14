import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, } from "discord.js";
import MusicQueue from "../music/musicqueue";
import Command from "../util/command";
import ListMessage, { ElementList } from "../util/listmessage";

class CommandQueue implements Command
{
    data = new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Afficher les musiques dans la file d'attente");

    run(interaction: CommandInteraction)
    {
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

export default new CommandQueue();