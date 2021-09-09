var CryptoJS = require("crypto-js");
// Encrypt
function encrypt(string, masterkey) {
    var ciphertext = CryptoJS.AES.encrypt(string, masterkey).toString();
    return ciphertext;
}
// Decrypt
function decrypt(string, masterkey) {
    var bytes  = CryptoJS.AES.decrypt(string, masterkey);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}
