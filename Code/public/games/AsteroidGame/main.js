function loop()
{
	updateShip();
	updateParticles();
	updateBullets();
	updateAsteroids();

	checkCollisions();

	render();

	getAnimationFrame(loop);
}

function updateShip()
{
	ship.update();

	if(ship.idle) return;

	if(keySpace) ship.shoot();
	if(keyLeft) ship.angle -= 0.1;
	if(keyRight) ship.angle += 0.1;

	if(keyUp)
	{
		ship.thrust.setLength(.1);
		ship.thrust.setAngle(ship.angle);

		generateThrustParticle();
	}
	else
	{
		ship.vel.mul(0.94);
		ship.thrust.setLength(0);
	}

	if(ship.pos.getX() > screenWidth) ship.pos.setX(0);
	else if(ship.pos.getX() < 0) ship.pos.setX(screenWidth);

	if(ship.pos.getY() > screenHeight) ship.pos.setY(0);
	else if(ship.pos.getY() < 0) ship.pos.setY(screenHeight);
}

function generateThrustParticle()
{
	var p = particlePool.getElement();

	//if the particle pool doesn't have more elements, will return 'null'.

	if(!p) return;

	p.radius = Math.random() * 3 + 2;
	p.color = '#FFF';
	p.lifeSpan = 80;
	p.pos.setXY(ship.pos.getX() + Math.cos(ship.angle) * -14, ship.pos.getY() + Math.sin(ship.angle) * -14);
	p.vel.setLength(8 / p.radius);
	p.vel.setAngle(ship.angle + (1 - Math.random() * 2) * (Math.PI / 18));
	p.vel.mul(-1);

	//particles[particles.length] = p; same as: particles.push(p);

	particles[particles.length] = p;
	// engineSound.play();
}

function updateParticles()
{
	var i = particles.length - 1;

	for(i; i > -1; --i)
	{
		var p = particles[i];

		if(p.blacklisted)
		{
			p.reset();

			particles.splice(particles.indexOf(p), 1);
			particlePool.disposeElement(p);

			continue;
		}

		p.update();
	}
}

function updateBullets()
{
	var i = bullets.length - 1;

	for(i; i > -1; --i)
	{
		var b = bullets[i];

		if(b.blacklisted)
		{
			b.reset();

			bullets.splice(bullets.indexOf(b), 1);
			bulletPool.disposeElement(b);

			continue;
		}

		b.update();

		if(b.pos.getX() > screenWidth) b.blacklisted = true;
		else if(b.pos.getX() < 0) b.blacklisted = true;

		if(b.pos.getY() > screenHeight) b.blacklisted = true;
		else if(b.pos.getY() < 0) b.blacklisted = true;
	}
}

function updateAsteroids()
{
	var i = asteroids.length - 1;

	for(i; i > -1; --i)
	{
		var a = asteroids[i];

		if(a.blacklisted)
		{
			a.reset();

			asteroids.splice(asteroids.indexOf(a), 1);
			asteroidPool.disposeElement(a);

			continue;
		}

		a.update();

		if(a.pos.getX() > screenWidth + a.radius) a.pos.setX(-a.radius);
		else if(a.pos.getX() < -a.radius) a.pos.setX(screenWidth + a.radius);

		if(a.pos.getY() > screenHeight + a.radius) a.pos.setY(-a.radius);
		else if(a.pos.getY() < -a.radius) a.pos.setY(screenHeight + a.radius);
	}

	if(asteroids.length < 5)
	{
		var factor = (Math.random() * 2) >> 0;

		generateAsteroid(screenWidth * factor, screenHeight * factor, 60 , 'b');
	}
}

function generateAsteroid(x, y, radius, type)
{
	var a = asteroidPool.getElement();

	//if the bullet pool doesn't have more elements, will return 'null'.

	if(!a) return;

	a.radius = radius;
	a.type = type;
	a.pos.setXY(x, y);
	a.vel.setLength(1 + asteroidVelFactor);
	a.vel.setAngle(Math.random() * (Math.PI * 2));

	//bullets[bullets.length] = b; same as: bullets.push(b);

	asteroids[asteroids.length] = a;
	asteroidVelFactor += 0.025;
}

function levelTwo() {
	level.innerHTML = 2;
	// playSong('57bgtoPSgt236HzfBOd8kj');
	playSong(UsualSongs.Thunderstruck)
	// playSong(StarWars.MainTitle)
	if(typeof(infoBox) != 'undefined' && infoBox != null) {
		infoBox.remove();
	}
	// ship.strokeStyle = 'blue';
}

