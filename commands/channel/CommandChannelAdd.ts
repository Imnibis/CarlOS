import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types";
import { CategoryChannel, Client, CommandInteraction, GuildChannel, GuildMember, MessageEmbed } from "discord.js";
import Bot from "../../bot";
import Vote from "../../democracy/Vote";
import ArgType from "../../util/argtype";
import { Subcommand } from "../../util/subcommand";

class CommandChannelAdd implements Subcommand
{
    data = new SlashCommandSubcommandBuilder()
        .setName("add")
        .setDescription("Créer un channel")
        .addStringOption(option => (
            option.setName("nom")
                .setDescription("Nom du channel")
                .setRequired(true)
        ))
        .addChannelOption(option => (
            option.setName("catégorie")
                .setDescription("Catégorie où placer le channel")
                .setRequired(true)
        ))

    run(interaction: CommandInteraction)
    {
        const name = interaction.options.getString("nom");
        const category = interaction.options.getChannel("catégorie", true);
        const guild = interaction.guild;
        if (category.type !== "GUILD_CATEGORY") {
            const embed = new MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Erreur")
                .setDescription("Ce channel n'est pas une catégorie.")
                .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
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

export default new CommandChannelAdd();