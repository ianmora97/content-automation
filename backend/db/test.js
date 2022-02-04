var sqlite3 = require('sqlite3').verbose();
const chalk = require('chalk');
const path = require("path");

let _path = path.join(__dirname, './database.db');

let con = new sqlite3.Database(_path, (err) => {
    if (err) {
        if(err.message.includes("SQLITE_CANTOPEN")){
            console.log(chalk.red("[ERROR]"), "Database file not found.");
        }
        return;
    }else{
        console.log('[',chalk.green("✓"), "] Database connected.");
    }
});

module.exports = con;