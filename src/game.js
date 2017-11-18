/**
 * Create the game with a 1024*576 screen size.
 */ 
var game = new Phaser.Game(1024, 576, Phaser.AUTO, '');

/**
 * Create the game states.
 */ 
game.state.add('load', loadState, true);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('end', endState);

/**
 * Store the current level to be played.
 */ 
game.currentLevel = 0;

/**
 * Store the last unlocked level.
 */ 
game.progress = 1;
