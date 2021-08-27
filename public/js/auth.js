
var json_config;
function loadUserConfig(){
    $.ajax({
        type: "GET",
        url: '../public/js/config.json',
        contentType: "application/json",
    }).then((response) => {
        json_config = response;
    }, (error) => {
    
    });
}
loadUserConfig()

function test_bringJiraTicket() {
    var testing;
    var user = "ian.mora@hangarww.com";
    var pass = "QOzrpflG9WkgPzXuuZzw6575";
    var tok = user + ":" + pass;
    // var mytoken = Base64.encode(tok);

    $.ajax({
        type: "GET",
        url: 'https://virtuelle-welt.atlassian.net/browse/CONT-29232',
        contentType: "application/json",
        headers: {
            "Authorization": "Basic " + btoa(tok)
        },
    }).then((response) => {
        testing = response;
        titulo = testing.split("<title>")[1].split("</title>")[0];
        console.log(titulo)
    }, (error) => {
    
    });
}

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
