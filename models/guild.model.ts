import { BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import GuildSetting from "./guild_setting.model";

@Table
class Guild extends Model {
    @PrimaryKey
    @Column
    id: string

    @Column
    name: string

    @HasMany(() => GuildSetting)
    settings: GuildSetting[]

    setSetting<T>(name: string, value: T) : Promise<GuildSetting>
    {
        let promise: Promise<GuildSetting>;
        this.$get('settings').then((settings: GuildSetting[]) => {
            let setting = settings.find(x => x.name === name);

            if (setting)
                promise = setting.update({value: value})
            else
                promise = this.$create('setting', {name: name, value: value})
        });
        return promise;
    }

    async getSetting(name: string) : Promise<string>
    {
        const settings = await this.$get('settings')
        let setting = settings.find(x => x.name === name);

        return setting?.value;
    }

    async getSettingNumber(name: string) : Promise<number>
    {
        const setting = this.getSetting(name);

        return Number(setting);
    }

    async getSettingBool(name: string) : Promise<boolean>
    {
        const setting = this.getSetting(name);

        return Boolean(setting);
    }
}

export default Guild;