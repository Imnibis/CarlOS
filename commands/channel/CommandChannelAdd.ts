import { ChannelType } from "discord-api-types";
import { CategoryChannel, Client, CommandInteraction, GuildChannel, MessageEmbed } from "discord.js";
import ArgType from "../../util/argtype";
import Command from "../../util/command";

class CommandChannelAdd extends Command
{
    constructor() 
    {
        super("add", "Créer un channel", true);
        this.addArgument("nom", "Nom du channel", ArgType.STRING, true);
        this.addArgument("catégorie", "Catégorie où placer le channel", ArgType.CHANNEL, true);
    }

    run(client: Client, interaction: CommandInteraction)
    {
        super.run(client, interaction);
        const category = interaction.options.getChannel("catégorie", true);
        if (category.type !== "GUILD_CATEGORY") {
            const embed = new MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Erreur")
                .setDescription("Ce channel n'est pas une catégorie.")
                .setFooter(client.user.username, client.user.avatarURL());
            interaction.reply({embeds:[embed], ephemeral: true});
        } else {
            interaction.guild.channels.create(interaction.options.getString("nom"), {parent: category as CategoryChannel})
                .then(
                    res => {
                        const embed = new MessageEmbed()
                            .setColor("#00bfff")
                            .setTitle("Succès")
                            .setDescription("Channel créé")
                            .setFooter(client.user.username, client.user.avatarURL());
                        interaction.reply({embeds:[embed], ephemeral: true});
                    },
                    err => {
                        const embed = new MessageEmbed()
                            .setColor("#ff0000")
                            .setTitle("Erreur")
                            .setDescription("Le channel n'a pas pu être créé.")
                            .setFooter(client.user.username, client.user.avatarURL());
                        interaction.reply({embeds:[embed], ephemeral: true});
                    }
                )
        }
    }
}

export default CommandChannelAdd;