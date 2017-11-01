var playState = {

    create: function () {

        this.drawLevel();
        this.initPlayer();
    },

    drawLevel: function () {

        // Set the level
        game.level = game.cache.getJSON('level');

        // Draw each tile of the first layer of the level and group them
        game.level.layers[0].data.forEach(this.drawTile, {
            layer: game.add.group(),
            toIso: this.toIso, 
            width: game.level.layers[0].width
        });
        
        // Draw each tile of the second layer of the level and group them
        game.level.layers[1].data.forEach(this.drawTile, {
            layer: game.actors = game.add.group(),
            toIso: this.toIso, 
            width: game.level.layers[1].width
        });
    },

    drawTile: function (tile, i) {
        
        // Translate the tile map into 2 dimensions
        var x = i % this.width, y = Math.floor(i / this.width);

        // Draw the tile at the isometric counterpart of its specified position
        game.add.image(
            this.toIso(x, y).x,
            this.toIso(x, y).y, 
            'tileset', 
            tile - 1, 
            this.layer
        );
    },
    
    toIso: function (x, y) {
        
        // Translate the coordinates into isometric with an offset
        return {
            x: (x - y) * 48 + 468,
            y: (x + y) * 24 - 300
        }
    },

    initPlayer: function () {

        // Add the player
        game.player = game.add.sprite(
            this.toIso(10, 10).x, 
            this.toIso(10, 10).y, 
            'tileset', 32, 
            game.actors
        );

        // Set the move up button
        game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(
            this.move, 
            this, 
            0, 
            96, 
            -48
        );

        // Set the move down button
        game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(
            this.move, 
            this, 
            0, 
            -96, 
            48
        );
        
        // Set the move left button
        game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(
            this.move, 
            this, 
            0, 
            -96, 
            -48
        );
        
        // Set the move right button
        game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(
            this.move, 
            this, 
            0, 
            96, 
            48
        );
    },

    move: function () {

        // If the player is already moving ignore the input
        if (game.tweens.isTweening(game.player)) {
            return;
        }

        // Move the player to the specified direction
        game.add.tween(game.player).to({
            x: game.player.x + arguments[1], 
            y: game.player.y + arguments[2]
        }, 300, Phaser.Easing.Cubic.InOut, true);
    },

    update: function () {

        // Draw the overlapping actors in the correct order
        game.actors.sort('y', Phaser.Group.SORT_ASCENDING);
    }
};