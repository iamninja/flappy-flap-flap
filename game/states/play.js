'use strict';
var Bird = require('../prefabs/bird');
var Ground = require('../prefabs/ground');

function Play() {}

Play.prototype = {
  create: function() {
    // Load physics and set gravity
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1200;

    // Add background
    this.background = this.game.add.sprite(0, 0, 'background');

    // Create new bird object
    this.bird = new Bird(this.game, 100, this.game.height/2);
    // Add the bird object to the game
    this.game.add.existing(this.bird);

    // Create new ground object
    this.ground = new Ground(this.game, 0, 400, 335, 112);
    // Add the ground object to the game
    this.game.add.existing(this.ground);

    // Keep spacebar from propogating up to the browser
    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    // Add keyboard controls
    var flapKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    flapKey.onDown.add(this.bird.flap, this.bird);

    // Add mouse/touch controls
    this.input.onDown.add(this.bird.flap, this.bird);

    // Add timer for pipe generator and start it
    this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this);
    this.pipeGenerator.timer.start();
  },

  update: function() {
    // Make bird and ground collide
    this.game.physics.arcade.collide(this.bird, this.ground);
  },

  generatePipes: function() {
    console.log('generating pipes!');
  }
};

module.exports = Play;