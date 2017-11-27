'use strict';
var twitter = require('twitter');
var client = new twitter({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token_key: process.env.access_token_key,
    access_token_secret: process.env.access_token_secret
});

exports.handler = (event, context) => {
    client.stream('statuses/filter', { track: request.queryString.name }, function (stream) {
        stream.on('data', function (tweet) {
            if (tweet.lang = "en") {
                console.log(JSON.stringify(tweet));
                if (tweet.place) {
                    if (tweet.place.bounding_box) {
                        console.log("Bounding box entered");
                        if (tweet.place.bounding_box) {
                            if (tweet.place.bounding_box.type === 'Polygon') {
                                var crd = tweet.place.bounding_box.coordinates[0][0];
                                var latlong = { "latitude": crd[0], "longitude": crd[1], "title": tweet.place.full_name };
                                console.log(latlong)
                            }
                        }
                    }
                }
            }
        });
    });
    context.done(null, "success");
};
