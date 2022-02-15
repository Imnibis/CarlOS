import { ContextMenuCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandType } from "discord-api-types/v9";
import { ContextMenuCommandInteraction, GuildMember, UserContextMenuCommandInteraction } from "discord.js";
import Bot from "../bot";
import Vote from "../democracy/Vote";
import CarlOSEmbed from "../util/carlosEmbed";
import Command from "../util/command";

class ContextMenuBan implements Command
{
    data = new ContextMenuCommandBuilder()
        .setName("Ban")
        .setType(ApplicationCommandType.User as number)
    
    async run(interaction: UserContextMenuCommandInteraction) {
        const member = interaction.targetMember as GuildMember
        const guild = interaction.guild;
        if (!member.bannable) {
            const embed = CarlOSEmbed.errorEmbed("Impossible de bannir cet utilisateur.")
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