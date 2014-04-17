'use strict';
var Bird = require('../prefabs/bird');
var Ground = require('../prefabs/ground');
var PipeGroup = require('../prefabs/pipeGroup');

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

    // Create and add group to hold our pipeGroup prefabs
    this.pipes = this.game.add.group();

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
    this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this);

    // Enable collisions between the bird and each
    // group in the pipes group
    this.pipes.forEach(function(pipeGroup) {
      this.game.physics.arcade.collide(this.bird, pipeGroup, this.deathHandler, null, this);
    }, this);
  },

  generatePipes: function() {
    console.log('generate pipes!')
    var pipeY = this.game.rnd.integerInRange(-100, 100);
    var pipeGroup = this.pipes.getFirstExists(false);
    if (!pipeGroup) {
      pipeGroup = new PipeGroup(this.game, this.pipes);
    }
    pipeGroup.reset(this.game.width, pipeY)
  },

  deathHandler: function() {
    this.game.state.start('gameover');
  },

  shutdown: function() {
    this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
    this.bird.destroy();
    this.pipes.destroy();
  }
};

module.exports = Play;