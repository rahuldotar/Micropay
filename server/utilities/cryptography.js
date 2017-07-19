var CryptoJS = require("crypto-js");
var config = require('../config/config.js')

this.encrypt = function(password)
{
    var ciphertext = CryptoJS.AES.encrypt(password, config.passKey);
    return ciphertext.toString() ;
};

this.decrypt = function(cipherText)
{
    var bytes  = CryptoJS.AES.decrypt(cipherText.toString(),key);
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
};
