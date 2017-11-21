var loadState = {
    preload: function () {

        /**
         * Load the images.
         */ 
        game.load.spritesheet('tileset', 'assets/tileset.png', 96, 96);
        game.load.spritesheet('menu', 'assets/menu.png', 100, 50);
        game.load.image('title', 'assets/title.png');

        /**
         * Load the menu layout and level data.
         */ 
        game.load.json('menu', 'data/menu.json');
        game.load.json('level1', 'data/level1.json');
        game.load.json('level2', 'data/level2.json');
        game.load.json('level3', 'data/level3.json');
        game.load.json('level4', 'data/level4.json');
        game.load.json('level5', 'data/level5.json');
        game.load.json('level6', 'data/level6.json');
        game.load.json('level7', 'data/level7.json');
        game.load.json('level8', 'data/level8.json');
        game.load.json('level9', 'data/level9.json');
        game.load.json('level10', 'data/level10.json');
        game.load.json('level11', 'data/level11.json');
        game.load.json('level12', 'data/level12.json');
        game.load.json('level13', 'data/level13.json');
        game.load.json('level14', 'data/level14.json');
        game.load.json('level15', 'data/level15.json');
        game.load.json('level16', 'data/level16.json');
        game.load.json('level17', 'data/level17.json');
        game.load.json('level18', 'data/level18.json');
        game.load.json('level19', 'data/level19.json');
        game.load.json('level20', 'data/level20.json');

        /**
         * Load the music.
         */
        game.load.audio('music', [
            //'assets/revolutionary.mp3',
            'assets/revolutionary.ogg',
            'assets/revolutionary.m4a'
        ]);
    },
    create: function () {

        /**
         * Start the music.
         */
        game.music = game.add.audio('music', 0.3, true).play();

        /**
         * Set the background color.
         */
        game.stage.backgroundColor = "#0084c8";

        /**
         * Load the player's progress.
         */
        GJAPI.DataStoreFetch(
            GJAPI.DATA_STORE_USER, 
            "progress", 
            function (pResponse) {
                if (pResponse.success) {
                    game.progress = pResponse.data;
                }
                
                /**
                 * Open the level selection menu.
                 */
                game.state.start('menu');
            }
        );
    }
};