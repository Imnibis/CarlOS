import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { ApplicationCommandPermissionData, Client, GuildApplicationCommandPermissionData, PermissionResolvable } from "discord.js";
import Command from "./command";
import * as fs from "fs";
import { ContextMenuCommandBuilder, SlashCommandBuilder } from "@discordjs/builders";

class CommandManager
{
    static client: Client;
    static commands: Command[] = [];

    static init(client: Client)
    {
        this.client = client;
        this.putCommands();
    }

    static putCommands() : void
    {
        if (this.client === undefined) {
            throw new Error("A client needs to be assigned before you can register a command.");
        }
        let commands = [];
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts'));

        for (const file of commandFiles) {
            const command: Command = require(`../commands/${file}`).default;

            if (command.subcommands !== undefined &&
                command.subcommands !== null) {
                command.subcommands.forEach(subcommand => {
                    console.log(`Registering command /${command.data?.name} ${subcommand.data.name}`);
                    (command.data as SlashCommandBuilder).addSubcommand(subcommand.data);
                })
            } else console.log(`Registering ${
                command.data instanceof ContextMenuCommandBuilder ? "context menu " : "command /"
            }${command.data?.name}`);
            commands.push(command.data.toJSON());
            this.commands.push(command);
        }
        
        console.log("Sending commands to Discord...");
        const rest = new REST({version: '9'}).setToken(this.client.token);
        this.client.guilds.cache.forEach((guild) => {
            (async () => {
                try {
                    const appID = this.client.application.id;
                    const guildID = guild.id;
                    await rest.put(Routes.applicationGuildCommands(appID, guildID), {body: commands},);
                    const guildRoles = await guild.roles.fetch();
                    const getRoles = (commandName) => {
                        const permissions = this.commands.find(
                            (x) => x.data.name === commandName
                        ).permissions;
            
                        if (!permissions) return null;
                        return guildRoles.filter(
                            (x) => x.permissions.has(permissions as PermissionResolvable[]) && !x.managed
                        );
                    };
                    const guildCommands = await guild.commands.fetch();
                    const fullPermissions = guildCommands.reduce<GuildApplicationCommandPermissionData[]>((accumulator, x) => {
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
            if (!interaction.isCommand() && !interaction.isContextMenu())
                return;
            const commandName = interaction.commandName;
            
            this.commands.forEach(command => {
                if (command.data.name === commandName) {
                    const subcommandName = interaction.options.getSubcommand(false);
                    if (command.subcommands !== undefined &&
                        command.subcommands !== null &&
                        subcommandName !== null) {
                        command.subcommands.forEach(subcommand => {
                            if (subcommand.data.name === subcommandName)
                                subcommand.run(interaction);
                        })
                    } else command.run(interaction);
                }
            })
        });
    }
}

export default CommandManager