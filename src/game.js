// Create the game with a 1024*576 screen size
var game = new Phaser.Game(1024, 576, Phaser.AUTO, '');

// Create and open the loading screen
game.state.add('load', loadState, true);

// Create the main menu screen
game.state.add('menu', menuState);

// Create the ingame screen
game.state.add('play', playState);

// Create the end game screen
game.state.add('end', endState);

// Store the current level to be played
game.currentLevel = 0;

// Store the last unlocked level
game.progress = 0;

// Store the number of dry streets
game.dryStreets = 0;

// Store the number of buildable barricades
game.barricades = 0;

// Store the time of the last performed action
game.lastAction = 0;

// Store the levels
game.levels = [];

// Store the high score of each level
game.highScores = [];
