import { CommandInteraction, Message, MessageEmbed, ReactionManager } from "discord.js";
import Bot from "../bot";

type ElementList = [{title: string, description: string}?];
type UpdateFunction = (from: number, nb: number) => ElementList;
type InterractFunction = (nb: number) => void;

const ARROW_EMOJIS = ["⬅️", "➡️"]
const NUMBER_EMOJIS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]

class ListMessage
{
    static listMessages: ListMessage[] = [];
    title: string;
    emptyText: string;
    perPage: number;
    maxPages: number;
    interactive: boolean;
    active: boolean;
    updateFn: UpdateFunction = () => [];
    interractFn: InterractFunction = () => {};
    messageId: string = "none";
    message: Message;
    pageNb: number = 0;

    constructor(title: string, emptyText: string, maxPages = 0, interactive: boolean = false, perPage: number = 10)
    {
        this.title = title;
        this.emptyText = emptyText;
        this.perPage = perPage;
        this.maxPages = 0;
        this.interactive = interactive;
        this.active = true;
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
        this.message?.edit({embeds:[this.getEmbed()]});
    }

    getEmbed() : MessageEmbed
    {
        const embed = new MessageEmbed()
            .setColor("#00bfff")
            .setTitle(this.title)
            .setFooter(Bot.client.user.username, Bot.client.user.avatarURL());
        let currentList = []
        this.pageNb++;
        while ((currentList.length === 0 || (this.maxPages !== 0 && this.pageNb >= this.maxPages))
            && this.pageNb !== 0) {
            this.pageNb--;
            currentList = this.updateFn(this.pageNb * this.perPage, this.perPage);
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

    delete() : void
    {
        this.message.delete();
        this.message = null;
    }

    send(interaction: CommandInteraction) : ListMessage
    {
        const embed = this.getEmbed();
        interaction.reply({embeds: [embed]});
        interaction.fetchReply().then(message => {
            this.messageId = message.id;
            this.message = message as Message;
            if (this.maxPages !== 1)
                ARROW_EMOJIS.forEach(emoji => this.message?.react(emoji));
            if (this.interactive)
                NUMBER_EMOJIS.forEach(emoji => this.message?.react(emoji));
            this.awaitReactions(interaction);
        });
        return this;
    }

    awaitReactions(interaction: CommandInteraction)
    {
        const collector = this.message.createReactionCollector({filter:
            (reaction, user) => {
                return (ARROW_EMOJIS.includes(reaction.emoji.name) ||
                    (this.interactive && NUMBER_EMOJIS.includes(reaction.emoji.name)))
                    && user.id === interaction.user.id;
            }, time: 900000});
        collector.on("collect", (reaction, user) => {
            if (ARROW_EMOJIS.includes(reaction.emoji.name)) {
                const toAdd = (reaction.emoji.name === ARROW_EMOJIS[0]) ? -1 : 1;
                this.pageNb += toAdd;
                if (this.pageNb < 0)
                    this.pageNb = 0;
                this.update();
            } else if (this.interactive && NUMBER_EMOJIS.includes(reaction.emoji.name)) {
                this.interractFn(this.pageNb * this.perPage + NUMBER_EMOJIS.indexOf(reaction.emoji.name));
                this.update();
            }
        })
        collector.on("end", () => {
            this.message.reactions.removeAll();
        });
    }
}

export type {ElementList};
export default ListMessage;