import { ApplicationCommandOption, Client, CommandInteraction, CommandInteractionOptionResolver, Interaction } from "discord.js";
import ArgType from "./argtype";
import CommandManager from "./commandManager";

class Command
{
    apiObject: {"name": string, "description": string, "options": {"type": number,
        "name": string, "description": string, "choices"?: {"name": string,
        "value": string}[], "required": boolean}[]}
    
    constructor(name: string, description: string)
    {
        console.log(`Registering ${name} command...`);
        this.apiObject.name = name;
        this.apiObject.description = description;
        this.apiObject.options = [];
    }

    addArgument(name: string, description: string, type: ArgType, required: boolean,
        choices?: {"name": string, "value": string}[])
    {
        if (choices === undefined)
            this.apiObject.options.push({"name": name, "description": description,
                "type": type, "required": required});
        else
            this.apiObject.options.push({"name": name, "description": description,
                "choices": choices, "type": type, "required": required});
    }

    run(client: Client, interaction: CommandInteraction)
    {
        const author = interaction.member.user;
        console.log(`${author.username}#${author.discriminator} used command ${interaction.command.name}`);
    }

    register()
    {
        CommandManager.registerCommand(this);
    }
}

export default Command;