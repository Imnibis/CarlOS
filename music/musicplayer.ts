import { AudioPlayer, AudioPlayerState, AudioPlayerStatus, createAudioResource, demuxProbe, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { Client, CommandInteraction, Guild, GuildMember, MessageEmbed, VoiceChannel } from "discord.js";
import Music from "./music";
import MusicQueue from "./musicqueue";

class MusicPlayer
{
    static players: [{"guild": Guild, "player": AudioPlayer}?] = []
    static channels: [{"guild": Guild, "channel": VoiceChannel}?] = []
    static connections: [VoiceConnection?] = []

    static checkVoiceChannel(client: Client, interaction: CommandInteraction) : boolean
    {
        let member = interaction.member as GuildMember;
        if (!this.isUserInVoice(member, interaction.guild)) {
            this.sendNotConnectedMessage(client, interaction);
            return false;
        } else if (interaction.guild.me.voice.channel && !this.isBotIdle(interaction.guild)
            && !this.isUserInSameChannel(member, interaction.guild)) {
            this.sendSameChannelMessage(client, interaction);
            return false;
        }
        this.setVoiceChannel(member.voice.channel as VoiceChannel);
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

    static sendNoChannelMessage(client: Client, interaction: CommandInteraction)
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

    static isBotIdle(guild: Guild)
    {
        let player = this.getAudioPlayer(guild);

        return player.state.status === AudioPlayerStatus.Idle;
    }

    static isUserInSameChannel(user: GuildMember, guild: Guild) : boolean
    {
        return user.voice.channelId === guild.me.voice.channelId;
    }

    static playNext(guild: Guild) : void
    {
        let music = MusicQueue.pop(guild);
        let voiceChannel = this.getVoiceChannel(guild);

        this.getAudioPlayer(guild).stop();
        if (!music) return;
        if (!music.video) {
            this.playNext(guild);
            return;
        }
        if (!voiceChannel) {
            console.log(`No channel bound for guild ${guild.name} !`);
            return;
        }
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator
        });
        let player = this.getAudioPlayer(guild);
        connection.subscribe(player);
        music.createAudioResource().then(resource => player.play(resource));
    }

    static getAudioPlayer(guild: Guild) : AudioPlayer
    {
        let player = null;
        this.players.forEach(entry => {
            if (entry.guild.id === guild.id)
                player = entry.player;
        });
        if (player !== null) return player;
        player = new AudioPlayer();
        player.on("stateChange", (oldState, newState) => {
            if (newState.status === AudioPlayerStatus.Idle &&
                oldState.status !== AudioPlayerStatus.Idle)
                this.playNext(guild);
        });
        this.players.push({"guild": guild, "player": player});
        return player;
    }

    static setVoiceChannel(channel: VoiceChannel) : void
    {
        let foundChannel = false;
        this.channels.forEach(entry => {
            if (entry.guild.id === channel.guild.id) {
                entry.channel = channel;
                foundChannel = true;
            }
        });
        if (foundChannel) return;
        this.channels.push({"guild": channel.guild, "channel": channel});
    }

    static getVoiceChannel(guild: Guild) : VoiceChannel
    {
        let channel = null;
        this.channels.forEach(entry => {
            if (entry.guild.id === guild.id) {
                channel = entry.channel;
            }
        });
        return channel;
    }

    static destroyConnections()
    {
        this.connections.forEach(connection => {
            connection.destroy();
        })
    }
}

export default MusicPlayer;