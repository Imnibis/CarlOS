import { ModalSubmitInteraction } from "discord.js";

class ModalSubmitEvent {
    static _listeners: Array<(interaction: ModalSubmitInteraction) => void> = [];

    static onSubmit(customId: string, callback: (interaction: ModalSubmitInteraction) => void) {
        ModalSubmitEvent._listeners.push(callback);
    }

    static fire(interaction: ModalSubmitInteraction) {
        ModalSubmitEvent._listeners.forEach(listener => listener(interaction));
    }
}

export default ModalSubmitEvent;