var playState = {

    // Store the countdown timer object
    countdownTimer: {},

    // Store the barricade counter object
    barricadeCounter: {},

    // Store the timer object
    timer: {},

    // Store the level data
    level: [],

    // Store the level image objects
    levelImage: [],

    // Store the streets suitable for barricades
    streets: [],

    create: function () {

        var delay = 6000;

        // Set the number of buildable barricades
        game.barricades = 4;

        // Clone the current level data for further manipulations
        level = function () {
            var x, y, level = [];
            for (x = 0; x < game.levels[game.currentLevel].length; x += 1) {
                level[x] = [];
                for (y = 0; y < game.levels[game.currentLevel].length; y += 1) {
                    level[x][y] = game.levels[game.currentLevel][x][y];
                }
            }
            return level;
        }();

        // Create a timer to delay the flood
        timer = game.time.create(false);

        // Start the flood after a short delay
        timer.add(delay, function () {

            var i, timer;

            // Fill the borders with water
            for (i = 0; i < level.length; i += 1) {

                // Set the left border
                level[0][i] = 3;
                this.levelImage[0][i].frame = 5;

                // Set the right border
                level[level.length - 1][i] = 3;
                this.levelImage[level.length - 1][i].frame = 5;

                // Set the top border
                level[i][0] = 3;
                this.levelImage[i][0].frame = 5;

                // Set the bottom border
                level[i][level.length - 1] = 3;
                this.levelImage[i][level.length - 1].frame = 5;
            }

            // Create a timer to update the flood
            timer = game.time.create(false);

            // Update the flood with a certain amount of speed
            timer.loop(500, function () {

                var x, y, floodContinues = false;

                // Mark every street that is next to the water
                for (x = 1; x < level.length - 1; x += 1) {
                    for (y = 1; y < level.length - 1; y += 1) {
                        level[x][y] = level[x][y] === 1 && (
                            level[x + 1][y] === 3 ||
                            level[x - 1][y] === 3 ||
                            level[x][y + 1] === 3 ||
                            level[x][y - 1] === 3) ? 4 : level[x][y];
                    }
                }

                // Fill the marked areas with water
                for (x = 0; x < level.length; x += 1) {
                    for (y = 0; y < level[0].length; y += 1) {
                        if (level[x][y] === 4) {

                            level[x][y] = 3;
                            this.levelImage[x][y].frame = 5;
                            floodContinues = true;
                        }
                    }
                }

                // If there are no more streets to flood finish the level
                if (floodContinues === false) {

                    // Count dry streets
                    game.dryStreets = 0;
                    for (x = 0; x < level.length; x += 1) {
                        for (y = 0; y < level[0].length; y += 1) {
                            if (level[x][y] === 1) {
                                game.dryStreets += 1;
                            }
                        }
                    }

                    // Open the score screen
                    game.state.start('end');
                }
            }, this);
            timer.start();
        }, this);
        timer.start();

        // Build the UI
        this.buildUI();
    },

    update: function () {

        // Update the countdown timer
        countdownTimer.text = '0:0' + Math.ceil(timer.duration / 1000);

        // Update the barricade counter
        barricadeCounter.text = game.barricades;

    },

    buildUI: function () {

        var x, y, point, street;

        // Set the countdown timer
        countdownTimer = game.add.text(40, 40, '0:00', {
            font: 'bold 30pt Arial',
            fill: '#fff'
        });

        // Set the barricade counter
        game.add.image(150, 40, 'tileset', 18);
        barricadeCounter = game.add.text(200, 40, '0', {
            font: 'bold 30pt Arial',
            fill: '#fff'
        })

        // Create the back button
        game.add.button(720, 40, 'ui', function () {
            game.state.start('menu');
        }, this, 111, 110);

        // Create the map
        streets = game.add.group()
        for (x = 0; x < level.length; x += 1) {
            this.levelImage[x] = [];
            for (y = 0; y < level.length; y += 1) {

                // The position of the current tile
                point = this.toIsometric(x, y);

                // Build a tile                
                if (!level[x][y]) {

                    // Build a building
                    this.levelImage[x][y] = game.add.image(point.x, point.y, 'tileset', 0);

                } else if (x % 2 || y % 2) {

                    // Build a street suitable for a barricade on every second tile
                    this.levelImage[x][y] = game.add.image(point.x, point.y, 'tileset', 1);
                    street = game.add.button(point.x, point.y, 'tileset', this.buildBarricade, this, 3, 6);
                    streets.add(street);
                    
                    // Add the original position of the barricade to the button
                    street.data = {
                        x: x,
                        y: y
                    }
                    game.world.bringToTop(streets);

                } else {

                    // Build an intersection on every other tile
                    this.levelImage[x][y] = game.add.image(point.x, point.y, 'tileset', 1);
                }
            }
        }
    },

    buildBarricade: function () {

        // Disable future builds on the just built barricade
        arguments[0].inputEnabled = false;

        // Build a barricade on the selected street
        this.levelImage[arguments[0].data.x][arguments[0].data.y].frame = 2;
        level[arguments[0].data.x][arguments[0].data.y] = 2;
        arguments[0].destroy();

        // Decrease the number of buildable barricades
        game.barricades -= 1;

        // If there are no more barricades, disable building on the remaining streets
        if (game.barricades < 1) {
            streets.children.forEach(function (element) {
                element.inputEnabled = false;
            }, this);
        }

        // Save the time of the last action
        game.lastAction = Math.ceil(timer.duration / 1000);
    },

    toIsometric: function (x, y) {
       return {
           x: (x - y) * 48 + 340,
           y: (x + y) * 24 + 120
       }
    }
};