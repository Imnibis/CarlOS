import { Guild, GuildMember } from "discord.js";

class MusicPlayer
{
    static isUserInVoice(user: GuildMember, guild: Guild) : boolean
    {
        return user.voice && user.voice.channel &&
            user.voice.channel.guildId === guild.id;
    }
}

export default MusicPlayer;