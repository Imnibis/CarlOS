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
}

export default Guild;