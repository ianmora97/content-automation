var myArgs = process.argv.slice(2);
const chalk = require('chalk');
var sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database('./public/db/database.db', (err) => {
    if (err) {
        if(err.message.includes("SQLITE_CANTOPEN")){
            console.log("DB not found");
        }
        return;
    }else{
        console.log('Connected to SQlite database\n');
        checkOptions(myArgs);
    }
});

function checkOptions(params) {
    if(params.length != 0){
        switch (params[0]) {
            case "all":
                wipeAll();
                break;
            case "tickets":
                //wipeTickets();
                break;
            default:
                console.log(chalk.red('[ERR]'),"Invalid parameter");
                break;
        }
    }else{
        console.log(chalk.red('[ERR]'),"No options specified");
    }
    return;
}
var intervals = new Array();
function wipeAll(){
    dropTables().then(()=>{
        console.log(chalk.green('[OK]'),"TABLES DROPPED\n")
        createTables().then(()=>{
            intervals.forEach(interval => {
                clearInterval(interval);
            });
            console.log(chalk.green('[OK]'),'TABLES CREATED\n');
            console.log(chalk.green('\nTask executed succesfully'))
            return;
        })
    })
}
async function dropTables(){
    return new Promise((resolve, reject)=>{
        console.log(chalk.bold.underline("Dropping tables..."));
        var tables = 0;
        db.serialize(()=>{
            db.run("DROP TABLE ticket_d", (err) => {
                if(err){
                    console.log(chalk.red('[ERR]'),"Error dropping ticket_d");
                    reject(err);
                    return;
                }
                tables++;
                console.log(chalk.bgMagenta.bold('-'),"ticket_d dropped");
            })
            .run("DROP TABLE ticket_l", (err) => {
                if(err){
                    console.log(chalk.red('[ERR]'),"Error dropping ticket_l");
                    reject(err);
                    return;
                }
                tables++;
                console.log(chalk.bgMagenta.bold('-'),"ticket_l dropped");
            })
            .run("DROP TABLE deployment", (err) => {
                if(err){
                    console.log(chalk.red('[ERR]'),"Error dropping deployment");
                    reject(err);
                    return;
                }
                tables++;
                console.log(chalk.bgMagenta.bold('-'),"deployment dropped");
            });
            intervals.push(setInterval(() => {
                if(tables == 3){
                    resolve();
                }
            }, 500));
        });
    })
}
async function createTables(){
    return new Promise((resolve, reject)=>{
        console.log(chalk.bold.underline("Creating tables..."));
        var tables = 0;
        db.serialize(()=>{
            var deployment_sql = `CREATE TABLE deployment (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name text NOT NULL,
                model text
            )`;
            var ticket_d_sql = `CREATE TABLE ticket_d (
                id INTEGER,
                deploy INTEGER NOT NULL,
                code text NOT NULL UNIQUE,
                priority TEXT,
                release text,
                FOREIGN KEY("deploy") REFERENCES "deployment"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                PRIMARY KEY("id" AUTOINCREMENT)
            )`;
            var ticket_l_sql = `CREATE TABLE ticket_l (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code text NOT NULL UNIQUE,
                priority text NOT NULL,
                release text NOT NULL
            )`;
            db.run(deployment_sql, (err) => {
                if(err){
                    console.log(chalk.red('[ERR]'),"Error creating deployment");
                    reject(err);
                    return;
                }
                tables++;
                console.log(chalk.bgMagenta.bold('+'),"deployment created");
            })
            .run(ticket_d_sql, (err) => {
                if(err){
                    console.log(chalk.red('[ERR]'),"Error creating ticket_d");
                    reject(err);
                    return;
                }
                tables++;
                console.log(chalk.bgMagenta.bold('+'),"ticket_d created");
            })
            .run(ticket_l_sql, (err) => {
                if(err){
                    console.log(chalk.red('[ERR]'),"Error creating ticket_l");
                    reject(err);
                    return;
                }
                tables++;
                console.log(chalk.bgMagenta.bold('+'),"ticket_l created");
            })
            intervals.push(setInterval(() => {
                if(tables == 3){
                    resolve();
                }
            }, 500));
        });
    })
}
