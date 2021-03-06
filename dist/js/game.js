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
},{"./states/boot":7,"./states/gameover":8,"./states/menu":9,"./states/play":10,"./states/preload":11}],2:[function(require,module,exports){
'use strict';

var Bird = function(game, x, y, frame) {
	// Super call to Phaser.Sprite
	Phaser.Sprite.call(this, game, x, y, 'bird', frame);

	// Set sprites anchor to the center
	this.anchor.setTo(0.5, 0.5);

	// Add and play animations
	this.animations.add('flap');
	this.animations.play('flap', 12, true);

	// The bird starts as NOT alive
	this.alive = false;
	// and NOT on ground
	this.onGround = false;

	// Add physics body to bird
	this.game.physics.arcade.enableBody(this);

	// Disable gravity on bird (untill the game start)
	this.body.allowGravity = false;

	// Add flap sound
	this.flapSound = this.game.add.audio('flap');
};

Bird.prototype = Object.create(Phaser.Sprite.prototype);
Bird.prototype.constructor = Bird;

Bird.prototype.update = function() {
	// If the bird's angle is less than 90 degrees
	// and the bird is alive (game started)
	// rotates the bird towards the ground
	if (this.angle < 90 && this.alive) {
		this.angle +=2.5;
	}

	// Zero speed on death
	if (!this.alive) {
		this.body.velocity.x = 0;
	}
};

Bird.prototype.flap = function() {
	if (this.alive) {
		// Play the flap sound
		this.flapSound.play();
		// Moves the bird on y-axis with the given velocity
		this.body.velocity.y = -400;

		// Rotate the bird as it moves to -40 degrees
		this.game.add.tween(this).to({angle: -40}, 100).start();
	}
};

Bird.prototype.onKilled = function() {
	this.exists = true;
	this.visible = true;
	this.animations.stop();
	var duration = 90 / this.y * 300;
	this.game.add.twen(this).to({angle: 90}, duration).start();
	console.log('killed');
};

module.exports = Bird;

},{}],3:[function(require,module,exports){
'use strict';

var Ground = function(game, x, y, width, height) {
	Phaser.TileSprite.call(this, game, x, y, width, height, 'ground');

	// Enable physics on the ground sprite to Enable
	// collision detection
	this.game.physics.arcade.enableBody(this);

	// Start scrolling our ground
	this.autoScroll(-200,0);

	// Make ground not be affected by gravity
	this.body.allowGravity = false;

	// Make ground not be affected by collision
	this.body.immovable = true;
};

Ground.prototype = Object.create(Phaser.TileSprite.prototype);  
Ground.prototype.constructor = Ground;

Ground.prototype.update = function() {
  
	// write your prefab's specific update code here
  
};

module.exports = Ground;

},{}],4:[function(require,module,exports){
'use strict';

var Pipe = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'pipe', frame);

  // Set anchor point
  this.anchor.setTo(0.5, 0.5);
  // Add physics body to pipe
  this.game.physics.arcade.enableBody(this);

  // Disable gravity for pipes
  this.body.allowGravity = false;
  // Make pipe unaffected by collisions
  this.body.immovable = true;
};

Pipe.prototype = Object.create(Phaser.Sprite.prototype);
Pipe.prototype.constructor = Pipe;

