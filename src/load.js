var loadState = {
    preload: function () {

        // Load the tileset
        game.load.spritesheet('tileset', 'assets/tileset.png', 96, 96);

        // Load the level data
        game.load.json('level', 'data/level.json');

        // Load the music
        game.load.audio('music', 'assets/revolutionary.mp3');
    },
    create: function () {

        // Start music
        game.add.audio('music', 0.3, true).play();

        // Start the game
        game.state.start('play');
    }
};