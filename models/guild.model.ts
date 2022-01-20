import { BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table
class GuildSetting extends Model {
    @PrimaryKey
    @Column
    id: number

    @Column
    name: string

    @Column
    value: string

    @ForeignKey(() => Guild)
    @Column
    guild_id: string

    @BelongsTo(() => Guild)
    guild: Guild
}

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
export {Guild, GuildSetting};