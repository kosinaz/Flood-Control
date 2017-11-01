var playState = {

    create: function () {

        // Build the UI
        this.buildUI();
    },

    update: function () {

        game.layer1.sort('y', Phaser.Group.SORT_ASCENDING);
    
    },

    buildUI: function () {

        game.layer0 = game.add.group();
        game.layer1 = game.add.group();
        // Create the map
        for (x = 0; x < 23; x += 1) {
            for (y = 0; y < 23; y += 1) {

                // The position of the current tile
                point = this.toIsometric(x, y);

                // Build the flooded areas       
                
                if (game.level[0].data[x + y * 23] > 68) {
                    
                    // Build and color the walls
                    game.add.image(point.x, point.y, 'tileset', game.level[0].data[x + y * 23], game.layer0).tint = Phaser.Color.getRandomColor(0, 127);

                    // Build and color the roof
                    game.add.image(point.x, point.y, 'tileset', game.level[0].data[x + y * 23] + 1, game.layer0).tint = Phaser.Color.getRandomColor(0, 127);

                    // Add the eyes and windows
                    game.add.image(point.x, point.y, 'tileset', game.level[0].data[x + y * 23] + 2, game.layer0);  
                    
                } else if (game.level[0].data[x + y * 23] > 0) {

                    // Build a street or intersection
                    game.add.image(point.x, point.y, 'tileset', game.level[0].data[x + y * 23] - 1, game.layer0);
                                       
                }

                // Build a building               
                if (game.level[1].data[x + y * 23] > 0) {
 
                    
                    // Build and color the walls
                    game.add.image(point.x, point.y, 'tileset', game.level[1].data[x + y * 23], game.layer1).tint = Phaser.Color.getRandomColor(127, 255);

                     // Build and color the roof
                    game.add.image(point.x, point.y, 'tileset', game.level[1].data[x + y * 23] + 1, game.layer1).tint = Phaser.Color.getRandomColor(0, 255);

                    // Add the eyes and windows
                    game.add.image(point.x, point.y, 'tileset', game.level[1].data[x + y * 23] + 2, game.layer1);  

                }                    
            }
        }

        point = this.toIsometric(10, 10);
        game.player = game.add.sprite(point.x, point.y, 'tileset', 32, game.layer1);
        game.player.tween = {};

        // Set up our controls.
        game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(this.move, this, 0, 96, -48);
        game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(this.move, this, 0, -96, 48);
        game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(this.move, this, 0, -96, -48);
        game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(this.move, this, 0, 96, 48);
     
    },

    move: function () {
        if (game.tweens.isTweening(game.player)) {
            return;
        }
        game.add.tween(game.player).to({
            x: game.player.x + arguments[1], 
            y: game.player.y + arguments[2]
        }, 300, Phaser.Easing.Cubic.InOut, true);
    },

    toIsometric: function (x, y) {
       return {
           x: (x - y) * 48 + 468,
           y: (x + y) * 24 - 300
       }
    }
};