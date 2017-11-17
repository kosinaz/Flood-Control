var loadState = {
    preload: function () {

        // Load the tileset
        game.load.spritesheet('tileset', 'assets/tileset.png', 96, 96);

        // Load the level data
        game.load.json('level', 'data/level.json');
        game.load.json('level1', 'data/level1.json');
        game.load.json('level2', 'data/level2.json');
        game.load.json('level3', 'data/level3.json');
        game.load.json('level4', 'data/level4.json');
        game.load.json('level5', 'data/level5.json');

        // Load the music
        game.load.audio('music', 'assets/revolutionary.mp3');
    },
    create: function () {

        // Start music
        game.add.audio('music', 0.3, true).play();

        // Start the game
        game.state.start('menu');
    }
};