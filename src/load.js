var loadState = {
    preload: function () {

        // Create a loading text
        game.add.text(10, 10, 'loading...', {fill: '#fff'});

        // Load the tileset
        game.load.spritesheet('tileset', 'assets/tileset.png', 40, 40);

        // Load the level data
        game.load.json('levels', 'data/levels.json');
    },
    create: function () {

        // Store the levels
        game.levels = game.cache.getJSON('levels');

        // Start the main menu
        game.state.start('menu');
    }
};