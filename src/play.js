var playState = {

    create: function () {

        /**
         * Set the map.
         */ 
        game.tiledMap = game.cache.getJSON('level');

        /**
         * Group the background layer to display everything else above it.
         */ 
        game.background = game.add.group();

        /**
         * Group the scene to make it depth sortable after each movement.
         */
        game.scene = game.add.group();

        /**
         * Store all tiles, houses and actors of the current map.
         */ 
        game.map = new Map();

        /**
         * Draw each tile of the background.
         */ 
        game.tiledMap.layers[0].data.forEach(this.drawBackground, this);

        /**
         * Draw each tile of the scene.
         */ 
        game.tiledMap.layers[1].data.forEach(this.drawScene, this);

        /**
         * Delay the flood.
         */ 
        game.time.events.add(Phaser.Timer.SECOND * 30, this.startFlood, this);
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
        return i % game.tiledMap.width;
    },

    /** 
     * Translates a 1-dimensional index into an y coordinate of a 2-dimensional
     * map.
     * This function comes handy when a Tiled map, that stores the map data in
     * a 1-dimensional array, needs to be displayed in 2-dimensions.
     */
    iToY: function (i) {
        return Math.floor(i / game.tiledMap.width);
    },

    /**
     * Draws all the elements of the map that will be acted upon somehow.
     * The houses that will block the player and the flood's movement.
     * The player itself that will push the barriers to the correct places.
     * And the barriers the will stop the flood.
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

        } else if (tile === 37) {

            /**
             * If the tile is a dozer draw it and set it as the player.
             */ 
            game.player = new Actor(x, y, tile - 1);

        } else if (tile === 33 || tile === 34) {

            /**
             * If the tile is a barrier draw it as is.
             */ 
            new Actor(x, y, tile - 1);
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
        for (var i = 0; i < game.tiledMap.width; i += 1) {

            /**
             * Create the wave.
             */ 
             new Wave(i, 0, 0, 1, 44);
        }
    },

    update: function () {

        // Draw the overlapping actors in the correct order
        game.scene.sort('y', Phaser.Group.SORT_ASCENDING);

        // If the player is already moving ignore the input
        if (game.tweens.isTweening(game.player.image)) {
            return false;
        }

        // Set the movement buttons
        if (game.input.keyboard.isDown(Phaser.KeyCode.UP)) {

            // Set the move up button
            game.player.move(0, -1, 38);

        } else if (game.input.keyboard.isDown(Phaser.KeyCode.DOWN)) {

            // Set the move down button
            game.player.move(0, 1, 36);

        } else if (game.input.keyboard.isDown(Phaser.KeyCode.LEFT)) {

            // Set the move left button
            game.player.move(-1, 0, 39);

        } else if (game.input.keyboard.isDown(Phaser.KeyCode.RIGHT)) {

            // Set the move right button
            game.player.move(1, 0, 37);
        }        
    }
}