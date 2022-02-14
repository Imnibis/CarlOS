import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import Command from "../util/command";
import CommandChannelAdd from "./CommandChannelAdd";

class CommandChannel implements Command
{   
    data = new SlashCommandBuilder()
        .setName("channel")
        .setDescription("Créer, supprimer ou modifier un channel")
    subcommands = [
        CommandChannelAdd
    ]
}

export default new CommandChannel();