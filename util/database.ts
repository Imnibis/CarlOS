import { createPool } from "mysql"
import Pool from "mysql/lib/Pool"

class Database
{
    db: Pool

    constructor(host: string, user: string, password: string, database: string)
    {
        this.db = createPool({
            host: host,
            user: user,
            password: password,
            database: database
        });
        this.db.query("CREATE TABLE IF NOT EXISTS `ranks` ( `id` int(11) NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `defaultRank` tinyint(1) NOT NULL DEFAULT '0', PRIMARY KEY (`id`) ) ENGINE=InnoDB DEFAULT CHARSET=latin1;");
		this.db.query("CREATE TABLE IF NOT EXISTS `settings` ( `id` int(11) NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `value` text NOT NULL, PRIMARY KEY (`id`) ) ENGINE=InnoDB DEFAULT CHARSET=latin1;");
		this.db.query("CREATE TABLE IF NOT EXISTS `users` ( `id` int(11) NOT NULL AUTO_INCREMENT, `uid` varchar(255) NOT NULL, `username` varchar(255) NOT NULL, `rank` int(11) NOT NULL, PRIMARY KEY (`id`) ) ENGINE=InnoDB DEFAULT CHARSET=latin1;");
    }

    getSetting(setting: string, defaultValue: string = null): Promise<string>
    {
        return new Promise((resolve, reject) => {
            this.db.query("SELECT * FROM settings WHERE name = ?", setting, (err, res, fields) => {
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

    setSetting(setting: string, value: string): void
    {
        this.db.query("SELECT * FROM settings WHERE name = ?", setting, (err, res, fields) => {
			if(err) throw err;
			if(res.length == 0) {
				this.db.query("INSERT INTO settings (`name`, `value`) VALUES (?, ?)", [setting, value], err => {
					if(err) throw err;
				});
			} else {
				this.db.query("UPDATE settings SET value = ? WHERE name = ?", [value, setting], err => {
					if(err) throw err;
				});
			}
		});
    }
}

export default Database;