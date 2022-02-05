const db = require('../../db/con');

// Constructor
const Config = function(config){
    this.config = config;
}
Config.getConfig = (result) =>{
    db.serialize(function() {
        db.each('SELECT * FROM config', function(err, row) {
            if(err){
                console.log(err);
                result(null, err);
            }else{
                result(null, row);
            }
        });
    });
}
Config.getConfigPaths = (result) =>{
    db.serialize(function() {
        db.each('SELECT * FROM cosyConfig', function(err, row) {
            if(err){
                console.log(err);
                result(null, err);
            }else{
                result(null, row);
            }
        });
    });
}
Config.setConfigJira = (config, result) =>{
    db.serialize(function() {
        db.run('UPDATE config set c_email = ?, c_token = ? WHERE id = 1', 
        [config.c_email, config.c_token],
        function(err) {
            if(err){
                console.log(err);
                result(null, err);
            }else{
                result(null, "success");
            }
        });
    });
}

module.exports = Config;