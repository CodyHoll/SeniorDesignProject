console.log("madeit")
// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest();

// Open a new connection, using the GET request on the URL endpoint
request.open('GET', 'https://api.spotify.com/v1/tracks/{57bgtoPSgt236HzfBOd8kj}', true);

request.onload = function() {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);

    if (request.status >= 200 && request.status < 400){
        data.forEach(album => {
            console.log("here");
            console.log(album.name);

        })
    }
}

// Send request
request.send();