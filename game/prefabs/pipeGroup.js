'use strict';

var PipeGroup = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'pipeGroup', frame);

  // initialize your prefab here
  
};

PipeGroup.prototype = Object.create(Phaser.Sprite.prototype);
PipeGroup.prototype.constructor = PipeGroup;

PipeGroup.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = PipeGroup;
