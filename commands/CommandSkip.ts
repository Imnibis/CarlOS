import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import Bot from "../bot";
import MusicPlayer from "../music/musicplayer";
import Command from "../util/command";

class CommandSkip implements Command
{
    data = new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip la musique actuelle");

    run(interaction: CommandInteraction)
    {
        MusicPlayer.playNext(interaction.guild);
        const embed = new MessageEmbed()
            .setColor("#00bfff")
            .setTitle(":fast_forward: Skip !")
            .setDescription("Musique skippée !")
            .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
        interaction.reply({embeds:[embed]});
    }
}

export default new CommandSkip();