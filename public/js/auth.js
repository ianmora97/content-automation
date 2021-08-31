const fs = require('fs');
var jsonpath = 'public/js/config.json';

var json_config;
function loadUserConfig(){
    json_config = JSON.parse(fs.readFileSync(jsonpath).toString());
}
loadUserConfig()

function setConfigJsonJira(){
    let m = {
        c_email: $('#emailJira').val(),
        c_token: $('#jiraToken').val()
    }
    fs.writeFileSync(jsonpath, JSON.stringify(m));
    $('#validateButtonIcon').addClass('fa-spinner fa-pulse');
    setTimeout(() => {
        $('#validateButtonIcon').removeClass('fa-spinner fa-pulse').addClass('fa-check-circle');
        $('#validateButton').removeClass('btn-primary').addClass('btn-success');
        $('#validateButton').find('span').text('Saved')
        setTimeout(() => {
            $('#validateButton').removeClass('btn-success').addClass('btn-primary');
            $('#validateButton').find('span').text('Save')
            $('#validateButtonIcon').removeClass('fa-check-circle')
        }, 1000);
    }, 2000);
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