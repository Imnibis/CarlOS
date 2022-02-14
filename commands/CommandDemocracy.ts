import { SlashCommandBuilder } from "@discordjs/builders";
import Command from "../util/command";
import CommandDemocracyDisable from "./democracy/CommandDemocracyDisable";
import CommandDemocracyEnable from "./democracy/CommandDemocracyEnable";

class CommandDemocracy implements Command
{
    data = new SlashCommandBuilder()
        .setName("democracy")
        .setDescription("Activer ou désactiver la démocratie dans ce serveur")
        .setDefaultPermission(false)
    permissions = ["ADMINISTRATOR"]
    subcommands = [
        CommandDemocracyEnable,
        CommandDemocracyDisable
    ]
}

export default new CommandDemocracy()