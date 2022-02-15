import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CategoryChannel, GuildMember, ChatInputCommandInteraction, ChannelType } from "discord.js";
import Vote from "../../democracy/Vote";
import CarlOSEmbed from "../../util/carlosEmbed";
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

    run(interaction: ChatInputCommandInteraction)
    {
        const name = interaction.options.getString("nom");
        const category = interaction.options.getChannel("catégorie", true);
        const guild = interaction.guild;
        if (category.type !== ChannelType.GuildCategory) {
            const embed = CarlOSEmbed.errorEmbed("Ce channel n'est pas une catégorie.")
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