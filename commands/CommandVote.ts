import { SlashCommandBuilder } from "@discordjs/builders";
import Command from "../util/command";
import CommandVoteBegin from "./vote/CommandVoteBegin";
import CommandVoteCreate from "./vote/CommandVoteCreate";
import CommandVoteDiscard from "./vote/CommandVoteDiscard";

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