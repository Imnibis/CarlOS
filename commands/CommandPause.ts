import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Bot from "../bot";
import MusicPlayer from "../music/musicplayer";
import CarlOSEmbed from "../util/carlosEmbed";
import Command from "../util/command";

class CommandPause implements Command {
    data = new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Mettre en pause la musique actuelle");

    run(interaction: CommandInteraction) {
        if (MusicPlayer.isPlaying(interaction.guild)) {
            MusicPlayer.pause(interaction.guild);
            const embed = CarlOSEmbed.infoEmbed()
                .setTitle(":pause: Pause")
                .setDescription("Musique mise en pause.")
            interaction.reply({embeds:[embed]});
        } else {
            const embed = CarlOSEmbed.errorEmbed("Aucune musique n'est en cours.")
            interaction.reply({embeds:[embed]});
        }
    }
}

export default new CommandPause();