import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import Bot from "../bot";
import MusicPlayer from "../music/musicplayer";
import Command from "../util/command";

class CommandPause implements Command {
    data = new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Mettre en pause la musique actuelle");

    run(interaction: CommandInteraction) {
        if (MusicPlayer.isPlaying(interaction.guild)) {
            MusicPlayer.pause(interaction.guild);
            const embed = new MessageEmbed()
                .setColor("#00bfff")
                .setTitle(":pause: Pause")
                .setDescription("Musique mise en pause.")
                .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
            interaction.reply({embeds:[embed]});
        } else {
            const embed = new MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Erreur")
                .setDescription("Aucune musique n'est en cours.")
                .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
            interaction.reply({embeds:[embed]});
        }
    }
}

export default new CommandPause();