var crypto = require('crypto')
var moment = require('moment')

this.generate_key = () => {
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    return crypto.createHash('sha1').update(current_date + random).digest('hex');

};