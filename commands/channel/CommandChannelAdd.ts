import { ChannelType } from "discord-api-types";
import { CategoryChannel, Client, CommandInteraction, GuildChannel, GuildMember, MessageEmbed } from "discord.js";
import Vote from "../../democracy/Vote";
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
        const name = interaction.options.getString("nom");
        const category = interaction.options.getChannel("catégorie", true);
        const guild = interaction.guild;
        if (category.type !== "GUILD_CATEGORY") {
            const embed = new MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Erreur")
                .setDescription("Ce channel n'est pas une catégorie.")
                .setFooter(client.user.username, client.user.avatarURL());
            interaction.reply({embeds:[embed], ephemeral: true});
        } else {
            Vote.addAction({
                name: 'Création de channel',
                description: `Créer le channel #${name} dans la catégorie ${category.name}`,
                severity: 5,
                exec: () => {
                    guild.channels.create(name, {parent: category as CategoryChannel})
                }
            }, interaction.member as GuildMember, interaction.reply.bind(interaction))
        }
    }
}

export default CommandChannelAdd;