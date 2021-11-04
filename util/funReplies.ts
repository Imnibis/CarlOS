import { Message } from "discord.js";
import { resourceLimits } from "worker_threads";

class FunReplies
{
    static replyDis(message: Message) : void
    {
        let splitString = message.content.split(" ");
        if (splitString.length === 0)
            return;
        splitString.forEach(word => {
            const trimmed = this.getUntilNonAlpha(word);
            const random = Math.random() * 5;
            if (trimmed.startsWith('di') && trimmed.length > 4 && random < 1) {
                message.reply(trimmed);
            }
        });
    }

    static replyFeur(message: Message) : void
    {
        const sentence = this.trimNonAlpha(message.content).toLowerCase();
        const random = Math.random() * 5;

        if ((sentence.endsWith("quoi") || sentence.endsWith("quois")) &&
            random < 1)
            message.reply("feur");
    }

    static getUntilNonAlpha(str: string): string
    {
        let result = '';
        let alpha = "abcdefghijklmnopqrstuvwxyz"
        alpha += alpha.toUpperCase();

        for (let i = 0; i < str.length; i++) {
            if (!alpha.includes(str[i]))
                return result;
            result += str[i];
        }
        return result;
    }

    static trimNonAlpha(str: string): string
    {
        let result = str;
        let alpha = "abcdefghijklmnopqrstuvwxyz"
        alpha += alpha.toUpperCase();

        while (result.length !== 0 && !alpha.includes(result[result.length - 1]))
            result = result.substr(0, result.length - 1);
        while (result.length !== 0 && !alpha.includes(result[0]))
            result = result.length == 1 ? "" : result.substr(1, result.length - 1);
        return result;
    }
}

export default FunReplies;