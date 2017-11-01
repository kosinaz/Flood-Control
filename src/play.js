var playState = {

    create: function () {

        this.drawLevel();
        this.setControls();
        //this.initBarriers();
    },

    drawLevel: function () {

        // Set the level
        game.level = game.cache.getJSON('level');
        game.barriers = [];

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
    },

    drawTile: function (tile, i) {
        
        // Translate the tile map into 2 dimensions
        var x = i % this.width, y = Math.floor(i / this.width);
        
        // If there is nothing to draw continue with the the next tile
        if (!tile) {
            return;
        }
        
        // Draw the tile at the isometric counterpart of its specified position
        game.add.image(
            this.toIso(x, y).x,
            this.toIso(x, y).y, 
            'tileset', 
            tile - 1, 
            this.group
        );
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

    setControls: function () {

        // Set the move up button
        game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(
            this.movePlayer, 
            this, 
            0, 
            0, 
            -1,
            38
        );

        // Set the move down button
        game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(
            this.movePlayer, 
            this, 
            0, 
            0, 
            1,
            36
        );
        
        // Set the move left button
        game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(
            this.movePlayer, 
            this, 
            0, 
            -1, 
            0,
            39
        );
        
        // Set the move right button
        game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(
            this.movePlayer, 
            this, 
            0, 
            1, 
            0,
            37
        );
    },

    movePlayer: function () {

        // Determine the path of the player 
        var 
            i,
            x = game.player.x + arguments[1],
            y = game.player.y + arguments[2];

        // If the player is already moving ignore the input
        if (game.tweens.isTweening(game.player.sprite)) {
            return false;
        }

        // If there is a building in the way ignore the input
        if (game.level.layers[1].data[x + y * 23] !== 1) {
            return false;
        }

        // If there is a barrier in the way push the barrier
        for (i = 0; i < game.barriers.length; i += 1) {
            if (x === game.barriers[i].x && y === game.barriers[i].y) {
                if(!this.moveBarrier(i, arguments[1], arguments[2])) {
                    return false;
                }
            }
        }       

        // Move the player to the specified position
        game.player.x = x;
        game.player.y = y;

        // Face the sprite to the specified direction
        game.player.sprite.frame = arguments[3];

        // Move the sprite of the player to the specified position
        game.add.tween(game.player.sprite).to({
            x: this.toIso(x, y).x, 
            y: this.toIso(x, y).y
        }, 200, Phaser.Easing.Cubic.InOut, true);

        return true;
    },

    moveBarrier: function (i, x, y) {
        // Determine the path of the barrier 
        var 
            j,
            x = game.barriers[i].x + arguments[1],
            y = game.barriers[i].y + arguments[2];

        // If there is a building in the way ignore the input
        if (game.level.layers[1].data[x + y * 23] !== 1) {
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
        }, 200, Phaser.Easing.Cubic.InOut, true);

        return true;
    },

    update: function () {

        // Draw the overlapping actors in the correct order
        game.actors.sort('y', Phaser.Group.SORT_ASCENDING);
    }
};