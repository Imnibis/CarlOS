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

    getSetting<T>(name: string) : Promise<T>
    {
        return new Promise((resolve, reject) => {
            this.$get('settings').then((settings: GuildSetting[]) => {
                let setting = settings.find(x => x.name === name);
    
                if (setting)
                    resolve(setting.value as unknown as T);
                else
                    resolve(null)
            });
        });
    }
}

export default Guild;