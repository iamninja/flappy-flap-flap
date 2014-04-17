'use strict';

var Scoreboard = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'scoreboard', frame);

  // initialize your prefab here
  
};

Scoreboard.prototype = Object.create(Phaser.Sprite.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Scoreboard;
