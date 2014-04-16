(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(288, 505, Phaser.AUTO, 'flappy-bird-reborn');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":3,"./states/gameover":4,"./states/menu":5,"./states/play":6,"./states/preload":7}],2:[function(require,module,exports){
'use strict';

var Bird = function(game, x, y, frame) {
	// Super call to Phaser.Sprite
	Phaser.Sprite.call(this, game, x, y, 'bird', frame);

	// Set sprites anchor to the center
	this.anchor.setTo(0.5, 0.5);

	// Add and play animations
	this.animations.add('flap');
	this.animations.play('flap', 12, true);

	// Add physics body to bird
	this.game.physics.arcade.enableBody(this);
};

Bird.prototype = Object.create(Phaser.Sprite.prototype);
Bird.prototype.constructor = Bird;

Bird.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Bird;

},{}],3:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],4:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],5:[function(require,module,exports){

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

},{}],6:[function(require,module,exports){
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
},{"../prefabs/bird":2}],7:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    // Load the assets
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.asset = this.add.sprite(this.width/2, this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);
    this.load.setPreloadSprite(this.asset);

    this.load.image('background', 'assets/background.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('title', 'assets/title.png');
    this.load.image('startButton', 'assets/start-button.png');

    this.load.spritesheet('bird', 'assets/bird.png', 34, 24, 3);

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])