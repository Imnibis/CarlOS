import { Guild, User } from "discord.js";

class MusicPlayer
{
    static isUserInVoice(user: User, guild: Guild) : boolean
    {
        const voiceStates = guild.voiceStates.cache
        voiceStates.forEach(voiceState => {
            if (voiceState.member.id === user.id && voiceState.channel)
                return true;
        });
        return false;
    }
}

export default MusicPlayer;