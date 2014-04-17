'use strict';

var Ground = function(game, x, y, width, height) {
	Phaser.TileSprite.call(this, game, x, y, width, height, 'ground');

	// Enable physics on the ground sprite to Enable
	// collision detection
	this.game.physics.arcade.enableBody(this);

	// Start scrolling our ground
	this.autoScroll(-200,0);

	// Make ground not be affected by gravity
	this.body.allowGravity = false;

	// Make ground not be affected by collision
	this.body.immovable = true;
};

Ground.prototype = Object.create(Phaser.TileSprite.prototype);  
Ground.prototype.constructor = Ground;

Ground.prototype.update = function() {
  
	// write your prefab's specific update code here
  
};

module.exports = Ground;
