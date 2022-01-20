import { DataTypes, Model } from "sequelize";
import { sequelize } from '../util/sequelize';

interface SettingAttributes {
    name: string,
    value: string,
}

type SettingCreationAttribute = Required<SettingAttributes>

interface SettingInstance extends Model<SettingAttributes, SettingCreationAttribute>, SettingAttributes {};

const Setting = sequelize.define<SettingInstance>('setting', {
    name: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    value: DataTypes.TEXT,
})

Setting.sync();

export default Setting;