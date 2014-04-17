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

// PipeGroup.prototype.update = function() {
  
//   // write your prefab's specific update code here
  
// };

module.exports = PipeGroup;
