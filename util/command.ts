import { ApplicationCommandOption, Client, CommandInteraction, CommandInteractionOptionResolver, Interaction } from "discord.js";
import ArgType from "./argtype";
import CommandManager from "./commandManager";
import Database from "./database";

class Command
{
    apiObject: {"name": string, "description": string, "options": {"type": number,
        "name": string, "description": string, "choices"?: {"name": string,
        "value": string}[], "required"?: boolean}[]}
    subcommands: Command[] = [];
    
    constructor(name: string, description: string, subcommand: boolean = false)
    {
        console.log(`Registering ${name} ${subcommand ? 'sub' : ''}command...`);
        this.apiObject = {name: name, description: description, options: []};
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

    addSubcommand(subcommand: Command, type: ArgType = ArgType.SUBCOMMAND)
    {
        this.subcommands.push(subcommand);
        this.apiObject.options.push(Object.assign(subcommand.apiObject, {type: type}))
    }

    exec(client: Client, interaction: CommandInteraction)
    {
        const author = interaction.member.user;
        const subcommandName = interaction.options.getSubcommand(false);
        if (subcommandName !== null) {
            console.log(`${author.username}#${author.discriminator} used command ${interaction.commandName} ${subcommandName}`);
            const subcommand = this.subcommands.find(elem => elem.apiObject.name === subcommandName);
            subcommand.run(client, interaction);
        } else {
            console.log(`${author.username}#${author.discriminator} used command ${interaction.commandName}`);
            this.run(client, interaction);
        }
    }

    run(client: Client, interaction: CommandInteraction)
    {
    }

    register()
    {
        CommandManager.registerCommand(this);
    }
}

export default Command;