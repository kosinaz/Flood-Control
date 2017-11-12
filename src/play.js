var playState = {

    create: function () {

        // Set the map
        game.tiledMap = game.cache.getJSON('level');

        // Group the background layer to display everything else above it
        game.background = game.add.group();

        // Group the scene to make it depth sortable after each movement
        game.scene = game.add.group();

        // Store the barriers and refer to them later during movement
        game.barriers = [];

        game.map = new Map();

        game.waves = [];
        game.water = [];

        // Draw each tile of the background
        game.tiledMap.layers[0].data.forEach(this.drawBackground, this);

        // Draw each tile of the scene
        game.tiledMap.layers[1].data.forEach(this.drawScene, this);

        // Delay the flood
        //game.time.events.add(Phaser.Timer.SECOND * 10, this.startFlood, this);
    },

    /**
     * Draws all the elements of the map that won't be acted upon.
     * The streets and the already flooded, inpassable areas of the city.
     */
    drawBackground: function (tile, i) {

        // Draw the tile at the isometric counterpart of its specified position
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

        var x = this.iToX(i), y = this.iToY(i);

        if (tile > 68) {

            // If the tile is a house draw and color it part by part
            new House(x, y, 1, tile, tile + 1, tile + 2);

        } else if (tile === 37) {

            // If the tile is a dozer draw it and set it as the player
            game.player = new Actor(x, y, 1, tile - 1);

        } else if (tile === 33 || tile === 34) {

            // If the tile is a barrier draw it as is
            new Actor(x, y, 1, tile - 1);
        }
    },

    /**
     * Starts the flood by generating a wave actor on the top of the map and a
     * water actor behind each of it to make the raise of the water level 
     * seamless.
     */
    startFlood: function () {

        // Create a wave on each tile of the top of the map
        for (var i = 0; i < game.tiledMap.width; i += 1) {

            // Draw the wave
            game.waves.push(this.drawWave(45, i + game.tiledMap.width, 0, 1));

            // Draw the water behind the wave
            game.water.push(this.drawWave(61, i, 0, 1));
        }
    },

    /**
     * Draws the wave or water and sets its direction of movement based on its
     * tile in the tileset, map index of its position and the x and y distance 
     * of the original position of the wave and its destination.
     * For starting waves and waters xd will be 0 and yd will be 1.
     */
    drawWave: function (tile, i, xd, yd) {

        // Draw the wave or water based on the tile and map index
        var wave = this.drawActor(tile, i);

        // Extend the wave or water object with the x distance
        wave.xd = xd;

        // Extend the wave or water object with the y distance
        wave.yd = yd;

        // Return the extended wave or water object
        return wave;
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
    },

    /**
     * Move the towards the direction predefined for it and store its index in
     * waves for optional removal.
     */
    moveWave: function (wave, i) {

        var x, y;

        // If the wave reached a house or a barrier continue with the next wave
        if (wave === null) {
            return false;
        }

        // If the wave is already moving leave it moving
        if (game.tweens.isTweening(wave.image)) {
            return false;
        }

        // Determine the path of the wave based on its predefined direction
        x = wave.x + wave.xd;
        y = wave.y + wave.yd;


        // If there is a house or barrier in front of the wave remove it
        if (this.blocks(x, y)) {

            // Delay the removal of the wave with the tween time of the water
            game.time.events.add(Phaser.Timer.SECOND * 1, this.removeWave, {
                i: i
            });
            return false;
        }

        // Update the position of the wave and its image
        this.moveActor(wave, x, y, 1000);
    },

    /**
     * Returns true if a house or a barrier can be found in the specified 
     * position of the map.
     * This comes handy when it should be decided if the tile is passable by 
     * the wave or not.
     */
    blocks: function (x, y) {
        return game.tiledMap.layers[1].data[this.XYToI(x, y)] > 67 ||
            this.getBarrier(x, y) !== -1;
    },

    /**
     * Remove a wave based on the array of waves and the index of wave to be
     * removed passed in the this object of the callee. 
     */
    removeWave: function () {

        // Hide the image of the wave
        game.waves[this.i].image.kill();

    },

    /**
     * Moves the water like a wave but raises the water level behind it.
     */
    moveWater: function (water, i) {

        var x, y;

        // If the water is already moving leave it moving
        if (game.tweens.isTweening(water.image)) {
            return false;
        }

        // Determine the path of the water based on its predefined direction
        x = water.x + water.xd;
        y = water.y + water.yd;


        // If there is a house or barrier in front of the water stop it
        if (this.blocks(x, y)) {
            return false;
        }

        // Update the position of the water and its image
        this.moveActor(water, x, y, 1000);

        // Leave a raised water behind
        this.drawTile(60, this.XYToI(water.x, water.y - 1), game.scene);
    }
};