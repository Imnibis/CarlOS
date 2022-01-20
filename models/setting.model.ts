import { Column, Index, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table
class Setting extends Model {
    @PrimaryKey
    @Column
    name: string

    @Column
    value: string
}

export default Setting;