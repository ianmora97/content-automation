const db = require('../../db/con');
const request = require('request');

// Constructor
const NaCodes = function(nacodes){
    this.nacodes = nacodes;
}
NaCodes.getNACodes = (result) =>{
    request(`${process.env.UBYO_PATH}/v1/static/BM/modellist?loadtype=full`, function (error, response, body) {
        if(error){
            console.log(error);
            result(null, error);
        }else{
            result(null, JSON.parse(body));
        }
    });
}

module.exports = NaCodes;