function levelThree() {
	level.innerHTML = 3;
	playSong('42cgYL0K9ut6meaFqJZWI8');
}

function checkCollisions()
{
	checkBulletAsteroidCollisions();
	checkShipAsteroidCollisions();
}

function checkBulletAsteroidCollisions()
{
	var i = bullets.length - 1;
	var j;

	for(i; i > -1; --i)
	{
		j = asteroids.length - 1;

		for(j; j > -1; --j)
		{
			var b = bullets[i];
			var a = asteroids[j];

			if(checkDistanceCollision(b, a))
			{
				b.blacklisted = true;

				destroyAsteroid(a);
				score.innerHTML = parseInt(score.innerHTML) +1;
				// When score is twenty go to lvl 2
				if(score.innerHTML == 20){
					levelTwo();
				}
				else if(score.innerHTML == 50) {
					levelThree();
				}
				// bulletAsteroidCollisionSound
				new sound("sounds/bang.mp3").play();
			}
		}
	}
}

function checkShipAsteroidCollisions()
{
	var i = asteroids.length - 1;

	for(i; i > -1; --i)
	{
		var a = asteroids[i];
		var s = ship;

		if(checkDistanceCollision(a, s))
		{
			// kill and reset
			if(parseInt(lives.innerHTML) <= 1){
				if(s.idle) return;

				s.idle = true;

				generateShipExplosion();
				destroyAsteroid(a);
				score.innerHTML = 0;
				lives.innerHTML = 3;
				level.innerHTML = 0;

				// stop Spotify song
				player.pause()
			}

			// subtract -1 life
			else {
				if(s.idle) return;

				destroyAsteroid(a);
				lives.innerHTML = parseInt(lives.innerHTML) - 1;
			}
			
			// play collision sound (shipAsteroidCollisionSound)
			new sound("sounds/explode.mp3").play();
		}
	}
}

function generateShipExplosion()
{
	var i = 18;

	for(i; i > -1; --i)
	{
		var p = particlePool.getElement();

		//if the particle pool doesn't have more elements, will return 'null'.

		if(!p) return;

		p.radius = Math.random() * 6 + 2;
		p.lifeSpan = 80;
		p.color = '#FFF';
		p.vel.setLength(20 / p.radius);
		p.vel.setAngle(ship.angle + (1 - Math.random() * 2) * doublePI);
		p.pos.setXY(ship.pos.getX() + Math.cos(p.vel.getAngle()) * (ship.radius * 0.8), ship.pos.getY() + Math.sin(p.vel.getAngle()) * (ship.radius * 0.8));

		//particles[particles.length] = p; same as: particles.push(p);

		particles[particles.length] = p;
	}
}

function checkDistanceCollision(obj1, obj2)
{
	var vx = obj1.pos.getX() - obj2.pos.getX();
	var vy = obj1.pos.getY() - obj2.pos.getY();
	var vec = Vec2D.create(vx, vy);

	if(vec.getLength() < obj1.radius + obj2.radius)
	{
		return true;
	}

	return false;
}

function destroyAsteroid(asteroid)
{
	asteroid.blacklisted = true;

	generateAsteroidExplosion(asteroid);
	resolveAsteroidType(asteroid);
}

function generateAsteroidExplosion(asteroid)
{
	var i = 18;

	for(i; i > -1; --i)
	{
		var p = particlePool.getElement();

		//if the particle pool doesn't have more elements, will return 'null'.

		if(!p) return;

		p.radius = Math.random() * (asteroid.radius >> 2) + 2;
		p.lifeSpan = 80;
		p.color = '#FF5900';
		p.vel.setLength(20 / p.radius);
		p.vel.setAngle(ship.angle + (1 - Math.random() * 2) * doublePI);
		p.pos.setXY(asteroid.pos.getX() + Math.cos(p.vel.getAngle()) * (asteroid.radius * 0.8), asteroid.pos.getY() + Math.sin(p.vel.getAngle()) * (asteroid.radius * 0.8));

		//particles[particles.length] = p; same as: particles.push(p);

		particles[particles.length] = p;
	}
}

