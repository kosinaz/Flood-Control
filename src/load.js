var loadState = {
    preload: function () {

        // Load the tileset
        game.load.spritesheet('tiles', 'assets/tiles.png', 96, 83);
        game.load.spritesheet('blocks', 'assets/blocks.png', 96, 96);
        game.load.atlasJSONHash('wave', 'assets/waveanimation.png', 'data/waveanimation.json');

        // Load the UI elements
        game.load.spritesheet('ui', 'assets/ui.png', 40, 40);

        // Load the level data
        game.load.json('levels', 'data/levels.json');

        // Load music
        game.load.audio('music', 'assets/Revolutionary.mp3');
    },
    create: function () {

        // Store the levels
        game.levels = game.cache.getJSON('levels');

        // Start the main menu
        game.state.start('menu');

        // Start music
        music = game.add.audio('music', 0.3, true);
        music.play();
    }
};