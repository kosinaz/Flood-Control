var playState = {

    create: function () {

        /**
         * Load the map data.
         */
        this.tiledMap = game.cache.getJSON('level' + game.currentLevel);

        /**
         * Group the background layer to display everything else above it.
         */ 
        this.background = game.add.group();

        /**
         * Group the scene to make it depth sortable after each movement.
         */
        this.scene = game.add.group();

        /**
         * Store all tiles, houses and actors of the current map.
         */ 
        this.map = new Map();

        /**
         * Draw each tile of the background.
         */ 
        this.tiledMap.layers[0].data.forEach(this.drawBackground, this);

        /**
         * Draw each tile of the scene.
         */ 
        this.tiledMap.layers[1].data.forEach(this.drawScene, this);

        /**
         * Delay the flood.
         */
        this.timer = game.time.create(false),
        this.timer.add(Phaser.Timer.SECOND * 59, this.startFlood, this);
        this.timer.start();

        /**
         * Set the timer text.
         */
        this.timerLabel = game.add.text(40, 40, '0:00', {
            font: 'bold 30pt Arial',
            fill: '#fff'
        });

        /**
         * Set the fast forward button.
         */
        this.skipButton = game.add.text(130, 40, '⏩', {
            font: 'bold 30pt Arial',
            fill: '#f00'
        });
        this.skipButton.inputEnabled = true;
        this.skipButton.events.onInputUp.add(this.skip, this);
    },

    /**
     * Draws all the elements of the map that won't be acted upon.
     * The streets and the already flooded, inpassable areas of the city.
     */
    drawBackground: function (tile, i) {

        /**
         * Draw the tile at the isometric counterpart of its specified position.
         */ 
        new Tile(this.iToX(i), this.iToY(i), 0, tile - 1);
    },

    /** 
     * Translates a 1-dimensional index into an x coordinate of a 2-dimensional
     * map.
     * This function comes handy when a Tiled map, that stores the map data in
     * a 1-dimensional array, needs to be displayed in 2-dimensions.
     * It is used in drawBackground and drawScene.
     */
    iToX: function (i) {
        return i % this.tiledMap.width;
    },

    /** 
     * Translates a 1-dimensional index into an y coordinate of a 2-dimensional
     * map.
     * This function comes handy when a Tiled map, that stores the map data in
     * a 1-dimensional array, needs to be displayed in 2-dimensions.
     */
    iToY: function (i) {
        return Math.floor(i / this.tiledMap.width);
    },

    /**
     * Draws all the elements of the map that will be acted upon somehow.
     * The houses that will block the player and the flood's movement.
     * The player itself that will push the walls to the correct places.
     * And the walls the will stop the flood.
     */
    drawScene: function (tile, i) {

        /**
         * Set the tile at the isometric counterpart of its specified position.
         */
        var x = this.iToX(i), y = this.iToY(i);

        if (tile > 68) {

            /**
             * If the tile is a house draw and color it part by part.
             */ 
            new House(x, y, 1, tile, tile + 1, tile + 2);

        } else if (tile === 53) {

            /**
             * If the tile is a dozer draw it and set it as the player.
             */ 
            game.player = new Actor(x, y, 1, tile - 1);

        } else if (tile === 33 || tile === 34) {

            /**
             * If the tile is a wall draw it as is.
             */ 
            new Actor(x, y, 1, tile - 1);
        }
    },

    /**
     * Starts the flood by generating a wave actor on the top of the map and a
     * water actor behind each of it to make the raise of the water level 
     * seamless.
     */
    startFlood: function () {

        /**
         * Create a wave on each tile of the top of the map.
         */ 
        for (var i = 0; i < this.tiledMap.width; i += 1) {

            /**
             * Create the wave.
             */ 
             new Wave(i, 0, 0, 1, 44);
        }
    },

    update: function () {

        /**
         * Update the seconds left until the flood.
         */
        var seconds = Math.ceil(this.timer.duration / 1000);
        this.timerLabel.text = '0:' + (seconds < 10 ? '0' : '') + seconds;

        /**
         * Draw the overlapping actors in the correct order.
         */ 
        this.scene.sort('y', Phaser.Group.SORT_ASCENDING);

        /**
         * If the player is already moving ignore the input.
         */ 
        if (game.tweens.isTweening(game.player.image)) {
            return false;
        }

        /**
         * Set the movement buttons.
         */ 
        if (game.input.keyboard.isDown(Phaser.KeyCode.UP)) {

            /**
             * Set the move up button.
             */ 
            game.player.move(0, -1, 54);

        } else if (game.input.keyboard.isDown(Phaser.KeyCode.DOWN)) {

            /**
             * Set the move down button.
             */ 
            game.player.move(0, 1, 52);

        } else if (game.input.keyboard.isDown(Phaser.KeyCode.LEFT)) {

            /**
             * Set the move left button.
             */ 
            game.player.move(-1, 0, 55);

        } else if (game.input.keyboard.isDown(Phaser.KeyCode.RIGHT)) {

            /**
             * Set the move right button.
             */ 
            game.player.move(1, 0, 53);
        }        
    },

    skip: function () {
        this.timer.stop(true);
        this.startFlood();
    },

    lose: function () {

        /**
         * Return to the menu.
         */
        game.state.start('menu');
    },

    win: function () {

        /**
         * Unlock the next level if needed.
         */
        game.progress = Math.max(game.progress, game.currentLevel + 1);

        /**
         * Return to the menu.
         */
        game.state.start('menu');
    }
}