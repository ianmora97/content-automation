async function createDatabases() {
    db.serialize(()=>{
        var dbs = `
        CREATE TABLE region (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text NOT NULL
         )
        `
        db.run(dbs);
    })
}