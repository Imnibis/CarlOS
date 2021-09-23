import { Client, CommandInteraction, CommandInteractionOptionResolver, Interaction } from "discord.js";
import ArgType from "../util/argtype";
import Command from "../util/command";

class CommandPing extends Command
{
    constructor() 
    {
        super("ping", "A simple ping command");
        this.addArgument("my_arg", "A test argument", ArgType.STRING, false);
        this.register();
    }

    run(client: Client, interaction: CommandInteraction)
    {
        super.run(client, interaction);
        let arg = interaction.options.getString("my_arg", false);
        if (arg !== null)
            interaction.reply(`Pong ! ${arg}`);
        else interaction.reply("Pong !");
    }
}

export default CommandPing;