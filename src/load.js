var loadState = {
    preload: function () {

        // Load the tileset
        game.load.spritesheet('tileset', 'assets/tileset.png', 96, 96);

        // Load the level data
        game.load.json('level', 'data/mapstart.json');

        // Load music
        game.load.audio('music', 'assets/Revolutionary.mp3');
    },
    create: function () {

        // Store the levels
        game.levels = game.cache.getJSON('levels');
        game.level = game.cache.getJSON('level').layers;

        // Start the main menu
        game.state.start('play');

        // Start music
        music = game.add.audio('music', 0.3, true);
        music.play();
    }
};