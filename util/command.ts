import { ContextMenuCommandBuilder, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { CommandInteraction, ContextMenuInteraction } from "discord.js";
import { Subcommand } from "./subcommand";

export default interface Command {
    data: SlashCommandBuilder |
        Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand"> |
        ContextMenuCommandBuilder,
    subcommands?: Subcommand[],
    permissions?: string[],
    run?: (interaction: CommandInteraction | ContextMenuInteraction) => void
};