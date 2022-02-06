var CryptoJS = require("crypto-js");
var moment = require('moment');
const path = require("path");
const fs = require("fs");
require('dotenv').config();

var filePath = path.join(__dirname, '../../logs/events.log');

const nacodes = require("../models/nacodes.model");

// TODO: Get NACodes from End-point
exports.getNACodes = (req, res) => {
    nacodes.getNACodes((err, codes) => {
        if(err){
            logEvent(`[ERROR] ${err}`);
            res.status(500).json({
                success: false,
                message: err
            });
        }else{
            res.status(200).json({
                success: true,
                message: "Get nacodes success",
                data: codes
            });
        }
    });
}
// TODO: GET info and start from end-point
exports.getInfo = (req, res) => {
    const nacode = req.body.nacode;
    nacodes.getInfo(nacode, (err, data) => {
        if(err){
            logEvent(`[ERROR] ${err}`);
            res.status(500).json({
                success: false,
                message: err
            });
        }else{
            res.status(200).json({
                success: true,
                message: "Get info success",
                data: data
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