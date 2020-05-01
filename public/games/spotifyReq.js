// DOCUMENTATION: https://developer.spotify.com/documentation/web-playback-sdk/reference/

var player;

const LOCALSTORAGE_ACCESS_TOKEN_KEY = 'spotify-audio-analysis-playback-token';
const LOCALSTORAGE_ACCESS_TOKEN_EXPIRY_KEY = 'spotify-audio-analysis-playback-token-expires-in';
const accessToken = localStorage.getItem(LOCALSTORAGE_ACCESS_TOKEN_KEY);
if(!accessToken || parseInt(localStorage.getItem(LOCALSTORAGE_ACCESS_TOKEN_EXPIRY_KEY)) < Date.now()) {
  window.location = '/';
}

let deviceId = '';

function playSong(id) {
    let query = 'https://api.spotify.com/v1/me/player/play/tracks?id=' + id;
    return fetch(query).then(e => e.json()).then(data => {
        fetch(`https://api.spotify.com/v1/me/player/play${deviceId && `?device_id=${deviceId}`}`, {
            method: "PUT",
            body: JSON.stringify({"uris": [`spotify:track:${id}`]}),
            headers: {
            'Authorization': `Bearer ${accessToken}`
            }
        }).catch(e => console.error(e));
    });
}

function pauseSong() {
    player.pause().then(() => {
        console.log('Paused!');
    });
}

function resumeSong() {
    player.resume().then(() => {
        console.log('Resumed!');
      });
}

function seekSong(seconds) {
  player.seek(seconds * 1000 )
}

// volume must be between 0.1 and 1
function setVolume(vol) {
  player.setVolume(vol)
}

var APIready = false;

function onSpotifyPlayerAPIReady() {
  APIready = true;
  
  player = new Spotify.Player({
    name: 'Int Elligence; Player',
    getOauthToken: function (callback) { callback(accessToken); },
    volume: 0.6
  });

  // Ready
  player.on('ready', function (data) {
    deviceId = data.device_id;
    setTimeout(() => {
      fetch('https://api.spotify.com/v1/me/player', {
        method: "PUT",
        body: JSON.stringify({
          device_ids:[
            data.device_id
          ],
          play: false
        }),
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }).catch(e => console.error(e));
    }, 100);
  });
  // Connect to the player!
  player.connect();
}
