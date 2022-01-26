import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { ApplicationCommandPermissionData, Client, GuildApplicationCommandPermissionData } from "discord.js";
import { pipeline } from "stream";
import CommandChannel from "../commands/channel/CommandChannel";
import CommandPause from "../commands/CommandPause";
import CommandPing from "../commands/CommandPing";
import CommandPlay from "../commands/CommandPlay";
import CommandQueue from "../commands/CommandQueue";
import CommandRemove from "../commands/CommandRemove";
import CommandResume from "../commands/CommandResume";
import CommandSearch from "../commands/CommandSearch";
import CommandSkip from "../commands/CommandSkip";
import CommandDemocracy from "../commands/democracy/CommandDemocracy";
import CommandVote from "../commands/vote/CommandVote";
import Command from "./command";

class CommandManager
{
    static commands: Command[] = []
    static client: Client;

    static init(client: Client)
    {
        this.client = client;

        //const ping = new CommandPing();
        const play = new CommandPlay();
        const queue = new CommandQueue();
        const search = new CommandSearch();
        const skip = new CommandSkip();
        const remove = new CommandRemove();
        const pause = new CommandPause();
        const resume = new CommandResume();
        const democracy = new CommandDemocracy();
        const vote = new CommandVote();
        const channel = new CommandChannel();

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
            if (command.apiObject.userPermissions !== undefined &&
                command.apiObject.userPermissions !== null)
                command.apiObject.default_permission = false;
            console.log(command.apiObject);
            apiCommands.push(command.apiObject);
        });
        
        const rest = new REST({version: '9'}).setToken(this.client.token);
        this.client.guilds.cache.forEach((guild) => {
            (async () => {
                try {
                    const appID = this.client.application.id;
                    const guildID = guild.id;
                    await rest.put(Routes.applicationGuildCommands(appID, guildID), {body: apiCommands},);
                    const guildRoles = await guild.roles.fetch();
                    const getRoles = (commandName) => {
                        const permissions = apiCommands.find(
                            (x) => x.name === commandName
                        ).userPermissions;
            
                        if (!permissions) return null;
                        return guildRoles.filter(
                            (x) => x.permissions.has(permissions) && !x.managed
                        );
                    };
                    const commands = await guild.commands.fetch();
                    const fullPermissions = commands.reduce<GuildApplicationCommandPermissionData[]>((accumulator, x) => {
                        const roles = getRoles(x.name);
                        if (!roles) return accumulator;
                        const permissions = roles.reduce<ApplicationCommandPermissionData[]>((a, v) => {
                            return [
                                ...a,
                                {
                                    id: v.id,
                                    type: "ROLE",
                                    permission: true,
                                },
                            ]
                        }, []);

                        return [
                            ...accumulator,
                            {
                                id: x.id,
                                permissions,
                            },
                        ];
                    }, []);
                    guild.commands.permissions.set({fullPermissions});
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
            const commandName = interaction.commandName;
            
            this.commands.forEach(command => {
                if (command.apiObject.name === commandName)
                    command.exec(this.client, interaction);
            })
        });
    }
}

export default CommandManager