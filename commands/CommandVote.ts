import { SlashCommandBuilder } from "@discordjs/builders";
import Command from "../util/command";
import CommandVoteBegin from "./CommandVoteBegin";
import CommandVoteCreate from "./CommandVoteCreate";
import CommandVoteDiscard from "./CommandVoteDiscard";

class CommandVote implements Command
{
    data = new SlashCommandBuilder()
        .setName("vote")
        .setDescription("Créer ou commencer un vote")

    subcommands = [
        CommandVoteCreate,
        CommandVoteBegin,
        CommandVoteDiscard,
    ]
}

export default new CommandVote()