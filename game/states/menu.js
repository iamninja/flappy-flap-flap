
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    // Add menu background
    this.background = this.game.add.sprite(0, 0, 'background');
    // Add ground sprite as a tile
    this.ground = this.game.add.tileSprite(0, 400, 335, 112, 'ground');
    // Start scrolling the ground in the negative x direction
    this.ground.autoScroll(-200, 0);
  },
  update: function() {
    
  }
};

module.exports = Menu;
