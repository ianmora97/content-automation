async function createDatabases() {
    db.serialize(()=>{
        var dbs = `
        CREATE TABLE maco (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            region text NOT NULL,
            name_ text NOT NULL,
            code INTEGER NOT NULL
        )
        `
        db.run(dbs);
    })
}