const chalk = require('chalk');
const request = require('request');
const routesJSON = require('../api/routes.json');

function executeTest(){
    console.log(chalk.green("[OK]"), "Executing tests...");
    let host = `http://${routesJSON.host}:${routesJSON.port}`;
    routesJSON.routes.forEach(route => {
        request(`${host}${route.path}`, function (error, response, body) {
            if(response && response.statusCode == 200){
                console.log(`[${chalk.green("✓")}] ${chalk.blue(route.method)} ${route.path} | ${chalk.gray(route.description)}`);
            }else{
                console.log(`[${chalk.red("✗")}] ${chalk.blue(route.method)} ${route.path} | ${chalk.gray(error)}`);
            }
        });
    });
}

executeTest();