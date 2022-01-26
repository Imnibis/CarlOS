import Command from "../../util/command";
import CommandVoteBegin from "./CommandVoteBegin";
import CommandVoteCreate from "./CommandVoteCreate";

export default class CommandVote extends Command
{
    constructor()
    {
        super("vote", "Créer ou commencer un vote")
        this.addSubcommand(new CommandVoteCreate());
        this.addSubcommand(new CommandVoteBegin());
        this.register();
    }
}