var loadState = {
    preload: function () {

        /**
         * Load the images.
         */ 
        game.load.spritesheet('tileset', 'assets/tileset.png', 96, 96);
        game.load.spritesheet('menu', 'assets/menu.png', 100, 50);

        /**
         * Load the menu layout and level data.
         */ 
        game.load.json('menu', 'data/menu.json');
        game.load.json('level', 'data/level.json');
        game.load.json('level1', 'data/level1.json');
        game.load.json('level2', 'data/level2.json');
        game.load.json('level3', 'data/level3.json');
        game.load.json('level4', 'data/level4.json');
        game.load.json('level5', 'data/level5.json');

        /**
         * Load the music.
         */
        game.load.audio('music', 'assets/revolutionary.mp3');
    },
    create: function () {

        /**
         * Start the music.
         */
        game.music = game.add.audio('music', 0.3, true).play();

        /**
         * Set the background color.
         */
        game.stage.backgroundColor = "#147ab3";

        /**
         * Open the level selection menu.
         */
        game.state.start('menu');
    }
};