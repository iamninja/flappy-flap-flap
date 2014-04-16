'use strict';

var Bird = function(game, x, y, frame) {
	// Super call to Phaser.Sprite
	Phaser.Sprite.call(this, game, x, y, 'bird', frame);

	// Set sprites anchor to the center
	this.anchor.setTo(0.5, 0.5);

	// Add and play animations
	this.animations.add('flap');
	this.animations.play('flap', 12, true);

	// Add physics body to bird
	this.game.physics.arcade.enableBody(this);
};

Bird.prototype = Object.create(Phaser.Sprite.prototype);
Bird.prototype.constructor = Bird;

Bird.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Bird;
