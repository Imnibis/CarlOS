import { SlashCommandBuilder } from "@discordjs/builders";
import Command from "../util/command";
import CommandChannelAdd from "./channel/CommandChannelAdd";

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