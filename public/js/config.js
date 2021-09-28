const fs = require('fs');
var jsonpath = './public/js/config.json';

var json_config;
function loadUserConfig(){
    json_config = JSON.parse(fs.readFileSync(jsonpath).toString());
    // mostrar los datos del json en los inputs
}
loadUserConfig()