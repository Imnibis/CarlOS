import { Client, CommandInteraction, Guild, GuildMember, MessageEmbed } from "discord.js";

class MusicPlayer
{
    static checkVoiceChannel(client: Client, interaction: CommandInteraction) : boolean
    {
        let member = interaction.member as GuildMember;
        if (!this.isUserInVoice(member, interaction.guild)) {
            this.sendNotConnectedMessage(client, interaction);
            return false;
        } else if (interaction.guild.me.voice.channel &&
                !this.isUserInSameChanel(member, interaction.guild)) {
            this.sendSameChannelMessage(client, interaction);
            return false;
        }
        return true;
    }
    
    static sendNotConnectedMessage(client: Client, interaction: CommandInteraction)
    {
        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Erreur")
            .setDescription("Vous devez être connecté à un channel vocal sur ce serveur")
            .setFooter(client.user.username, client.user.avatarURL());
        interaction.reply({embeds:[embed]});
    }

    static sendSameChannelMessage(client: Client, interaction: CommandInteraction)
    {
        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Erreur")
            .setDescription("Vous devez être connecté au même channel que le bot.")
            .setFooter(client.user.username, client.user.avatarURL());
        interaction.reply({embeds:[embed]});
    }

    static isUserInVoice(user: GuildMember, guild: Guild) : boolean
    {
        return user.voice && user.voice.channel &&
            user.voice.channel.guildId === guild.id;
    }

    static isUserInSameChanel(user: GuildMember, guild: Guild) : boolean
    {
        return user.voice.channelId === guild.me.voice.channelId;
    }
}

export default MusicPlayer;