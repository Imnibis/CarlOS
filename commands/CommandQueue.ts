import { Client, CommandInteraction } from "discord.js";
import ArgType from "../util/argtype";
import Command from "../util/command";

class CommandQueue extends Command
{
    constructor() 
    {
        super("queue", "Afficher les musiques dans la file d'attente");
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

export default CommandQueue;