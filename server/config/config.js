var micropayConfig = {
    dbConURL : 'mongodb://localhost:27017/Micropay',
    passKey:'AccubitsMicropay',
    gdaxApiUrl:'https://api.gdax.com',
    redisPort : 6379,
    redisUrl : '127.0.0.1',
    sessionTimeout : '18000'
    
};

module.exports = micropayConfig;