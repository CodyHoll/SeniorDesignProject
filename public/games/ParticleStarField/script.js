// ...........................settings..............................
var actionZ = 0; //on left click action
var rotationA = 3.1; // amount of rotation
var movementSpeed = 9.5; //9.5 if you start w/ spaceman is perfect
var zoomSpeed = 3;
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

var bool;
bool = true; 

function songCall(){
  if(bool){
    playSong(pickRandomSong())
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

var i = 0;
function onDocumentMouseDown(){
  event.preventDefault();
  actionZ = -zoomSpeed;
  
  i += 1;
  // first click
  if(i == 1) {
    // remove instructions
    document.querySelector("#dir").remove();
    // playSong(pickRandomSong());
    playSong(SpaceSongs.Spaceman);
  }
}

function onDocumentMouseUp(){
   actionZ = 0;
}

// to change the song
button.addEventListener("click", () => {
  playSong(pickRandomSong());
  playSong(SpaceSongs.Spaceman);
});


// if song == spaceman
  // wait 31 seconds and turn...
  // or.. have all turns be 31 second intervals