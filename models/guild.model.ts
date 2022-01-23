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
            let democracySetting = settings.find(x => x.name === name);

            if (democracySetting)
                promise = democracySetting.update({value: value})
            else
                promise = this.$create('setting', {name: name, value: value})
        });
        return promise;
    }
}

export default Guild;