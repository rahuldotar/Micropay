/*
 *  Copyright (C) Arun J - All Rights Reserved
 *  * Unauthorized copying of this file, via any medium is strictly prohibited
 *  * Proprietary and confidential
 *  * Written by Arun  <arunjayakumar07@gmail.com>, June 2016
 *  
 */

/**
 * Created by arun on 14/6/16.
 */

var Config = require('../../config');
var CryptoJS = require("crypto-js");

var key = Config.passkey;


this.encrypt = function(password)
{
    var ciphertext = CryptoJS.AES.encrypt(password, key);
    return ciphertext.toString() ;
};

this.decrypt = function(cipherText)
{
    var bytes  = CryptoJS.AES.decrypt(cipherText.toString(),key);
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
};
