/* Getting latest Fills from Gdax if there is any for each account API[Start] */
this.getLatestFillsFromGdax = function () {
       
    //


    var authedClient = new Gdax.AuthenticatedClient(
        gdaxKey, gdaxSecret, gdaxPhrase, apiURI);

    authedClient.getFills({
        limit: '100'
    }, function (error, response, data) {
        if (!error && response.statusCode === 200) {
            data.forEach(function (value) {
                value.userKey = gdaxKey;
            });
            gdaxFillsDAL.saveLatestFills(data, function (result) {
                if (!result.success) {
                    console.log('Saving fils Error')
                } else {
                    console.log('Saving Fills Success')
                }

            })

        }
    });
}
/* Getting latest from Gdax API[End] */