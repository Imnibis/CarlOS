import * as settings from "../settings.json"
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(settings.database, settings.user, settings.password, {
    host: settings.host,
    dialect: "mariadb",
    logging: false,
    define: {
        timestamps: false,
        underscored: true,
    }
});

export { Sequelize, sequelize };