import { ContextMenuCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandType } from "discord-api-types/v9";
import { ContextMenuInteraction, GuildMember, MessageEmbed } from "discord.js";
import Bot from "../bot";
import Vote from "../democracy/Vote";
import Command from "../util/command";

class ContextMenuBan implements Command
{
    data = new ContextMenuCommandBuilder()
        .setName("Ban")
        .setType(ApplicationCommandType.User as number)
    
    async run(interaction: ContextMenuInteraction) {
        const member = await interaction.guild.members.fetch(interaction.targetId)
        const guild = interaction.guild;
        if (!member.bannable) {
            const embed = new MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Erreur")
                .setDescription("Impossible de bannir cet utilisateur.")
                .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
            interaction.reply({embeds:[embed], ephemeral: true});
        } else {
            Vote.addAction({
                name: 'Bannissement de membre',
                description: `Bannir ${member.user.username}#${member.user.discriminator}`,
                severity: 5,
                exec: () => {
                    member.ban();
                }
            }, interaction.member as GuildMember, interaction.reply.bind(interaction))
        }
    }
}

export default new ContextMenuBan();