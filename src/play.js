var playState = {

    create: function () {

        // Set the level
        game.level = game.cache.getJSON('level');
        game.barriers = [];
        game.waves = [];
        game.water = [];

        // Draw each tile of the first layer of the level and group them
        game.level.layers[0].data.forEach(this.drawTile, {
            layer: game.add.group(),
            toIso: this.toIso, 
            width: game.level.layers[0].width
        });
        
        // Draw each tile of the second layer of the level and group them
        game.actors = game.add.group();
        game.level.layers[1].data.forEach(this.drawTile, {
            group: game.actors,
            toIso: this.toIso, 
            width: game.level.layers[1].width
        });

        // Draw and set each actor of the third layer of the level
        game.level.layers[2].data.forEach(this.setActor, {
            group: game.actors,
            toIso: this.toIso, 
            width: game.level.layers[2].width
        });    

        // Delay the flood
        game.time.events.add(Phaser.Timer.SECOND * 1, this.startFlood, this);
    },

    drawTile: function (tile, i) {
        
        // Translate the tile map into 2 dimensions
        var x = i % this.width, y = Math.floor(i / this.width), color, tint;
        
        // If there is nothing to draw continue with the the next tile
        if (!tile) {
            return;
        }
        
        // If the tile is not a building draw it as is
        if (tile < 69) {
            
            // Draw the tile at the isometric counterpart of its specified position
            game.add.image(
                this.toIso(x, y).x,
                this.toIso(x, y).y, 
                'tileset', 
                tile - 1, 
                this.group
            );

        // Else draw and color each part of the building
        } else {

            // Pick a random color hue
            color = Phaser.Color.HSLtoRGB(Math.random(), 1, 0.5);

            // Draw and color the wall
            game.add.image(
                this.toIso(x, y).x,
                this.toIso(x, y).y, 
                'tileset', 
                tile, 
                this.group
            ).tint = Phaser.Color.createColor(color.r, color.g, color.b).color;

            // Draw and color the roof with a different color
            game.add.image(
                this.toIso(x, y).x,
                this.toIso(x, y).y, 
                'tileset', 
                tile + 1, 
                this.group
            ).tint = Phaser.Color.createColor(color.g, color.b, color.r).color;

            // Draw the rest
            game.add.image(
                this.toIso(x, y).x,
                this.toIso(x, y).y, 
                'tileset', 
                tile + 2, 
                this.group
            );

        }
    },
    
    toIso: function (x, y) {
        
        // Translate the coordinates into isometric with an offset
        return {
            x: (x - y) * 48 + 468,
            y: (x + y) * 24 - 300
        }
    },

    setActor: function (tile, i) {

        // Translate the tile map into 2 dimensions
        var x = i % this.width, y = Math.floor(i / this.width), sprite;

        // If there is nothing to draw continue with the the next tile
        if (!tile) {
            return;
        }

        // Draw the actor at the isometric counterpart of its specified position
        sprite = game.add.sprite(
            this.toIso(x, y).x,
            this.toIso(x, y).y, 
            'tileset', 
            tile - 1, 
            this.group
        );

        // Set the player
        if (tile === 37) {
            game.player = {
                x: x,
                y: y,
                sprite: sprite
            }
        } 
        
        // Set the barrier
        if (tile === 33 || tile === 34) {
            game.barriers.push({
                x: x,
                y: y,
                sprite: sprite
            });
        }
    },

    movePlayer: function (xd, yd, tile) {

        // Determine the path of the player 
        var i;
        x = game.player.x + xd;
        y = game.player.y + yd;

        // If the player is already moving ignore the input
        if (game.tweens.isTweening(game.player.sprite)) {
            return false;
        }

        // If there is a building in the way ignore the input
        if (game.level.layers[1].data[x + y * game.level.layers[1].width]) {
            return false;
        }
        
        // If there is a barrier in the way push the barrier
        for (i = 0; i < game.barriers.length; i += 1) {
            if (x === game.barriers[i].x && y === game.barriers[i].y) {
                if(!this.moveBarrier(i, xd, yd)) {
                    return false;
                }
            }
        }    
    
        // Move the player to the specified position
        game.player.x = x;
        game.player.y = y;
        
        // Face the sprite to the specified direction
        game.player.sprite.frame = tile;
        
        // Move the sprite of the player to the specified position
        game.add.tween(game.player.sprite).to({
            x: this.toIso(x, y).x, 
            y: this.toIso(x, y).y
        }, 200, Phaser.Easing.None, true);
        
        return true;
    },

    moveBarrier: function (i, xd, yd) {
        
    // Determine the path of the barrier 
    var 
        j,
        x = game.barriers[i].x + xd,
        y = game.barriers[i].y + yd;
        
        // If there is a building in the way ignore the input
        if (game.level.layers[1].data[x + y * game.level.layers[1].width]) {
            return false;
        }
        
        // If there is a barrier in the way ignore the input
        for (j = 0; j < game.barriers.length; j += 1) {
            if (x === game.barriers[j].x && y === game.barriers[j].y) {
                return false;
            }
        }   
        
        // Move the barrier to the specified position
        game.barriers[i].x = x;
        game.barriers[i].y = y;
        
        // Move the sprite of the barrier to the specified position
        game.add.tween(game.barriers[i].sprite).to({
            x: this.toIso(x, y).x, 
            y: this.toIso(x, y).y
        }, 200, Phaser.Easing.None, true);
        
        return true;
    },

    startFlood: function () {

        var x, sprite;

        // Create a wave on each tile of the upper border of the level
        for (x = 0; x < game.level.layers[1].width; x += 1) {

            // Draw the wave
            sprite = game.add.sprite( 
                this.toIso(x, 0).x,
                this.toIso(x, 0).y, 
                'tileset', 
                44, 
                game.actors
            );

            // Set the wave
            game.waves.push({
                x: x,
                y: 0,
                sprite: sprite
            });

            // Draw the water behind the wave
            sprite = game.add.sprite( 
                this.toIso(x, -1).x,
                this.toIso(x, -1).y, 
                'tileset', 
                60, 
                game.actors
            );

            // Set the water behind the wave
            game.water.push({
                x: x,
                y: -1,
                sprite: sprite
            });
        }
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

        // If there is any wave on the level move it
        if (game.waves.length) {
            game.waves.forEach(this.moveWave, this);
        }

        // If there is any water on the level move it
        if (game.water.length) {
            game.water.forEach(this.moveWater, this);
        }

        // Draw the overlapping actors in the correct order
        game.actors.sort('y', Phaser.Group.SORT_ASCENDING);
    },

    moveWave: function (wave) {

        var i;

        // If the wave is already moving ignore the input
        if (game.tweens.isTweening(wave.sprite)) {
            return false;
        }

        // If there is a building in the way ignore the input
        if (game.level.layers[1].data[wave.x + (wave.y + 1) * game.level.layers[1].width] > 67) {
            return false;
        }
        
        // If there is a barrier in the way ignore the input
        for (i = 0; i < game.barriers.length; i += 1) {
            if (wave.x === game.barriers[i].x && wave.y + 1 === game.barriers[i].y) {
                return false;
            }
        }    
    
        // Move the wave to the specified position
        wave.y += 1;
        
        // Move the sprite of the wave to the specified position
        game.add.tween(wave.sprite).to({
            x: this.toIso(wave.x, wave.y).x, 
            y: this.toIso(wave.x, wave.y).y
        }, 1000, Phaser.Easing.None, true);
        
        return true;
    },

    moveWater: function (water) {
        
        var i;

        // If the water is already moving ignore the input
        if (game.tweens.isTweening(water.sprite)) {
            return false;
        }

        // If there is a building in the way ignore the input
        if (game.level.layers[1].data[water.x + (water.y + 1) * game.level.layers[1].width] > 67) {
            return false;
        }
        
        // If there is a barrier in the way ignore the input
        for (i = 0; i < game.barriers.length; i += 1) {
            if (water.x === game.barriers[i].x && water.y + 1 === game.barriers[i].y) {
                return false;
            }
        }    

        // Leave a raised water behind
        game.add.image(
            this.toIso(water.x, water.y).x,
            this.toIso(water.x, water.y).y, 
            'tileset', 
            60, 
            game.actors
        );
    
        // Move the water to the specified position
        water.y += 1;
        
        // Move the sprite of the water to the specified position
        game.add.tween(water.sprite).to({
            x: this.toIso(water.x, water.y).x, 
            y: this.toIso(water.x, water.y).y
        }, 1000, Phaser.Easing.None, true);
        
        return true;
    }
};