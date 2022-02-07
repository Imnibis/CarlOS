import * as Discord from "discord.js";
import Bot from "../bot";
import Guild from "../models/guild.model";

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
            const isDemocratic = await dbGuild.getSetting<boolean>('democracy');
            const hasVoteChannel = await dbGuild.getSetting<string>('voteChannel') !== null;
            let error = null;
            
            console.log(typeof(isDemocratic), isDemocratic);
            if (!isDemocratic) error = "Ce serveur n'est pas démocratique.";
            else if (!hasVoteChannel) error = "Aucun channel de vote n'a été défini";
            if (error) {
                const embed = new Discord.MessageEmbed()
                    .setColor("#ff0000")
                    .setTitle("Erreur")
                    .setDescription(error)
                    .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
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
        let embed = new Discord.MessageEmbed()
            .setColor("#00bfff")
            .setTitle("Succès")
            .setDescription(`Action "${action.description}" ajoutée au vote "${vote.name}"`)
            .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
        
        if (standalone) {
            await vote.sendMessage();
            embed = new Discord.MessageEmbed()
                .setColor("#00bfff")
                .setTitle("Vote commencé !")
                .setDescription("Le vote a commencé dans le channel de vote !")
                .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
        }
        reply({embeds: [embed], ephemeral: true});
    }

    static create(member: Discord.GuildMember, name: string, description?: string): Vote
    {
        const memberVotes = this.getMemberVotes(member);
        if (!memberVotes.current)
            return (memberVotes.current = new Vote(member.guild, name, description));
        else
            return null;
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

    getEmbed(): Discord.MessageEmbed
    {
        const embed = new Discord.MessageEmbed()
            .setTitle(this.name)
            .setColor("#00bfff")
            .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());

        if (this.description)
            embed.setDescription(this.description);
        this.actions.forEach(action => {
            embed.addField(action.name, action.description);
        })
        embed.addField("Votes pour", this.yesVoters.length.toString(), true);
        embed.addField("Votes contre", this.noVoters.length.toString(), true);
        return embed;
    }

    getButtons(): Discord.MessageActionRow
    {
        const row = new Discord.MessageActionRow()
            .addComponents([
                new Discord.MessageButton()
                    .setCustomId('yesVote')
                    .setEmoji('👍')
                    .setLabel('Pour')
                    .setStyle('SUCCESS'),
                new Discord.MessageButton()
                    .setCustomId('noVote')
                    .setEmoji('👎')
                    .setLabel('Contre')
                    .setStyle('DANGER')
            ]);

        return row;
    }

    async sendMessage(): Promise<void>
    {
        const dbGuild = await Guild.findByPk(this.guild.id);
        const voteChannelId = await dbGuild.getSetting<string>('voteChannel');
        const voteChannel = await this.guild.channels.fetch(voteChannelId) as Discord.TextChannel;
        
        const message = await voteChannel.send({embeds: [this.getEmbed()], components: [this.getButtons()]});
    }
}