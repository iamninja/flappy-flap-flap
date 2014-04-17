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

	// Add physics body to bird
	this.game.physics.arcade.enableBody(this);

	// Disable gravity on bird (untill the game start)
	this.body.allowGravity = false;
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
};

Bird.prototype.flap = function() {
	// Moves the bird on y-axis with the given velocity
	this.body.velocity.y = -400;

	// Rotate the bird as it moves to -40 degrees
	this.game.add.tween(this).to({angle: -40}, 100).start();
};

module.exports = Bird;
