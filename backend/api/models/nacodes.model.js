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
NaCodes.getInfo = (nacode,result) =>{
    console.log(nacode);
    request(`${process.env.UBYO_PATH}/v4/BM/options/${nacode}`, function (error1, response1, body1) {
        if(error1){
            console.log(error1);
            result(null, error1);
        }else{
            request(`${process.env.UBYO_PATH}/v1/configuration/start/${nacode}`, function (error, response, body) {
                if(error){
                    console.log(error);
                    result(null, error);
                }else{
                    result(null, {
                        options: JSON.parse(body1),
                        start: JSON.parse(body)
                    });
                }
            });
        }
    });
    
}
module.exports = NaCodes;