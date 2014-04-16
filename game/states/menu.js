
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

    // Create a group
    this.titleGroup = this.game.add.group();

    // Create title and bird sprites and add them to titleGroup
    this.title = this.game.add.sprite(0, 0, 'title');
    this.bird = this.game.add.sprite(200, 5, 'bird');
    this.titleGroup.add(this.title);
    this.titleGroup.add(this.bird);

    // Add animation to bird and start it
    this.bird.animations.add('flap');
    this.bird.animations.play('flap', 12, true);

    // Set titleGroup location
    this.titleGroup.x = 30;
    this.titleGroup.y = 100;

    // Create oscillating animation tween for the titleGroup
    this.game.add.tween(this.titleGroup).to({y:115}, 350, Phaser.Easing.Linear.NONE, true, 0, 1000, true);

    // Add start button
    this.startButton = this.game.add.button(this.game.width/2, 300, 'startButton', this.startClick, this);
    this.startButton.anchor.setTo(0.5, 0.5);
  },

  startClick: function() {
    // Start button click handler. Start the 'play' state
    this.game.state.start('play');
  },

  update: function() {
    
  }
};

module.exports = Menu;
