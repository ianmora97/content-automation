var json_config;
function loadUserConfig(){
    $.ajax({
        type: "GET",
        url: 'public/js/config.json',
        contentType: "application/json",
    }).then((response) => {
        json_config = response;
    }, (error) => {
    
    });
}
loadUserConfig()

function bringJiraTicket(){
    $.ajax({
        type: "GET",
        url: 'https://virtuelle-welt.atlassian.net/browse/CONT-29232',
        contentType: "application/json",
        headers: {
            "Authorization": "Basic " + btoa(json_config.c_email + ":" + json_config.c_token)
        },
    }).then((response) => {
        doSuggestions(response.split("<title>")[1].split("</title>")[0]);
    }, (error) => {
    
    });
}

function selectMacos() {
    db.all("SELECT * FROM maco", [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            
        });
    });
}
function addEntry() {
    db.run(
        "INSERT INTO maco(region,name_,code) VALUES('Central','Algo',1233)",
        (err) => {
            if (err) {
                return console.log(err.message);
            }
            console.log("Row inserted");
        }
    );
}