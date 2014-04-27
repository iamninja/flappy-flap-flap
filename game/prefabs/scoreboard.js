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
