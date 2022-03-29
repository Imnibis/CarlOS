import { ActionRowBuilder, ContextMenuCommandBuilder, TextInputBuilder } from "@discordjs/builders";
import { ApplicationCommandType } from "discord-api-types/v10";
import { ModalBuilder, GuildMember, UserContextMenuCommandInteraction, ModalSubmitInteraction } from "discord.js";
import Vote from "../democracy/Vote";
import CarlOSEmbed from "../util/carlosEmbed";
import Command from "../util/command";
import ModalSubmitEvent from "../util/modalSubmitEvent";

class ContextMenuBan implements Command
{
    data = new ContextMenuCommandBuilder()
        .setName("Ban")
        .setType(ApplicationCommandType.User as number)
    
    async run(interaction: UserContextMenuCommandInteraction) {
        const member = interaction.targetMember as GuildMember
        const guild = interaction.guild;
        const modal = new ModalBuilder()
            .setTitle("Ban")
            .setCustomId("ban_modal")
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setLabel("Raison du ban")
                            .setCustomId("ban_reason")
                    )
            )
        if (!member.bannable) {
            const embed = CarlOSEmbed.errorEmbed("Impossible de bannir cet utilisateur.")
            interaction.reply({embeds:[embed], ephemeral: true});
        } else {
            await interaction.showModal(modal);
            ModalSubmitEvent.onSubmit("ban_modal", async (interaction: ModalSubmitInteraction) => {
                const reason = interaction.fields.getTextInputValue("ban_reason");
                Vote.addAction({
                    name: 'Bannissement de membre',
                    description: `Bannir ${member.user.username}#${member.user.discriminator} pour la raison: ${reason}`,
                    severity: 5,
                    exec: () => {
                        member.ban({reason: reason});
                    },
                }, interaction.member as GuildMember, interaction.reply.bind(interaction));
            });
            
        }
    }
}

export default new ContextMenuBan();