// ...........................settings..............................
var actionZ = 0; //on left click action
var rotationA = 3.1; // amount of rotation
var movementSpeed = 20; //9.5 if you start w/ spaceman is perfect
var zoomSpeed = 10;
var totalObjects = 40000;
//..................................................................

// Change song button
button = document.querySelector("button");

var rotated = false; 
var container = document.createElement('div');
document.body.appendChild( container );

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,1, 10000)
camera.position.z = 2000; 

var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2( 0x555555, 0.0003 );  
var geometry = new THREE.Geometry();

for (i = 0; i < totalObjects; i ++) 
{ 
  var vertex = new THREE.Vector3();
  vertex.x = Math.random()*40000-20000;
  vertex.y = Math.random()*7000-3500;
  vertex.z = Math.random()*7000-3500;
  geometry.vertices.push( vertex );
}

var material = new THREE.ParticleBasicMaterial( { size: 6 });
var particles = new THREE.ParticleSystem( geometry, material );
	  
scene.add( particles ); 

camera.position.x = -10000;


var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild( renderer.domElement );

renderer.render( scene, camera );

render();

// pick a random song from SpaceSongs object (songs.js)
function pickRandomSong() {
  const space = Object.values(SpaceSongs)
  const randomSong = space[parseInt(Math.random() * space.length)]
  return randomSong
}

// mix up order of an array (used for song list)
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

var cur = 0;
var bool;
bool = true; 
songOrder = shuffle(Object.values(SpaceSongs));

function songCall(){
  if(bool){
    playSong(songOrder[cur]);
    if(songOrder[cur] == SpaceSongs.SpaceOddity || songOrder[cur] == SpaceSongs.LordOfTheRings || songOrder[cur] == SpaceSongs.DarkKnightMain){
      setTimeout(function() { seekSong(30) }, 500); // skip to 30sec into song (spotifyReq.js)
    }

    if(cur < songOrder.length -1){ cur += 1; }
    else { cur = 0; }

    bool = false
  }
}

function render() {
  requestAnimationFrame( render );
  if (!rotated && camera.position.x < 11000)
  {
    if(camera.position.x > 10000){
      rotated = true;
      if (camera.rotation.y < rotationA){
        camera.rotation.y += .015;
        rotated = false;
      }
      while (camera.position.z > -2000){
        camera.position.z -= 19;
        rotated = false;

        // Song call
        songCall();
      }
      bool = true
    }
    else{
    camera.position.x += movementSpeed;
    camera.position.z += actionZ;
    }
  }
  else if(rotated && camera.position.x > -11000){
    if(camera.position.x < -10000){
      rotated = false;
      if (camera.rotation.y > 0){
        camera.rotation.y -= .015;
        rotated = true;
      }
      while (camera.position.z < 2000){
        camera.position.z += 19;
        rotated = true;
        
        // Song call
        songCall();
      }
      bool = true;
    }
    else{
    camera.position.x -= movementSpeed;
    camera.position.z -= actionZ;
    }
  }
  
  renderer.render( scene, camera );

}

window.addEventListener( 'mousedown', onDocumentMouseDown, false );
window.addEventListener( 'mouseup', onDocumentMouseUp, false );
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
  
}

// var i = 0;
function onDocumentMouseDown(){
  event.preventDefault();
  actionZ = -zoomSpeed;
}

function onDocumentMouseUp(){
   actionZ = 0;
}

// to change the song
button.addEventListener("click", () => {
  playSong(pickRandomSong());
});

setTimeout(function() { playSong("1ghlpxVfPbFH2jenrv9vVw") }, 1000);  // giving the Spotify API 1 second to get ready before making a song request


