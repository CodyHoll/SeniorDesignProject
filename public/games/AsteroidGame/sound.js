// sound.js (sound effects)......................................................................

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	this.sound.volume = 0.03;
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

shipAsteroidCollisionSound = new sound("sounds/explode.mp3")
bulletAsteroidCollisionSound = new sound("sounds/bang.mp3")
bulletSound = new sound("sounds/bullet.mp3")
engineSound = new sound("sounds/engineShort.mp3")

//...............................................................................................