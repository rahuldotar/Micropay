const redis = require('ioredis');
let config = require('../config/config');
var stringUtils = require('./string_operations');

/* Handler to add session[Start] */
this.addSession = (id, callBack = () => {}) => {

    let token = stringUtils.generate_key();
    let client = new redis({
        port: config.redisPort,
        host: config.redisUrl
    });
    client.set(token, id, (error, data) => {
        if (error) {
            console.log("set error redis", error)
            callBack(false);
        } else {
            client.expire(token, config.sessionTimeout, (setExpError, setExpData) => {
                client.disconnect();
                if (setExpError) {
                    console.log("session error", setExpError)
                    callBack(false)
                } else {
                    callBack(token);
                }

            });

        }
    })
}
/* Handler to add session[End] */

/* Handler to validate session[Start] */
this.validateSession = (req, res, next) => {
     if(unAuthedRoutes.indexOf(req.originalUrl) !== -1){
         return next();
     }

    var client = new redis({
        port: config.redisPort,
        host: config.redisUrl
    });

    var token = req.body.token;
    
   client.get(token, (error, data) => {
        if (error) {
            res.send({
                success: false,
                error: error
            })
        } else {
            console.log(data, 'token data')
            if (data !== null) {

                client.expire(token, config.sessionTimeout, (setExpError, setExpData) => {
                    client.disconnect();
                    if (setExpError) {
                        res.send({
                            success: false,
                            error: error
                        })
                    } else {
                        req.body.sessionValue = data;
                        next();
                    }

                });
            } else {
                if (req.method === 'GET') {
                    res.send(`
                            <html>
                            <body style="text-align: center">
                            <h>Session Expired Please Login</h>
                            </body>
                            </html>
                                  `);
                    return;
                }
                res.status(401).json({
                    success: false,
                    error: 'Invalid sessiom'
                });
            }

        }
    })
};
/* Handler to validate session[END] */

// routes do not need session
var unAuthedRoutes = [
    '/api/gdaxUserSignUp',
    '/api/gdaxFills',
    '/api/getGdaxAccounts',
    '/api/getGdaxTransfers',
    '/api/gdaxUserLogin'
]