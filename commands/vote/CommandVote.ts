import Command from "../../util/command";
import CommandVoteBegin from "./CommandVoteBegin";
import CommandVoteCreate from "./CommandVoteCreate";
import CommandVoteDiscard from "./CommandVoteDiscard";

export default class CommandVote extends Command
{
    constructor()
    {
        super("vote", "Créer ou commencer un vote")
        this.addSubcommand(new CommandVoteCreate());
        this.addSubcommand(new CommandVoteBegin());
        this.addSubcommand(new CommandVoteDiscard());
        this.register();
    }
}