import { createPool } from "mysql"
import Pool from "mysql/lib/Pool"

class Database
{
    static instance: Pool

    static init(host: string, user: string, password: string, database: string)
    {
        Database.instance = createPool({
            host: host,
            user: user,
            password: password,
            database: database
        });
        Database.instance.query("CREATE TABLE IF NOT EXISTS `ranks` ( `id` int(11) NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `defaultRank` tinyint(1) NOT NULL DEFAULT '0', PRIMARY KEY (`id`) ) ENGINE=InnoDB DEFAULT CHARSET=latin1;");
		Database.instance.query("CREATE TABLE IF NOT EXISTS `settings` ( `id` int(11) NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `value` text NOT NULL, PRIMARY KEY (`id`) ) ENGINE=InnoDB DEFAULT CHARSET=latin1;");
		Database.instance.query("CREATE TABLE IF NOT EXISTS `users` ( `id` int(11) NOT NULL AUTO_INCREMENT, `uid` varchar(255) NOT NULL, `username` varchar(255) NOT NULL, `rank` int(11) NOT NULL, PRIMARY KEY (`id`) ) ENGINE=InnoDB DEFAULT CHARSET=latin1;");
        Database.instance = this;
    }

    static getSetting(setting: string, defaultValue: string = null): Promise<string>
    {
        return new Promise((resolve, reject) => {
            Database.instance.query("SELECT * FROM settings WHERE name = ?", setting, (err, res, fields) => {
                if(err) throw err;
                if(res.length == 0) {
                    if(defaultValue != undefined) {
                        this.setSetting(setting, defaultValue);
                        resolve(defaultValue);
                    }
                    resolve(null);
                } else {
                    resolve(res[0]["value"]);
                }
            });
        });
    }

    static setSetting(setting: string, value: string): void
    {
        Database.instance.query("SELECT * FROM settings WHERE name = ?", setting, (err, res, fields) => {
			if(err) throw err;
			if(res.length == 0) {
				Database.instance.query("INSERT INTO settings (`name`, `value`) VALUES (?, ?)", [setting, value], err => {
					if(err) throw err;
				});
			} else {
				Database.instance.query("UPDATE settings SET value = ? WHERE name = ?", [value, setting], err => {
					if(err) throw err;
				});
			}
		});
    }
}

export default Database;