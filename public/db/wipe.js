var myArgs = process.argv.slice(2);
var sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database('./public/db/database.db', (err) => {
    if (err) {
        if(err.message.includes("SQLITE_CANTOPEN")){
            console.log("DB not found");
        }
        return;
    }else{
        console.log('Connected to SQlite database.');
        checkOptions(myArgs);
    }
});

function checkOptions(params) {
    if(params.length == 0){
        console.log("No parameters given");
        return;
    }
    if(params[0] == "all"){
        console.log("Wiping all data");
        wipeAll();
    }else if(params[0] == "tickets"){
        //wipeTickets();
    }else{
        console.log("Invalid parameter");
        return;
    }
}
async function wipeAll(){
    dropTables().then(()=>{
        createTables().then(()=>{
            console.log('\nTask executed succesfully')
        })
    })
    
}
async function dropTables(){
    db.serialize(()=>{
        db.run("DROP TABLE ticket_d", (err) => {
            if(err){
                console.log("Error dropping tickets");
                return;
            }
            console.log("Tickets with a deploy related wiped");
        })
        .run("DROP TABLE ticket_l", (err) => {
            if(err){
                console.log("Error dropping tickets");
                return;
            }
            console.log("Tickets n-r dropped");
        })
        .run("DROP TABLE deployment", (err) => {
            if(err){
                console.log("Error dropping deployments");
                return;
            }
            console.log("Deployments dropped");
        });
    });
    console.log("Tables dropped")
}
async function createTables(){
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
                console.log("Error creating deployments");
                return;
            }
            console.log("Deployments created");
        })
        .run(ticket_d_sql, (err) => {
            if(err){
                console.log("Error creating tickets");
                return;
            }
            console.log("Tickets created");
        })
        .run(ticket_l_sql, (err) => {
            if(err){
                console.log("Error creating tickets");
                return;
            }
            console.log("Tickets created");
        })
        console.log('TABLES CREATED');
    });
}
