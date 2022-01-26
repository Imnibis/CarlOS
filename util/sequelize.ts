import * as settings from "../settings.json"
import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize(settings.database, settings.user, settings.password, {
    host: settings.host,
    dialect: "mariadb",
    logging: false,
    define: {
        timestamps: false,
        underscored: true,
    },
    models: [__dirname + '/../models'], // Importation des models
});

export { Sequelize, sequelize };