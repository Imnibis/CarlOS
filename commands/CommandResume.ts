import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import Bot from "../bot";
import MusicPlayer from "../music/musicplayer";
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
            const embed = new MessageEmbed()
                .setColor("#00bfff")
                .setTitle(":arrow_forward: Play")
                .setDescription("Musique reprise.")
                .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
            interaction.reply({embeds:[embed]});
        } else {
            const embed = new MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Erreur")
                .setDescription("Aucune musique n'est en pause.")
                .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
            interaction.reply({embeds:[embed]});
        }
    }
}

export default new CommandResume();