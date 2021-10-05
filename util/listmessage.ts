import { CommandInteraction, Message, MessageEmbed, ReactionManager } from "discord.js";
import Bot from "../bot";

type ElementList = [{title: string, description: string}?];
type UpdateFunction = (from: number, nb: number) => ElementList;
type InterractFunction = (nb: number) => void;

const ARROW_EMOJIS = ["arrow_left", "arrow_right"]
const NUMBER_EMOJIS = ["one", "two", "three", "four", "five", "six", "seven",
    "eight", "nine", "keycap_ten"]

class ListMessage
{
    static listMessages: ListMessage[] = [];
    title: string;
    perPage: number;
    interactive: boolean;
    updateFn: UpdateFunction = () => [];
    interractFn: InterractFunction = () => {};
    messageId: string = "none";
    pageNb: number = 0;

    constructor(title: string, interactive: boolean = false, perPage: number = 10)
    {
        this.title;
        this.perPage = perPage;
        this.interactive = interactive;
        ListMessage.listMessages.push(this);
    }

    setUpdateFunction(fn: UpdateFunction) : ListMessage
    {
        this.updateFn = fn;
        return this;
    }

    setInterractFunction(fn: InterractFunction) : ListMessage
    {
        this.interractFn = fn;
        return this;
    }

    getEmbed() : MessageEmbed
    {
        const embed = new MessageEmbed()
            .setColor("#00bfff")
            .setTitle(this.title)
            .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
        let currentList = this.updateFn(this.pageNb * this.perPage, this.perPage);
        let i = 1;
        currentList.forEach(elem => {
            embed.addField(`${i}. ${elem.title}`, elem.description, false);
            i++;
        });
        return embed;
    }

    send(interaction: CommandInteraction) : ListMessage
    {
        const embed = this.getEmbed();
        interaction.reply({embeds: [embed]});
        interaction.fetchReply().then(message => {
            this.messageId = message.id;
            ARROW_EMOJIS.forEach(emoji => (message as Message).react);
            if (this.interactive)
                NUMBER_EMOJIS.forEach(emoji => (message as Message).react);
        });
        return this;
    }

    
}

export default ListMessage