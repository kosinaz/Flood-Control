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
        game.time.events.add(Phaser.Timer.SECOND * 10, this.startFlood, this);
    },

    /**
     * Draws all the elements of the map that won't be acted upon.
     * The streets and the already flooded, inpassable areas of the city.
     */ 
    drawBackground: function (tile, i) {
         
        // Draw the tile at the isometric counterpart of its specified position
        game.map.setXY(
            this.iToX(i), 
            this.iToY(i),
            new Tile(this.iToX(i), this.iToY(i), tile - 1, game.background)
        );
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
     * Translates a 2-dimensional position into a 1-dimensional index of a map.
     * This function comes handy when a position of Tiled map, that stores the 
     * map data in a 1-dimensional array, needs to be checked or updated.
     */
    XYToI: function (x, y) {
        return x + y * game.tiledMap.width;
    },

     /** 
     * Translates a 1-dimensional index into an isometric x coordinate of a 
     * 2-dimensional map and positions it to the middle of the screen.
     * This function comes handy when an isometric Tiled map, that stores the 
     * map data in a 1-dimensional array, needs to be displayed in isometric
     * 2-dimensions.
     */
    iToIsoX: function (i) {
        return ((i % game.tiledMap.width) - Math.floor(i / game.tiledMap.width)) * 
            game.tiledMap.tilewidth / 2 + game.tiledMap.tilewidth / 2 * 
            game.tiledMap.width / 2 - game.tiledMap.tilewidth / 2;
    },

    /** 
     * Translates a 1-dimensional index into an isometric y coordinate of a 
     * 2-dimensional map and positions it to the middle of the screen.
     * This function comes handy when an isometric Tiled map, that stores the 
     * map data in a 1-dimensional array, needs to be displayed in isometric
     * 2-dimensions.
     */
    iToIsoY: function (i) {
        return ((i % game.tiledMap.width) + Math.floor(i / game.tiledMap.height)) * 
            game.tiledMap.tileheight / 2 - game.tiledMap.tileheight / 2 * 
            game.tiledMap.height / 2 + game.tiledMap.tileheight / 2;
    },

    /** 
     * Translates an x and y coordinate of a 2-dimensional position into an 
     * isometric x coordinate of a 2-dimensional map and positions it to the 
     * middle of the screen.
     * This function comes handy when a 2-dimensional position needs to be 
     * displayed in isometric 2-dimensions.
     */
    XYToIsoX: function (x, y) {
        return (x - y) * game.tiledMap.tilewidth / 2 + game.tiledMap.tilewidth / 2 * 
            game.tiledMap.width / 2 - game.tiledMap.tilewidth / 2;
    },

    /** 
     * Translates an x and y coordinate of a 2-dimensional position into an 
     * isometric y coordinate of a 2-dimensional map and positions it to the 
     * middle of the screen.
     * This function comes handy when a 2-dimensional position needs to be 
     * displayed in isometric 2-dimensions.
     */
    XYToIsoY: function (x, y) {
        return (x + y) * game.tiledMap.tileheight / 2 - game.tiledMap.tileheight / 2 * 
            game.tiledMap.height / 2 + game.tiledMap.tileheight / 2;
    },

    /**
     * Draws the tile at the isometric counterpart of its specified position 
     * and adds it to the specified group.
     * This function simplifies the usual draw method by setting a default
     * isometric translation, tileset, and anchor.
     * Group is necessary to depth sort the tiles, when the player starts to
     * move behind the houses.
     */
    drawTile: function (tile, i, group) {

        // Draw the image to the isometric coordinates
        var image = game.add.image(
            this.iToIsoX(i),
            this.iToIsoY(i),
            'tileset', 
            tile, 
            group
        );

        // Set the anchor to the middle for easier positioning
        image.anchor.setTo(0.5, 0.5);

        // Return the image to make the optional coloring possible
        return image;
    },

    /**
     * Draws all the elements of the map that will be acted upon somehow.
     * The houses that will block the player and the flood's movement.
     * The player itself that will push the barriers to the correct places.
     * And the barriers the will stop the flood.
     */ 
    drawScene: function (tile, i) {

        if (tile > 68) { 

            // If the tile is a house draw and color it part by part
            this.drawHouse(tile, i);

        } else if (tile === 37) {

            // If the tile is a dozer draw it and set it as the player
            game.player = this.drawActor(tile, i);

        } else if (tile === 33 || tile === 34) {

            // If the tile is a barrier draw it as is and add to the barriers
            game.barriers.push(this.drawActor(tile, i));
        }
    },

    /**
     * Draws the houses using the three parts that can be found next to house
     * placeholder in the tileset. The first two parts will be colored randomly,
     * and the last part will be drawn as is.
     */ 
    drawHouse: function (tile, i) {

        // Pick a random color hue
        var color = Phaser.Color.HSLtoRGB(Math.random(), 1, 0.5);

        // Draw and color the wall
        this.drawTile(tile, i, game.scene).tint = 
            Phaser.Color.createColor(color.r, color.g, color.b).color;

        // Draw and color the roof with a different color
        this.drawTile(tile + 1, i, game.scene).tint = 
            Phaser.Color.createColor(color.g, color.b, color.r).color;

        // Draw the rest
        this.drawTile(tile + 2, i, game.scene);
    },
    
    /**
     * Draws the actor based on the index of its tile in the tileset and the
     * index of its position in the map stored in a 1-dimensional array. 
     * Also adds the actor to the specificed group and stores the 
     * 2-dimenstional coordinates of its original position.
     * Finally returns the prepared object for further manipulations.
     */ 
    drawActor: function (tile, i) {
        return {
            image: this.drawTile(tile - 1, i, game.scene),
            x: this.iToX(i),
            y: this.iToY(i)
        }
    },

    /**
     * Move the player to a nearby position based on the x and y distance of
     * the original position of the player and its destination, also draw the
     * proper tile of the player based on its direction.
     * The player's original position is already stored, and the player can
     * move either to next or previous x or y position, so one of the 
     * parameters will be always 0.
     */
    movePlayer: function (xd, yd, tile) {

        // Determine the path of the player 
        var x = game.player.x + xd, y = game.player.y + yd;

        // If the player is already moving ignore the input
        if (game.tweens.isTweening(game.player.image)) {
            return false;
        }

        // If there is no street in the way ignore the input
        if (!game.map.getXY(x, y).isStreet()) {
            return false;
        }

        // If there is a barrier in the way push the barrier
        if(!this.moveBarrier(this.getBarrier(x, y), xd, yd)) {
            return false;
        }
    
        // Move the player to the specified position
        game.player.x = x;
        game.player.y = y;
        
        // Face the sprite to the specified direction
        game.player.image.frame = tile;
        
        // Update the position of the player and its image
        this.moveActor(game.player, x, y, 200);
        
        return true;
    },

    /**
     * Iterates through all the barriers and returns the index of the barrier 
     * that can be found in the specified position of the map.
     * The index is necessary to move the barrier.
     */
    getBarrier: function (x, y) {
        for (var i = 0; i < game.barriers.length; i += 1) {
            if (game.barriers[i].x === x && game.barriers[i].y === y) {
                return i;
            }
        }
        return -1;
    },

    /**
     * Move the barrier indexed i to a nearby position based on the x and y 
     * distance of the original position of the barrier and its destination in
     * a specified time.
     * The barrier's original position is already stored, and the barrier can
     * move either to next or previous x or y position, so one of the 
     * parameters will be always 0.
     * The specification of time is necessary, because the player and barrier
     * moves faster than the wave and water.
     */
    moveBarrier: function (i, xd, yd) {
        
        var x, y; 

        // If there is no barrier let the player move
        if (i === -1) {
            return true;
        }
        
        // Determine the path of the barrier indexed i
        x = game.barriers[i].x + xd; 
        y = game.barriers[i].y + yd;
        
        // If there is no street in the way ignore the input
        if (!game.map.getXY(x, y).isStreet()) {
            return false;
        }
        
        // If there is a barrier in the way ignore the input
        if (this.getBarrier(x, y) !== -1) {
            return false;
        } 

        // Update the position of the barrier and its image
        this.moveActor(game.barriers[i], x, y, 200);
        
        // Let the player move
        return true;
    },

    /**
     * Update the position of the actor and its image to let the game display 
     * and calculate with the current positon of the actor.
     */
    moveActor: function (actor, x, y, time) {

        // Move the actor to the specified position
        actor.x = x;
        actor.y = y;
        
        // Move the image of the actor to the specified position
        game.add.tween(actor.image).to({
            x: this.XYToIsoX(x, y), 
            y: this.XYToIsoY(x, y)
        }, time, Phaser.Easing.None, true);
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

        // Set the movement buttons
        if (game.input.keyboard.isDown(Phaser.KeyCode.UP)) {

            // Set the move up button
            this.movePlayer(0, -1, 38);

        } else if (game.input.keyboard.isDown(Phaser.KeyCode.DOWN)) {

            // Set the move down button
            this.movePlayer(0, 1, 36);

        } else if (game.input.keyboard.isDown(Phaser.KeyCode.LEFT)) {

            // Set the move left button
            this.movePlayer(-1, 0, 39);

        } else if (game.input.keyboard.isDown(Phaser.KeyCode.RIGHT)) {

            // Set the move right button
            this.movePlayer(1, 0, 37);
        }

        // If there is any wave on the map move it
        if (game.waves.length) {
            game.waves.forEach(this.moveWave, this);
        }

        // If there is any water on the map move it
        if (game.water.length) {
            game.water.forEach(this.moveWater, this);
        }

        // Draw the overlapping actors in the correct order
        game.scene.sort('y', Phaser.Group.SORT_ASCENDING);
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