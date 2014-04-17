'use strict';
var Pipe = require('./pipe');

var PipeGroup = function(game, parent) {
  Phaser.Group.call(this, game, parent);

  // Generate new top pipe and add it to group
  this.topPipe = new Pipe(this.game, 0, 0, 0);
  this.add(this.topPipe);

  // Generate new bottom pipe and add it to group
  // 440 calculated by 
  // y = pipe.height + (bird.height * 5)  
  this.bottomPipe = new Pipe(this.game, 0, 440, 1);
  this.add(this.bottomPipe);

  // Will use this later to make scores
  this.hasScored = false;

  // Give speed to pipes in group (make them move)
  this.setAll('body.velocity.x', -200);
};

PipeGroup.prototype = Object.create(Phaser.Group.prototype);
PipeGroup.prototype.constructor = PipeGroup;
PipeGroup.prototype.reset = function(x, y) {
	// Reset the topPipe object to (0,0)
	this.topPipe.reset(0, 0);
	// Reset the bottomPipe object to (0, 440)
	this.bottomPipe.reset(0, 440);

	// Set the group's x and y coordinates from the passed 
	// in values (relative to the world)
	this.x = x;
	this.y = y;

	// Set the x-velocity of all group's children
	// to 200
	this.setAll('body.velocity.x', -200);

	// Clear the group's hasScored switch to false
	this.hasScored = false;

	// Set the group's exists property to true
	this.exists = true;
};

PipeGroup.prototype.checkWorldBounds = function() {
	if (!this.topPipe.inWorld) {
		this.exists = false;
	}
};

PipeGroup.prototype.update = function() {
	this.checkWorldBounds();
};

module.exports = PipeGroup;
