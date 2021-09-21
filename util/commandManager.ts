import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types";
import { Client } from "discord.js";
import { pipeline } from "stream";
import CommandPing from "../commands/CommandPing";
import Command from "./command";

class CommandManager
{
    static commands: Command[] = []
    static client: Client;

    static init(client: Client)
    {
        this.client = client;

        const ping = new CommandPing();

        this.putCommands();
    }
    
    static registerCommand(command: Command) : void
    {
        this.commands.push(command);
    }

    static putCommands() : void
    {
        if (this.client === undefined) {
            throw new Error("A client needs to be assigned before you can register a command.");
        }
        console.log("Sending commands to Discord...");
        let apiCommands = [];
        this.commands.forEach(command => {
            apiCommands.push(command.apiObject);
        });
        const rest = new REST({version: '9'}).setToken(this.client.token);
        this.client.guilds.cache.forEach((guild) => {
            (async () => {
                try {
                    const appID = this.client.application.id;
                    const guildID = guild.id;
                    await rest.put(
                        Routes.applicationGuildCommands(appID, guildID),
                        {body: apiCommands}
                    );
                } catch (error) {
                    console.log(error);
                }
            })();
        })
    }

    static handleInteractionEvent() : void
    {
        this.client.on("interactionCreate", interaction => {
            if (!interaction.isCommand())
                return;
            const commandName = interaction.command.name.toLowerCase();
            
            this.commands.forEach(command => {
                if (command.apiObject.name === commandName)
                    command.run(this.client, interaction);
            })
        });
    }
}

export default CommandManager