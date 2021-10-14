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
    emptyText: string;
    perPage: number;
    interactive: boolean;
    updateFn: UpdateFunction = () => [];
    interractFn: InterractFunction = () => {};
    messageId: string = "none";
    message: Message;
    pageNb: number = 0;

    constructor(title: string, emptyText: string, interactive: boolean = false, perPage: number = 10)
    {
        this.title = title;
        this.emptyText = emptyText;
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

    update()
    {
        this.message.edit({embeds:[this.getEmbed()]});
    }

    getEmbed() : MessageEmbed
    {
        const embed = new MessageEmbed()
            .setColor("#00bfff")
            .setTitle(this.title)
            .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
        let currentList = []
        this.pageNb++;
        while (currentList.length === 0 && this.pageNb !== 0) {
            this.pageNb--;
            this.updateFn(this.pageNb * this.perPage, this.perPage);
        }
        if (currentList.length === 0)
            return embed.setDescription(this.emptyText);
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
            this.message = message as Message;
            ARROW_EMOJIS.forEach(emoji => this.message.react);
            if (this.interactive)
                NUMBER_EMOJIS.forEach(emoji => this.message.react);
                this.message.awaitReactions({filter: (reaction, user) => {
                return ARROW_EMOJIS.includes(reaction.emoji.name) ||
                    (this.interactive && NUMBER_EMOJIS.includes(reaction.emoji.name));
            }, time: 900000}).then(collected => {
                const reaction = collected.first();

                if (ARROW_EMOJIS.includes(reaction.emoji.name)) {
                    const toAdd = (reaction.emoji.name == ARROW_EMOJIS[0]) ? -1 : 1;
                    this.pageNb += toAdd;
                    if (this.pageNb < 0)
                        this.pageNb = 0;
                    this.update();
                } else if (this.interactive && NUMBER_EMOJIS.includes(reaction.emoji.name)) {
                    this.interractFn(NUMBER_EMOJIS.indexOf(reaction.emoji.name));
                    this.update();
                }
            })
        });
        return this;
    }

    
}

export type {ElementList};
export default ListMessage;