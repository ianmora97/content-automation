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

module.exports = Config;