import Command from "../../util/command";
import CommandDemocracyDisable from "./CommandDemocracyDisable";
import CommandDemocracyEnable from "./CommandDemocracyEnable";

export default class CommandDemocracy extends Command
{
    constructor()
    {
        super("democracy", "Activer ou désactiver la démocratie dans ce serveur")
        this.requirePermission("ADMINISTRATOR");
        this.addSubcommand(new CommandDemocracyEnable());
        this.addSubcommand(new CommandDemocracyDisable());
        this.register();
    }
}