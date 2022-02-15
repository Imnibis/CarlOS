import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Bot from "../bot";
import MusicPlayer from "../music/musicplayer";
import CarlOSEmbed from "../util/carlosEmbed";
import Command from "../util/command";

class CommandSkip implements Command
{
    data = new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip la musique actuelle");

    run(interaction: CommandInteraction)
    {
        MusicPlayer.playNext(interaction.guild);
        const embed = CarlOSEmbed.infoEmbed()
            .setTitle(":fast_forward: Skip !")
            .setDescription("Musique skippée !")
        interaction.reply({embeds:[embed]});
    }
}

export default new CommandSkip();