import * as Discord from "discord.js";
import Bot from "../bot";
import Guild from "../models/guild.model";

type Action = {name: string, description: string, severity: number, exec: () => void}
type ReplyFunction = (options: string | Discord.InteractionReplyOptions | Discord.MessagePayload) => Promise<void>

export default class Vote
{
    static guildVotes: {[id: string]: {[id: string]: Vote}} = {};
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
            const hasVoteChannel = await dbGuild.getSetting<string>('voteChannel') !== null;
            let error = null;
            
            if (!isDemocratic) error = "Ce serveur n'est pas démocratique.";
            else if (!hasVoteChannel) error = "Aucun channel de vote n'a été défini";
            if (error) {
                const embed = new Discord.MessageEmbed()
                    .setColor("#ff0000")
                    .setTitle("Erreur")
                    .setDescription(error)
                    .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
                reply({embeds:[embed]});
                return resolve(false);
            }
            resolve(true);
        });
    }

    static async addAction(action: Action, member: Discord.GuildMember, reply: ReplyFunction): Promise<void>
    {
        const guild = member.guild;
        let standalone = false;

        if (!await this.checkGuild(guild, reply))
            return;
        if (!(guild.id in this.guildVotes))
            this.guildVotes[guild.id] = {};
        if (!(member.id in this.guildVotes[guild.id])) {
            standalone = true;
            this.guildVotes[guild.id][member.id] = new Vote(guild, "Vote");
        }
        const vote = this.guildVotes[guild.id][member.id]
        vote.actions.push(action);
        const embed = new Discord.MessageEmbed()
            .setColor("#00bfff")
            .setTitle("Succès")
            .setDescription(`Action "${action.description}" ajoutée au vote "${vote.name}"`)
            .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
        
        if (standalone) await vote.sendMessage();
        else reply({embeds: [embed], ephemeral: true});
    }

    static create(member: Discord.GuildMember, name: string, description?: string): boolean
    {
        const guild = member.guild;
        if (!(guild.id in this.guildVotes))
            this.guildVotes[guild.id] = {};
        if (!(member.id in this.guildVotes[guild.id])) {
            this.guildVotes[guild.id][member.id] = new Vote(guild, name, description);
            return true;
        } else return false;
    }

    static async begin(member: Discord.GuildMember): Promise<boolean>
    {
        const guild = member.guild;
        if (!(guild.id in this.guildVotes))
            this.guildVotes[guild.id] = {};
        if (!(member.id in this.guildVotes[guild.id]))
            return false;
        else {
            await this.guildVotes[guild.id][member.id].sendMessage();
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
                    .setEmoji(':thumbsup:')
                    .setLabel('Pour')
                    .setStyle('SUCCESS'),
                new Discord.MessageButton()
                    .setCustomId('noVote')
                    .setEmoji(':thumbsdown:')
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