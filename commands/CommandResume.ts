import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Bot from "../bot";
import MusicPlayer from "../music/musicplayer";
import CarlOSEmbed from "../util/carlosEmbed";
import Command from "../util/command";

class CommandResume implements Command
{
    data = new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Reprendre la musique actuelle");
    
    run(interaction: CommandInteraction)
    {
        if (MusicPlayer.isPaused(interaction.guild)) {
            MusicPlayer.resume(interaction.guild);
            const embed = CarlOSEmbed.infoEmbed()
                .setTitle(":arrow_forward: Play")
                .setDescription("Musique reprise.")
            interaction.reply({embeds:[embed]});
        } else {
            const embed = CarlOSEmbed.errorEmbed("Aucune musique n'est en pause.")
            interaction.reply({embeds:[embed]});
        }
    }
}

export default new CommandResume();