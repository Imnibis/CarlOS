import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import MusicPlayer from "../music/musicplayer";
import MusicQueue from "../music/musicqueue";
import Command from "../util/command";
import ListMessage, { ElementList } from "../util/listmessage";

class CommandRemove extends Command
{
    constructor() 
    {
        super("remove", "Retirer une musique de la file d'attente");
        this.register();
    }

    run(client: Client, interaction: CommandInteraction)
    {
        super.run(client, interaction);
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
                const embed = new MessageEmbed()
                    .setColor("#00bfff")
                    .setTitle(":put_litter_in_its_place: Retirer une musique")
                    .setDescription("Musique retirée.")
                    .setFooter(client.user.username, client.user.avatarURL());
                interaction.followUp({embeds:[embed]});
            })
            .send(interaction);
    }
}

export default CommandRemove;