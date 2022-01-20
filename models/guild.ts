import { Association, DataTypes, HasManyAddAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, Model } from "sequelize";
import { sequelize } from '../util/sequelize';

interface GuildSettingAttributes {
    id: number,
    name: string,
    value: string,
}

type GuildSettingCreationAttribute = Required<GuildSettingAttributes>

class GuildSetting extends Model<GuildSettingAttributes, GuildSettingCreationAttribute> implements GuildSettingAttributes {
    declare id: number;
    declare name: string;
    declare value: string;
};



interface GuildAttributes {
    id: string,
    name: string,
}

type GuildCreationAttribute = Required<GuildAttributes>

class Guild extends Model<GuildAttributes, GuildCreationAttribute> implements GuildAttributes {
    declare id: string;
    declare name: string;

    declare getSettings: HasManyGetAssociationsMixin<GuildSetting>;
    declare addSetting: HasManyAddAssociationMixin<GuildSetting, number>;
    declare hasSetting: HasManyHasAssociationMixin<GuildSetting, number>;
    declare countSettings: HasManyCountAssociationsMixin;
    declare createSetting: HasManyCreateAssociationMixin<GuildSetting>;

    declare readonly settings?: GuildSetting[];

    declare static associations: {
        settings: Association<Guild, GuildSetting>;
    }
};

GuildSetting.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING,
        value: DataTypes.TEXT,
    },
    {
        sequelize,
        tableName: 'guild_settings',
    }
);

Guild.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        name: DataTypes.STRING,
    },
    {
        sequelize,
        tableName: 'guilds',
    }
);

Guild.hasMany(GuildSetting, {
    as: 'settings',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

Guild.sync();
GuildSetting.sync();

export default Guild;
export {Guild, GuildSetting};