import { Message } from "discord.js";
import { resourceLimits } from "worker_threads";

class FunReplies
{
    static replyDis(message: Message) : void
    {
        let splitString = message.content.split("di");
        splitString.shift();
        if (splitString.length == 0)
            return;
        const trimmed = splitString[0].trim();
        let word = trimmed.split(" ")[0];
        if (word.length <= 1 || !word.match(/.*[a-zA-Z].*/))
            return;
        message.reply(word);
    }

    static replyFeur(message: Message) : void
    {
        const sentence = this.trimNonAlpha(message.content).toLowerCase();

        if (sentence.endsWith("quoi") || sentence.endsWith("quois"))
            message.reply("feur");
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