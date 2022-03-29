import { EmbedBuilder, RGBTuple } from "@discordjs/builders";
import { ColorResolvable, Colors } from "discord.js";
import Bot from "../bot";

export default class CarlOSEmbed extends EmbedBuilder
{
    constructor(color: number | RGBTuple) {
        super()
        this.setColor(color)
            .setFooter({text: Bot.client.user.username, iconURL: Bot.client.user.avatarURL()});
    }

    static errorEmbed(error: string): CarlOSEmbed
    {
        return new CarlOSEmbed(Colors.Red)
            .setTitle("Erreur")
            .setDescription(error);
    }

    static infoEmbed(): CarlOSEmbed
    {
        return new CarlOSEmbed(Colors.Aqua)
    }

    static successEmbed(text: string): CarlOSEmbed
    {
        return new CarlOSEmbed(Colors.Green)
            .setTitle("Succès")
            .setDescription(text);
    }
}