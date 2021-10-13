import { AudioPlayer, AudioPlayerState, AudioPlayerStatus, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { Client, CommandInteraction, Guild, GuildMember, MessageEmbed, VoiceChannel } from "discord.js";
import ytdl = require("ytdl-core-discord");
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
        console.log(voiceChannel);

        if (!music) return;
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
        (async () => {
            player.play(await ytdl(music.video.id));
        })();
    }

    static getAudioPlayer(guild: Guild) : AudioPlayer
    {
        this.players.forEach(entry => {
            if (entry.guild.id === guild.id)
                return entry.player;
        });
        let player = new AudioPlayer();
        player.on(AudioPlayerStatus.Idle, () => {
            this.playNext(guild);
        });
        this.players.push({"guild": guild, "player": player});
        return player;
    }

    static setVoiceChannel(channel: VoiceChannel) : void
    {
        this.channels.forEach(entry => {
            if (entry.guild.id === channel.guild.id) {
                entry.channel = channel;
                return;
            }
        });
        this.channels.push({"guild": channel.guild, "channel": channel});
    }

    static getVoiceChannel(guild: Guild) : VoiceChannel
    {
        this.channels.forEach(entry => {
            console.log(`${entry.guild.name}: ${entry.channel.name}`);
            console.log(`${entry.guild.id} === ${guild.id}`);
            if (entry.guild.id === guild.id) {
                console.log(`Returned ${entry.channel}`);
                return entry.channel;
            }
        });
        return null;
    }

    static destroyConnections()
    {
        this.connections.forEach(connection => {
            connection.destroy();
        })
    }
}

export default MusicPlayer;