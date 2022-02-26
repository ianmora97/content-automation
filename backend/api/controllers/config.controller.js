var CryptoJS = require("crypto-js");
var moment = require('moment');
const path = require("path");
const fs = require("fs");
require('dotenv').config();

var filePath = path.join(__dirname, '../../logs/events.log');

const config = require("../models/config.model");

// TODO: Get config from DB
exports.getConfig = (req, res) => {
    config.getConfig((err, config) => {
        if(err){
            logEvent(`[ERROR] ${err}`);
            res.status(500).json({
                success: false,
                message: err
            });
        }else{
            res.status(200).json({
                success: true,
                message: "Get config success",
                data: {
                    c_email: decrypt(config.c_email, process.env.APP_KEY),
                    c_token: decrypt(config.c_token, process.env.APP_KEY),
                    fav_view: config.fav_view,
                    p_year: parseInt(config.p_year),
                }
            });
        }
    });
}
// TODO: Get config paths from DB
exports.getConfigPaths = (req, res) => {
    config.getConfigPaths((err, config) => {
        if(err){
            logEvent(`[ERROR] ${err}`);
            res.status(500).json({
                success: false,
                message: err
            });
        }else{
            res.status(200).json({
                success: true,
                message: "Get config success",
                data: {
                    domain: decrypt(config.domain, process.env.APP_KEY),
                    start: decrypt(config.ubyo_start, process.env.APP_KEY),
                    options: decrypt(config.ubyo_options, process.env.APP_KEY),
                    modelList: decrypt(config.ubyo_modelList, process.env.APP_KEY),
                    specs: decrypt(config.ubyo_specs, process.env.APP_KEY)
                }
            });
        }
    });
}
// TODO: set Jira config
exports.setConfigJira = (req, res) => {
    let m = {
        c_email: encrypt(req.body.email, process.env.APP_KEY),
        c_token: encrypt(req.body.token, process.env.APP_KEY)
    }
    config.setConfigJira(m, (err, config) => {
        if(err){
            logEvent(`[ERROR] ${err}`);
            res.status(500).json({
                success: false,
                message: err
            });
        }else{
            logEvent(`[INFO] Jira Config updated - EMAIL & TOKEN`);
            res.status(200).json({
                success: true,
                message: "Email and Token have been updated",
                data: config
            });
        }
    });
}

// TODO: log events to file
function logEvent(message){fs.appendFile(filePath, `${moment().format('YYYY-MM-DD HH:mm:ss')} - ${message}\n${'---------'.repeat(12)}\n`, (err) => {
    if(err){
        console.log(err);
    }
})}

// TODO: encrypt and decrypt data
function encrypt(string, masterkey) {return CryptoJS.AES.encrypt(string, masterkey).toString()}
function decrypt(string, masterkey) {return CryptoJS.AES.decrypt(string, masterkey).toString(CryptoJS.enc.Utf8);}