Pipe.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Pipe;

},{}],5:[function(require,module,exports){
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
	// Reset the topPipe object to (20,0)
	this.topPipe.reset(20, 0);
	// Reset the bottomPipe object to (20, 440)
	this.bottomPipe.reset(20, 440);

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

PipeGroup.prototype.stop = function() {
	this.setAll('body.velocity.x', 0);
};

module.exports = PipeGroup;

},{"./pipe":4}],6:[function(require,module,exports){
'use strict';

var Scoreboard = function(game) {
	var gameover;

	Phaser.Group.call(this, game);
	// Set gameover text (.png)
	gameover = this.create(this.game.width/2, 100, 'gameover');
	gameover.anchor.setTo(0.5, 0.5);
	
	// Set scoreboard
	this.scoreboard = this.create(this.game.width/2, 200, 'scoreboard');
	this.scoreboard.anchor.setTo(0.5, 0.5);

	// Set score text (scoreText)
	this.scoreText = this.game.add.bitmapText(this.scoreboard.width, 180, 'flappyfont', '', 18);
	this.add(this.scoreText);

	// Set best score text
	this.bestText = this.game.add.bitmapText(this.scoreboard.width, 230, 'flappyfont', '', 18);
	this.add(this.bestText);

	// Add start button with a callback
	this.startButton = this.game.add.button(this.game.width/2, 300, 'startButton', this.startClick, this);
	this.startButton.anchor.setTo(0.5, 0.5);
	this.add(this.startButton);

	// Set groups initial position
	this.y = this.game.height;
	this.x = 0;
};

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

Scoreboard.prototype.show = function(score) {
  var medal, bestScore;

  // scoreText gets the passed score
  this.scoreText.setText(score.toString());

  // Checks locally for a bestScore value
  if(localStorage) {
    bestScore = localStorage.getItem('bestScore');

    // Compare score and bestScore
    if(!bestScore || bestScore < score) {
      bestScore = score;
      localStorage.setItem('bestScore', bestScore);
    }
  } else {
    // Fallback
    bestScore = 'N/A';
  }

  // Update best score text
  this.bestText.setText(bestScore.toString());

  // Decide if.medal and position it
  if(score >= 3 && score < 5) {
    medal = this.game.add.sprite(-65, 7, 'medals', 1);
    // medal.anchor.setTo(0.5, 0.5);
    // this.scoreboard.addChild(medal);
  } else if(score >= 5) {
    medal = this.game.add.sprite(-65, 7, 'medals', 0);
    // medal.anchor.setTo(0.5, 0.5);
    // this.scoreboard.addChild(medal);
  }

  // Tween the group to a visible position
  this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);

  // If medal then set and start particle emitter (shiny medal!!)
  if (medal) {
    
    medal.anchor.setTo(0.5, 0.5);
    this.scoreboard.addChild(medal);
    
    var emitter = this.game.add.emitter(medal.x, medal.y, 400);
    this.scoreboard.addChild(emitter);
    emitter.width = medal.width;
    emitter.height = medal.height;

    emitter.makeParticles('particle');

    emitter.setRotation(-100, 100);
    emitter.setXSpeed(0,0);
    emitter.setYSpeed(0,0);
    emitter.minParticleScale = 0.25;
    emitter.maxParticleScale = 0.5;
    emitter.setAll('body.allowGravity', false);

    emitter.start(false, 1000, 1000);
    
  }

};

Scoreboard.prototype.startClick = function() {
  this.game.state.start('play');
};

module.exports = Scoreboard;

},{}],7:[function(require,module,exports){

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

},{}],8:[function(require,module,exports){

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

},{}],9:[function(require,module,exports){

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

},{}],10:[function(require,module,exports){
'use strict';
var Bird = require('../prefabs/bird');
var Ground = require('../prefabs/ground');
var Pipe = require('../prefabs/pipe');
var PipeGroup = require('../prefabs/pipeGroup');
var Scoreboard = require('../prefabs/scoreboard');

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
    this.flapKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    // The first flapKey initiate the game
    this.flapKey.onDown.addOnce(this.startGame, this);
    // all the next flapKeys initiate bird.flap
    this.flapKey.onDown.add(this.bird.flap, this.bird);

    // Add mouse/touch controls
    this.game.input.onDown.addOnce(this.startGame, this);
    this.game.input.onDown.add(this.bird.flap, this.bird);

    // // Add timer for pipe generator and start it
    // this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this);
    // this.pipeGenerator.timer.start();

    // Create instructions group
    this.instructionGroup = this.game.add.group();
    this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 100, 'getReady'));
    this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 325, 'instructions'));
    // Anchor instructions
    this.instructionGroup.setAll('anchor.x', 0.5);
    this.instructionGroup.setAll('anchor.y', 0.5);

    // Set score to 0 at the start
    this.score = 0;

    // Add scoreText on play screen
    this.scoreText = this.game.add.bitmapText(this.game.width/2, 10, 'flappyfont', this.score.toString(), 24);
    // Set the score to be invisible by the start of the game (instruction screen)
    this.scoreText.visible = false;

    // Add sounds
    this.scoreSound = this.game.add.audio('score');
    this.pipeHitSound = this.game.add.audio('pipeHit');
    this.groundHitSound = this.game.add.audio('groundHit');

    // Set gameover to false
    this.gameover = false;
  },

  update: function() {
    // Make bird and ground collide
    this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this);
    if (!this.gameover) {
      // Iterate through pipeGroups
      this.pipes.forEach(function(pipeGroup) {
        // Run checkScore for each pipeGroup
        this.checkScore(pipeGroup);
        // Enable collisions between the bird and each
        // group in the pipes group
        this.game.physics.arcade.collide(this.bird, pipeGroup, this.deathHandler, null, this);
      }, this);
    }
  },

  generatePipes: function() {
    console.log('generate pipes!')
    var pipeY = this.game.rnd.integerInRange(-100, 100);
    var pipeGroup = this.pipes.getFirstExists(false);
    if (!pipeGroup) {
      pipeGroup = new PipeGroup(this.game, this.pipes);
    }
    pipeGroup.reset(this.game.width, pipeY);
  },

  deathHandler: function(bird, enemy) {
    if(enemy instanceof Ground && !this.bird.onGround) {
        this.groundHitSound.play();
        this.scoreboard = new Scoreboard(this.game);
        this.game.add.existing(this.scoreboard);
        this.scoreboard.show(this.score);
    } else if (enemy instanceof Pipe){
        this.pipeHitSound.play();
        this.scoreboard = new Scoreboard(this.game);
        this.game.add.existing(this.scoreboard);
        this.scoreboard.show(this.score);
    }

    if(!this.gameover) {
        this.gameover = true;
        this.bird.kill();
        this.pipes.callAll('stop');
        this.pipeGenerator.timer.stop();
        this.ground.stopScroll();
    }
  },

  shutdown: function() {
    this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
    this.bird.destroy();
    this.pipes.destroy();
    this.scoreboard.destroy();
  },

  startGame: function() {
    if (!this.bird.alive && !this.gameover) {
      // Enable gravity on bird and make it alive
      this.bird.body.allowGravity = true;
      this.bird.alive = true;

      // Add timer for pipeGenerator and start it
      this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this);
      this.pipeGenerator.timer.start();

      // Kill the instruction group
      this.instructionGroup.destroy();

      // Set the scoreText to be visible
      // this.scoreText.visible = true;
    }
  },

  checkScore: function(pipeGroup) {
    if(pipeGroup.exists && !pipeGroup.hasScored && pipeGroup.topPipe.world.x <= this.bird.world.x) {
      pipeGroup.hasScored = true;
      this.score++;
      this.scoreText.setText(this.score.toString());
      this.scoreSound.play();
    }
  }
};

module.exports = Play;
},{"../prefabs/bird":2,"../prefabs/ground":3,"../prefabs/pipe":4,"../prefabs/pipeGroup":5,"../prefabs/scoreboard":6}],11:[function(require,module,exports){

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

    this.load.image('instructions', 'assets/instructions.png');
    this.load.image('getReady', 'assets/get-ready.png');

    this.load.spritesheet('bird', 'assets/bird.png', 34, 24, 3);
    this.load.spritesheet('pipe', 'assets/pipes.png', 54, 320, 2);

    this.load.bitmapFont('flappyfont', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt');

    this.load.audio('score', 'assets/score.wav');
    this.load.audio('flap', 'assets/flap.wav');
    this.load.audio('pipeHit', 'assets/pipe-hit.wav');
    this.load.audio('groundHit', 'assets/ground-hit.wav');

    this.load.image('scoreboard', 'assets/scoreboard.png');
    this.load.image('gameover', 'assets/gameover.png');
    this.load.spritesheet('medals', 'assets/medals.png', 44, 46, 2);
    this.load.image('particle', 'assets/particle.png');

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