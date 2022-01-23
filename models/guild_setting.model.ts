import { AutoIncrement, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript"
import Guild from "./guild.model"

@Table
class GuildSetting extends Model {
    @PrimaryKey
    @AutoIncrement
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

export default GuildSetting