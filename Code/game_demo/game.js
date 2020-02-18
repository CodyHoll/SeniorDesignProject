var myGamePiece;
var myPortal;
var canvasWidth = 960;
var canvasHeight = 540;

function startGame() {
    // do-while loop preventing myGamePiece and myPortal
    // from spawning in conflicting areas a.k.a already touching:
    do {
        myGameArea.key = false;
        var randX = getRandomInt(30, 930);
        var randY = getRandomInt(30, 510);
        myGamePiece = new component(30, 30, "orange", randX, randY);

        var randX = getRandomInt(30, 930);
        var randY = getRandomInt(30, 510);
        myPortal = new component(30, 30, "darkturquoise", randX, randY);
    } while (myGamePiece.touch(myPortal));

    myGameArea.start();
}

var myGameArea = {
    // Creating 2d Canvas workspace:
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 10);    // Updates every 10ms
        // Recognize key press:
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        // Recognize key release:
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })        
    },

    // Clear function required so component doesn't
    // leave a "trail" behind while moving:
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    // Stop game when myGamePiece touches myPortal:
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;    

    // context/ctx: updating component's movements
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // Sets new position according to updateGameArea():
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }

    this.touch = function(portal) {
        // mgp = myGamePiece
        var mgpLeft = this.x;
        var mgpTop = this.y;
        var mgpRight = this.x + (this.width);
        var mgpBottom = this.y + (this.height);

        // mpo = myPortal
        var mpoLeft = portal.x;
        var mpoTop = portal.y;
        var mpoRight = portal.x + (portal.width);
        var mpoBottom = portal.y + (portal.height);

        // check if any of the coordinates overlap:
        var touched = true;
        if ((mgpBottom < mpoTop) || (mgpTop > mpoBottom) || (mgpRight < mpoLeft) || (mgpLeft > mpoRight)) {
            touched = false;
        }
        return touched;
    }

    this.crash = function() {
        // mgp = myGamePiece
        var mgpLeft = this.x;
        var mgpTop = this.y;
        var mgpRight = this.x + (this.width);
        var mgpBottom = this.y + (this.height);

        var crashed = false;

        if ((mgpBottom > canvasHeight) || (mgpTop < 0) || (mgpRight > canvasWidth) || (mgpLeft < 0)) {
            crashed = true;

            // Moving box back to where it was
            // before crashing into the boundary:
            if (mgpBottom > canvasHeight) {
                myGamePiece.speedY = -4;
            } else if (mgpTop < 0) {
                myGamePiece.speedY = 4;
            } else if (mgpRight > canvasWidth) {
                myGamePiece.speedX = -4;
            } else if (mgpLeft < 0) {
                myGamePiece.speedX = 4;
            }

            // Update position (back to where it was):
            myGamePiece.newPos();
            myGamePiece.update();
        }

        return crashed;
    }
}

// Movement comes from this function.
// This is used by interval to update
// game area and component:
function updateGameArea() {
    // Check if myGamePiece touched portal.
    // Otherwise, update movement:

    breakMove : if (myGamePiece.touch(myPortal)) {
        alert("Song Request!");
        myGameArea.stop();
        startGame();
    } else if (myGamePiece.crash()) {
        // crash function took care trying to run past boudaries
        // console.log("Crash");
        break breakMove;
    } else {
        myGameArea.clear();
        myGamePiece.speedX = 0;
        myGamePiece.speedY = 0;
        if (myGameArea.key && myGameArea.key == 37) {myGamePiece.speedX = -4;}
        if (myGameArea.key && myGameArea.key == 39) {myGamePiece.speedX = 4;}
        if (myGameArea.key && myGameArea.key == 38) {myGamePiece.speedY = -4;}
        if (myGameArea.key && myGameArea.key == 40) {myGamePiece.speedY = 4;}
        myGamePiece.newPos();
        myGamePiece.update();
        myPortal.update();
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


startGame();