function resolveAsteroidType(asteroid)
{
	switch(asteroid.type)
	{
		case 'b':

		generateAsteroid(asteroid.pos.getX(), asteroid.pos.getY(), 40, 'm');
		generateAsteroid(asteroid.pos.getX(), asteroid.pos.getY(), 40, 'm');

		break;

		case 'm':

		generateAsteroid(asteroid.pos.getX(), asteroid.pos.getY(), 20, 's');
		generateAsteroid(asteroid.pos.getX(), asteroid.pos.getY(), 20, 's');

		break;
	}
}

function render()
{
	context.fillStyle = '#262626';
	context.globalAlpha = 0.4;
	context.fillRect(0, 0, screenWidth, screenHeight);
	context.globalAlpha = 1;

	renderShip();
	renderParticles();
	renderBullets();
	renderAsteroids();
	renderScanlines();
}

function renderShip()
{
	if(ship.idle) return;

	context.save();
	context.translate(ship.pos.getX() >> 0, ship.pos.getY() >> 0);
	context.rotate(ship.angle);

	context.strokeStyle = '#FFF';
	context.lineWidth = (Math.random() > 0.9) ? 2 : 1;
	context.beginPath();
	context.moveTo(10, 0);
	context.lineTo(-10, -10);
	context.lineTo(-10, 10);
	context.lineTo(10, 0);
	context.stroke();
	context.closePath();

	context.restore();
}

function renderParticles()
{
	//inverse for loop = more performance.

	var i = particles.length - 1;

	for(i; i > -1; --i)
	{
		var p = particles[i];

		context.beginPath();
		context.strokeStyle = p.color;
		context.arc(p.pos.getX() >> 0, p.pos.getY() >> 0, p.radius, 0, doublePI);
		if(Math.random() > 0.4) context.stroke();
		context.closePath();
	}
}

function renderBullets()
{
	//inverse for loop = more performance.

	var i = bullets.length - 1;

	for(i; i > -1; --i)
	{
		var b = bullets[i];

		context.beginPath();
		context.strokeStyle = b.color;
		context.arc(b.pos.getX() >> 0, b.pos.getY() >> 0, b.radius, 0, doublePI);
		if(Math.random() > 0.2) context.stroke();
		context.closePath();
	}
}

function renderAsteroids()
{
	//inverse for loop = more performance.

	var i = asteroids.length - 1;

	for(i; i > -1; --i)
	{
		var a = asteroids[i];

		context.beginPath();
		context.lineWidth = (Math.random() > 0.2) ? 4 : 3;
		context.strokeStyle = a.color;

		var j = a.sides;

		context.moveTo((a.pos.getX() + Math.cos(doublePI * (j / a.sides) + a.angle) * a.radius) >> 0, (a.pos.getY() + Math.sin(doublePI * (j / a.sides) + a.angle) * a.radius) >> 0);

		for(j; j > -1; --j)
		{
			context.lineTo((a.pos.getX() + Math.cos(doublePI * (j / a.sides) + a.angle) * a.radius) >> 0, (a.pos.getY() + Math.sin(doublePI * (j / a.sides) + a.angle) * a.radius) >> 0);
			
		}

		if(Math.random() > 0.2) context.stroke();
		
		context.closePath();
	}
}

function renderScanlines()
{
	//inverse for loop = more performance.

	var i = hScan;

	context.globalAlpha = 0.05;
	context.lineWidth = 1;

	for(i; i > -1; --i)
	{
		context.beginPath();
		context.moveTo(0, i * 4);
		context.lineTo(screenWidth, i * 4);
		context.strokeStyle = (Math.random() > 0.0001) ? '#FFF' : '#222';
		context.stroke();
	}

	context.globalAlpha = 1;
}

function generateShot()
{
	// play sound
	new sound("sounds/bullet.mp3").play();

	var b = bulletPool.getElement();

	//if the bullet pool doesn't have more elements, will return 'null'.

	if(!b) return;

	b.radius = 1;
	b.pos.setXY(ship.pos.getX() + Math.cos(ship.angle) * 14, ship.pos.getY() + Math.sin(ship.angle) * 14);
	b.vel.setLength(10);
	b.vel.setAngle(ship.angle);

	//bullets[bullets.length] = b; same as: bullets.push(b);

	bullets[bullets.length] = b;
}

function resetGame()
{
	asteroidVelFactor = 0;

	ship.pos.setXY(screenWidth >> 1, screenHeight >> 1);
	ship.vel.setXY(0, 0);

	resetAsteroids();
}

function resetAsteroids()
{
	var i = asteroids.length - 1;

	for(i; i > -1; --i)
	{
		var a = asteroids[i];
		a.blacklisted = true;
	}
}