class CommandManager
{
    static registerCommand(client, command)
    {
        client.guilds.cache.array().forEach((guild) => {
            client.api.applications(client.user.id).guilds(guild.id)
                .commands.post({
                    data: command
                });
        })
    }

    static handleInteractionEvent(client)
    {
        client.ws.on('INTERACTION_CREATE', async interaction => {
            const command = interaction.data.name.toLowerCase();
            const args = interaction.data.options;

            if (command === 'ping') {
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            content: "pong"
                        }
                    }
                })
            }
        })
    }
}

export default CommandManager