var map;
//var socket = io();
//var data = new AWS.

// socket.on("connected", function() {
//     console.log("Connected to the server socket");
// });

// socket.on("disconnected", function() {
//     console.log("Disconnected from the server");
// });

// var location;
var markers = []

var globalVal;
function initMap() {
    var location = { lat: 27.854624, lng: 27.210935 };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 2,
        center: location
    });
    // var location1 = { lat: 1.599408, lng: -58.921877 };
    // var location2 = { lat: 27.854624, lng: 77.484373 };
    // addPositiveMarker(location1);
    // addNegativeMarker(location2);
    // addNeutralMarker(location);

};

function addPositiveMarker(data) {
    var lng = data.latitude;
    var lat = data.longitude;

    // console.log("lat : ", lat);
    // console.log("long: ", lng);
    var location1 = {lat, lng};
    var msg = data.text;

    var positiveMarker = new google.maps.Marker({
        position: location1,
        map: map,
        title: msg,
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    });
    markers.push(positiveMarker);
};

function addNegativeMarker(data) {
    var lng = data.latitude;
    var lat = data.longitude;
    var location2 = {lat, lng};
    var msg = data.text;
    var negativeMarker = new google.maps.Marker({
        position: location2,
        map: map,
        title: msg,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });
    markers.push(negativeMarker)
};

function addNeutralMarker(data) {
    var lng = data.latitude;
    var lat = data.longitude;
    var location3 = {lat, lng};
    var msg = data.text;

    var neutralMarker = new google.maps.Marker({
        position: location3,
        map: map,
        title: msg,
        icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
    });
    markers.push(neutralMarker);
};

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}


function decideSentiment(data){
    console.log("I am ar decide sentiment")
    if (data.score < 0.5){
        //console.log("Negative", data.score);
        console.log("I am in negative")
        addNegativeMarker(data);
    }     
    else if (data.score > 0.5){
        //console.log("Positive", data.score);
        console.log("I am in positive")
        addPositiveMarker(data);
    }
    else if (data.score == 0.5){
        //console.log("Neutral", data.score);
        console.log("I am in neutral")
        addNeutralMarker(data);
    }
        
}

function loopOverTweetData(data, tweets_count){
    for (i=0; i<tweets_count; i++){
        //console.log("I and data_i",i," , ",data[i])
        //console.log(data[i]);
        decideSentiment(data[i]._source);
    }
    console.log("Number of markers:", markers.length);
}

function loadDataFromES(value) {
    console.log("Value",value)
    query = {
        "size":50,
        "query": {
            "match": {
                "topic": value
            }
        }
    }
    $.ajax({
        url: '',
        method:"POST",
        data:JSON.stringify(query),
        dataType: 'text',
        success: function (data) {
            data = JSON.parse(data)
            console.log("data", data)
            tweets_count = data.hits.total;
            loopOverTweetData(data.hits.hits, tweets_count);
        }
    }).done(function (data) {
        //console.log(data["hits"]["hits"])
        }).fail(function (data) {
            console.log("In failure", data)
        });
        deleteMarkers()

}

setInterval(callThis, (10000));
function callThis(){
    setInterval(loadDataFromES(globalVal),10000);
    httpGetAsync("API_FOR_CONSUMPTION");
}

function deleteMarkers(){
    for(var i=0; i < markers.length; i++)
    {
        markers[i].setMap(null);
    }
    markers = [];
}

function selectItem(value) {
    if (value == null || value == "") {
        alert("Select some item to begin with");
    }
    else {
        alert("Thanks! Tweets for " + value.toUpperCase() + " will appear in a while :)");
        globalVal=value;
        deleteMarkers()
        httpGetAsync("API_FOR_STREAM"+value);
        console.log(value.toUpperCase())
    }
};

