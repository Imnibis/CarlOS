import { SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

interface Subcommand {
    data: SlashCommandSubcommandBuilder,
    permissions?: string[],
    run: (interaction: CommandInteraction) => void
};

interface SubcommandGroup {
    data: SlashCommandSubcommandGroupBuilder |
        Omit<SlashCommandSubcommandGroupBuilder, "addSubcommandGroup" | "addSubcommand">,
    permissions?: string[],
    run: (interaction: CommandInteraction) => void
};

export {Subcommand, SubcommandGroup}