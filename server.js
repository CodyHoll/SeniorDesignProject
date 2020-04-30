// DOCUMENTATION: https://github.com/thelinmichael/spotify-web-api-node
// DOCUMENTATION: https://developer.spotify.com/documentation/web-playback-sdk/reference/ 

// server.js
// where your node app starts

var PORT = process.env.PORT || 8888;

// init project
require('dotenv').config();
var qs = require('querystring');
var express = require('express');
var app = express();

// init Spotify API wrapper

var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
  clientId : process.env.CLIENT_ID,
  clientSecret : process.env.CLIENT_SECRET,
});

const jssdkscopes = ["streaming", "user-read-email", "user-read-private", "user-modify-playback-state"];
const redirectUriParameters = {
  client_id: process.env.CLIENT_ID,
  response_type: 'token',
  scope: jssdkscopes.join(' '),
  // redirect_uri: encodeURI('https://spotify-web-integration.herokuapp.com/index.html'),
  redirect_uri: encodeURI('http://localhost:8888/index.html'),
  show_dialog: true,
}

const redirectUri = `https://accounts.spotify.com/authorize?${qs.stringify(redirectUriParameters)}`;

function authenticate(callback) {
  spotifyApi.clientCredentialsGrant()
    .then(function(data) {
      console.log('The access token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
    
      callback instanceof Function && callback();

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
    }, function(err) {
      console.log('Something went wrong when retrieving an access token', err.message);
    });
}
authenticate();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.get("/tracks", function(request, response){
  reAuthenticateOnFailure((failure) => {
    spotifyApi.getTrack(request.query.id)
    .then(function(data){
      response.send(data.body);
    }, failure);
  })
});

// album

const reAuthenticateOnFailure = (action) => {
  action(() => {
    authenticate(action);
  })
}

app.get("/spotifyRedirectUri", function (request, response) {
  response.send(JSON.stringify({
    redirectUri
  }, null, 2))
});

// listen for requests :)
var listener = app.listen(PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
