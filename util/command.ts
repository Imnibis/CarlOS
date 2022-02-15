import { ContextMenuCommandBuilder, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { CommandInteraction, ContextMenuCommandInteraction } from "discord.js";
import { Subcommand } from "./subcommand";

export default interface Command {
    data: SlashCommandBuilder |
        Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand"> |
        ContextMenuCommandBuilder,
    subcommands?: Subcommand[],
    permissions?: bigint,
    run?: (interaction: CommandInteraction | ContextMenuCommandInteraction) => void
};