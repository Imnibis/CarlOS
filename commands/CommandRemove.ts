import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Bot from "../bot";
import MusicQueue from "../music/musicqueue";
import CarlOSEmbed from "../util/carlosEmbed";
import Command from "../util/command";
import ListMessage, { ElementList } from "../util/listmessage";

class CommandRemove implements Command
{
    data = new SlashCommandBuilder()
        .setName("remove")
        .setDescription("Retirer une musique de la file d'attente");

    run(interaction: CommandInteraction)
    {
        new ListMessage(":put_litter_in_its_place: Retirer une musique", "La file d'attente est vide.", 0, true)
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
            .setInterractFunction(function(nb) {
                MusicQueue.remove(interaction.guild, nb);
                this.delete();
                const embed = CarlOSEmbed.infoEmbed()
                    .setTitle(":put_litter_in_its_place: Retirer une musique")
                    .setDescription("Musique retirée.")
                interaction.followUp({embeds:[embed]});
            })
            .send(interaction);
    }
}

export default new CommandRemove();