/* Error handling for validating mandatory fields[Start] */
this.validateMandatory = (fields, callBack) => {
    var validated = true;

    fields.forEach(function (value) {
        if (!value) {
            validated = false;
        }
    });
    callBack(validated)
};
/* Error handling for validating mandatory fields[End] */

/* Error handler to check Existing[Start] */
this.validateIfExists = (dbInstance, value, key, callback) => {
    var query = {};
    query[key] = value;

    dbInstance.collection.findOne(query, function (err, data) {
        if (err) {
           return callback(err,null,null)
        }

        if(data){
            return callback(null,true,data);
        }
     
        return callback(null,false,null);
    })
};
/* Error handler to check Existing[End] */

