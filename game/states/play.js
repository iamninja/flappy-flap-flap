'use strict';
var Bird = require('../prefabs/bird');

function Play() {}

Play.prototype = {
  create: function() {
    // Load physics and set gravity
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 500;

    // Add background
    this.background = this.game.add.sprite(0, 0, 'background');
  },

  update: function() {

  }
};

module.exports = Play;