//canvas-asteroids.js ...........................................................

function particleInit()
{
	particlePool = Pool.create(Particle, 100);
	particles = [];
}

function bulletInit()
{
	bulletPool = Pool.create(Bullet, 40);
	bullets = [];
}

function asteroidInit()
{
	asteroidPool = Pool.create(Asteroid, 30);
	asteroids = [];
}

function shipInit()
{
	ship = Ship.create(screenWidth >> 1, screenHeight >> 1, this);
}

//common vars

var canvas;
var context;
var screenWidth;
var screenHeight;
var doublePI = Math.PI * 2;

//game vars

var ship;

var particlePool;
var particles;

var bulletPool;
var bullets;

var asteroidPool;
var asteroids;

var hScan;
var asteroidVelFactor = 0;

//keyboard vars

var keyLeft = false;
var keyUp = false;
var keyRight = false;
var keyDown = false;
var keySpace = false;

window.getAnimationFrame =
window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function(callback)
{
	window.setTimeout(callback, 16.6);
};

window.onload = function()
{
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	score = document.getElementById('score');
	lives = document.getElementById('lives');
	level = document.getElementById('level');
	infoBox = document.querySelector("#info");

	window.onresize();

	keyboardInit();
	particleInit();
	bulletInit();
	asteroidInit();
	shipInit();

	loop();
};

window.onresize = function()
{
	if(!canvas) return;

	screenWidth = canvas.clientWidth;
	screenHeight = canvas.clientHeight;

	canvas.width = screenWidth;
	canvas.height = screenHeight;

	hScan = (screenHeight / 4) >> 0;
};

function keyboardInit()
{
	window.onkeydown = function(e)
	{
		switch(e.keyCode)
		{
			//key A or LEFT
			case 65:
			case 37:

			keyLeft = true;

			break;

			//key W or UP
			case 87:
			case 38:

			keyUp = true;

			break;

			//key D or RIGHT
			case 68:
			case 39:

			keyRight = true;

			break;

			//key S or DOWN
			case 83:
			case 40:

			keyDown = true;

			break;

			//key Space
			case 32:
       case 75:

			keySpace = true;

			break;
		}
    
    e.preventDefault();
	};

	window.onkeyup = function(e)
	{
		switch(e.keyCode)
		{
			//key A or LEFT
			case 65:
			case 37:

			keyLeft = false;

			break;

			//key W or UP
			case 87:
			case 38:

			keyUp = false;

			break;

			//key D or RIGHT
			case 68:
			case 39:

			keyRight = false;

			break;

			//key S or DOWN
			case 83:
			case 40:

			keyDown = false;

			break;

			//key Space
       case 75:
			case 32:

			keySpace = false;

			break;
		}
    
    e.preventDefault();
	};
}