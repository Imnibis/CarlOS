import { ButtonBuilder } from "@discordjs/builders";
import * as Discord from "discord.js";
import Bot from "../bot";
import Guild from "../models/guild.model";
import CarlOSEmbed from "../util/carlosEmbed";

type Action = {name: string, description: string, severity: number, exec: () => void}
type ReplyFunction = (options: string | Discord.InteractionReplyOptions | Discord.MessagePayload) => Promise<void>
type MemberVotes = {current: Vote, began: Vote[]};

export default class Vote
{
    static guildVotes: {[id: string]: {[id: string]: MemberVotes}} = {};
    guild: Discord.Guild
    name: string
    description: string
    actions: Action[] = []
    yesVoters: Discord.GuildMember[] = []
    noVoters: Discord.GuildMember[] = []

    static async checkGuild(
        guild: Discord.Guild,
        reply: ReplyFunction
    ): Promise<boolean>
    {
        return new Promise(async (resolve, reject) => {
            const dbGuild = await Guild.findByPk(guild.id);
            const isDemocratic = await dbGuild.getSettingBool('democracy');
            const hasVoteChannel = await dbGuild.getSetting('voteChannel') !== null;
            let error = null;
            
            if (!isDemocratic) error = "Ce serveur n'est pas démocratique.";
            else if (!hasVoteChannel) error = "Aucun channel de vote n'a été défini";
            if (error) {
                const embed = CarlOSEmbed.errorEmbed(error)
                reply({embeds:[embed]});
                resolve(false);
            } else resolve(true);
        });
    }

    static async addAction(action: Action, member: Discord.GuildMember, reply: ReplyFunction): Promise<void>
    {
        const guild = member.guild;
        let standalone = false;

        if (!await this.checkGuild(guild, reply))
            return;
        standalone = !!this.create(member, "Vote");
        const vote = this.guildVotes[guild.id][member.id].current
        vote.actions.push(action);
        let embed = CarlOSEmbed.successEmbed(`Action "${action.description}" ajoutée au vote "${vote.name}"`)
        
        if (standalone) {
            await this.begin(member);
            embed = CarlOSEmbed.infoEmbed()
                .setTitle("Vote commencé !")
                .setDescription("Le vote a commencé dans le channel de vote !")
        }
        reply({embeds: [embed]});
    }

    static create(member: Discord.GuildMember, name: string, description?: string): Vote
    {
        const memberVotes = this.getMemberVotes(member);
        if (!memberVotes.current)
            return (memberVotes.current = new Vote(member.guild, name, description));
        else
            return null;
    }

    static discard(member: Discord.GuildMember): boolean
    {
        const memberVotes = this.getMemberVotes(member);
        if (!memberVotes.current) return false;
        else {
            memberVotes.current = null;
        }
    }

    static getMemberVotes(member: Discord.GuildMember): MemberVotes
    {
        const guild = member.guild;
        if (!(guild.id in this.guildVotes))
            this.guildVotes[guild.id] = {};
        if (!(member.id in this.guildVotes[guild.id])) {
            this.guildVotes[guild.id][member.id] = {current: null, began: []};
        }
        return this.guildVotes[guild.id][member.id];
    }

    static async begin(member: Discord.GuildMember): Promise<boolean>
    {
        const memberVotes = this.getMemberVotes(member);
        if (!memberVotes.current)
            return false;
        else {
            await memberVotes.current.sendMessage();
            memberVotes.began.push(memberVotes.current)
            memberVotes.current = null;
            return true;
        }
    }

    constructor(guild: Discord.Guild, name: string, description?: string)
    {
        this.guild = guild;
        this.name = name;
        this.description = description ? description : null;
    }

    getEmbed(): CarlOSEmbed
    {
        const embed = CarlOSEmbed.infoEmbed()
            .setTitle(this.name)

        if (this.description)
            embed.setDescription(this.description);
        this.actions.forEach(action => {
            embed.addFields({name: action.name, value: action.description});
        })
        embed.addFields({name: "Votes pour", value: this.yesVoters.length.toString(), inline: true});
        embed.addFields({name: "Votes contre", value: this.noVoters.length.toString(), inline: true});
        return embed;
    }

    getButtons(): Discord.ActionRowBuilder<Discord.ButtonBuilder>
    {
        const row = new Discord.ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('yesVote')
                    .setEmoji({name: ':thumbsup:'})
                    .setLabel('Pour')
                    .setStyle(Discord.ButtonStyle.Success),
                new Discord.ButtonBuilder()
                    .setCustomId('noVote')
                    .setEmoji({name: ':thumbsdown:'})
                    .setLabel('Contre')
                    .setStyle(Discord.ButtonStyle.Danger)
            );

        return row;
    }

    async sendMessage(): Promise<void>
    {
        const dbGuild = await Guild.findByPk(this.guild.id);
        const voteChannelId = await dbGuild.getSetting('voteChannel');
        const voteChannel = await this.guild.channels.fetch(voteChannelId) as Discord.TextChannel;
        
        const message = await voteChannel.send({embeds: [this.getEmbed()], components: [this.getButtons()]});
        const collector = await message.createMessageComponentCollector({componentType: Discord.ComponentType.Button});
        collector.on('collect', (interaction: Discord.ButtonInteraction) => {
            if (interaction.customId === 'yesVote') {
                const noVoteIndex = this.noVoters.findIndex(member => member.user.id === interaction.user.id)
                if (noVoteIndex !== -1)
                    this.noVoters.splice(noVoteIndex, 1);
                const yesVoteIndex = this.yesVoters.findIndex(member => member.user.id === interaction.user.id)
                if (yesVoteIndex !== -1)
                    this.yesVoters.splice(yesVoteIndex, 1);
                else this.yesVoters.push(interaction.member as Discord.GuildMember);
            } else {
                const yesVoteIndex = this.yesVoters.findIndex(member => member.user.id === interaction.user.id)
                if (yesVoteIndex !== -1)
                    this.yesVoters.splice(yesVoteIndex, 1);
                const noVoteIndex = this.noVoters.findIndex(member => member.user.id === interaction.user.id)
                if (noVoteIndex !== -1)
                    this.noVoters.splice(noVoteIndex, 1);
                else this.noVoters.push(interaction.member as Discord.GuildMember);
            }
            interaction.update({embeds: [this.getEmbed().data], components: [this.getButtons()]})
        })
    }
}