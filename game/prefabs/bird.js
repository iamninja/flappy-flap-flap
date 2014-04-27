'use strict';

var Bird = function(game, x, y, frame) {
	// Super call to Phaser.Sprite
	Phaser.Sprite.call(this, game, x, y, 'bird', frame);

	// Set sprites anchor to the center
	this.anchor.setTo(0.5, 0.5);

	// Add and play animations
	this.animations.add('flap');
	this.animations.play('flap', 12, true);

	// The bird starts as NOT alive
	this.alive = false;
	// and NOT on ground
	this.onGround = false;

	// Add physics body to bird
	this.game.physics.arcade.enableBody(this);

	// Disable gravity on bird (untill the game start)
	this.body.allowGravity = false;

	// Add flap sound
	this.flapSound = this.game.add.audio('flap');
};

Bird.prototype = Object.create(Phaser.Sprite.prototype);
Bird.prototype.constructor = Bird;

Bird.prototype.update = function() {
	// If the bird's angle is less than 90 degrees
	// and the bird is alive (game started)
	// rotates the bird towards the ground
	if (this.angle < 90 && this.alive) {
		this.angle +=2.5;
	}

	// Zero speed on death
	if (!this.alive) {
		this.body.velocity.x = 0;
	}
};

Bird.prototype.flap = function() {
	if (this.alive) {
		// Play the flap sound
		this.flapSound.play();
		// Moves the bird on y-axis with the given velocity
		this.body.velocity.y = -400;

		// Rotate the bird as it moves to -40 degrees
		this.game.add.tween(this).to({angle: -40}, 100).start();
	}
};

Bird.prototype.onKilled = function() {
	this.exists = true;
	this.visible = true;
	this.animations.stop();
	var duration = 90 / this.y * 300;
	this.game.add.twen(this).to({angle: 90}, duration).start();
	console.log('killed');
};

module.exports = Bird;
