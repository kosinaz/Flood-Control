
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    // Load assets
    game.load.spritesheet('tileset', 'assets/tileset.png', 40, 40);
    game.load.json('levels', 'data/levels.json');
}

// Global game objects
var levels;
var buildings;
var streets;
var water;
var graphics;
var timer;
var countdownTimer;
var barricadeCounter;
var pointCounter;
var spreadTimer;

// Global constants
var tileWidth = 40;
var tileHeight = 40;
var cityX = 220;
var cityY = 180;
var startTime = 6;

// Global variables
var x;
var y;
var tileX;
var tileY;
var points = 0;
var currentLevel = 0;
var barricades;
var floodContinues;

function create() {
    
    // A simple background for our game
    game.stage.backgroundColor = "#00f";
    
    // A simple header for our game
    graphics = game.add.graphics(0, 0);
    graphics.beginFill(0x000000);
    graphics.drawRect(0, 0, 800, 120);
    graphics.endFill();
 
    // A timer to count the seconds before the flood
    timer = game.time.create(false);

    // A timer to follow the flooding water
    spreadTimer = game.time.create(false);

    // Display how many seconds left to build
    countdownTimer = game.add.text(65, 40, '0:00', { 
        font: 'bold 30pt Arial',
        fill: '#fff',
        boundsAlignH: 'right',
        boundsAlignV: 'middle'
    });

    // Display how many barricades left to build
    barricadeCounter = game.add.text(665, 40, barricades, { 
        font: 'bold 30pt Arial',
        fill: '#fff',
        boundsAlignH: 'right',
        boundsAlignV: 'middle'
    });
    game.add.image(700, 40, 'tileset', 18);

    // Display the points
    graphics.beginFill(0x000000);
    graphics.drawCircle(740, 540, 120);
    graphics.endFill();
    pointCounter = game.add.text(680, 480, '' + points, { 
        font: 'bold 60pt Arial',
        fill: '#fff',
        boundsAlignH: 'right',
        boundsAlignV: 'middle'
    });

    // The external level data containing buildings and streets
    levels = game.cache.getJSON('levels');
 
    // Start the first level
    startLevel(0);
}

function startLevel (z) {
    
    // Set the barricades
    barricades = 4;
    barricadeCounter.text = barricades;
    
    // Set the countdown timer
    timer.add(startTime * 1000, startFlood, this);

    // Clear the countdown timer bar
    graphics.beginFill(0x888888);
    graphics.drawRect(200, 40, 400, 40);
    graphics.endFill();
    
    // Start the countdown timer
    timer.start();

    // The streets where barricades can be built like a simle tap on a button
    streets = game.add.group();
    
    // The buildings group contains the initial barricades of the flood
    buildings = game.add.group();
    
    // The water that floods the streets
    water = game.add.group();

    // Build all the assets of the current level data
    for (x = 0; x < levels[z].length; x += 1) {
        for (y = 0; y < levels[z][0].length; y += 1) {
            
            // The x position of the current tile
            tileX = cityX + x * tileWidth;
            
            // The y position of the current tile
            tileY = cityY + y * tileHeight;
            
            if (!levels[z][x][y]) {

                // Build a building
                buildings.create(tileX, tileY, 'tileset', 0)

            } else if (x % 2 || y % 2) {

                // Build a street suitable for a barricade on every second tile
                streets.add(game.add.button(tileX, tileY, 'tileset', buildBarricade, this, 17, 1, 18));

            } else {

                // Build an intersection on every other tile
                game.add.image(tileX, tileY, 'tileset', 1);
            }
        }
    }    
}

function update() {

    // Update how many seconds left to build
    countdownTimer.text = '0:0' + Math.ceil(timer.duration / 1000);

    // Update the countdown timer bar of the flood
    graphics.beginFill(0x0000ff);
    graphics.drawRect(200, 40, (startTime * 1000 - timer.duration) / startTime * 0.4, 40);
    graphics.endFill();
}

function buildBarricade() {
    
    // Build a barricade on the selected street
    buildings.create(arguments[0].x, arguments[0].y, 'tileset', 18);
    levels[currentLevel][(arguments[0].x - cityX) / 40][(arguments[0].y - cityY) / 40] = 2;
    
    // Make sure that the barricades will be displayed on top of the street
    game.world.bringToTop(buildings);

    // Decrease the number of buildable barricades
    barricades -= 1;

    // Update the barricade counter
    barricadeCounter.text = barricades;

    // If there are no more barricades, disable building on the remaining streets
    if (barricades < 1) {
        streets.children.forEach(function(element) {
            element.inputEnabled = false;
        }, this);
    }
}

function startFlood() {

    // Stop the timer to start the flood
    timer.stop();

    // Set water sources in every intersections of the edge of the level
    for (x = 0; x < levels[currentLevel].length; x += 2) {

        // The x position of the current tile
        tileX = cityX + x * tileWidth;
        
        // The y position of the current tile
        tileY = cityY;

        // Set the top border
        levels[currentLevel][x][0] = 3;
        
        // Fill the current position with water
        water.create(tileX, tileY, 'tileset', 19)

        // Set the bottom border
        levels[currentLevel][x][levels[0].length - 1] = 3;

        // Fill the current position with water
        water.create(tileX, tileY + (levels[currentLevel].length - 1) * tileHeight, 'tileset', 19)

    }
    for (y = 2; y < levels[currentLevel][0].length - 2; y += 2) {

        // The x position of the current tile
        tileX = cityX;
        
        // The y position of the current tile
        tileY = cityY + y * tileHeight;
        
        // Set the left border
        levels[currentLevel][0][y] = 3;

        // Fill the current position with water
        water.create(tileX, tileY, 'tileset', 19)

        // Set the right border
        levels[currentLevel][levels[currentLevel][0].length - 1][y] = 3;

        // Fill the current position with water
        water.create(tileX + (levels[currentLevel][0].length - 1) * tileWidth, tileY, 'tileset', 19)
    }

    // Make sure that the water will be displayed on top of the street
    game.world.bringToTop(water);

    // Spread the water every half seconds
    spreadTimer.loop(500, continueFlood, this);
    spreadTimer.start();
}

function continueFlood() {

    console.log('flooding' + currentLevel);

    // Spread the water
    for (x = 0; x < levels[currentLevel].length; x += 1) {
        for (y = 0; y < levels[currentLevel][0].length; y += 1) {

            // Find the neighbors of the flooded areas
            if (levels[currentLevel][x][y] === 3) {

                // The x position of the current tile
                tileX = cityX + x * tileWidth;
                
                // The y position of the current tile
                tileY = cityY + y * tileHeight;

                // Flood the left neighbor if possible
                if (levels[currentLevel][x + 1] && levels[currentLevel][x + 1][y] === 1) {
                    levels[currentLevel][x + 1][y] = 4;
                    water.create(tileX + tileWidth, tileY, 'tileset', 19)
                }
                
                // Flood the right neighbor if possible
                if (levels[currentLevel][x - 1] && levels[currentLevel][x - 1][y] === 1) {
                    levels[currentLevel][x - 1][y] = 4;
                    water.create(tileX - tileWidth, tileY, 'tileset', 19)
                }
                
                // Flood the top neighbor if possible
                if (levels[currentLevel][x][y + 1] && levels[currentLevel][x][y + 1] === 1) {
                    levels[currentLevel][x][y + 1] = 4;
                    water.create(tileX, tileY + tileHeight, 'tileset', 19)
                }
                
                // Flood the bottom neighbor if possible
                if (levels[currentLevel][x][y - 1] && levels[currentLevel][x][y - 1] === 1) {
                    levels[currentLevel][x][y - 1] = 4;
                    water.create(tileX, tileY - tileHeight, 'tileset', 19)
                }
            }
        }
    }

    // Set the newly spreaded water
    floodContinues = false;
    for (x = 0; x < levels[currentLevel].length; x += 1) {
        for (y = 0; y < levels[currentLevel][0].length; y += 1) {
            if (levels[currentLevel][x][y] === 4) {
                levels[currentLevel][x][y] = 3;
                floodContinues = true;
            }
        }
    }

    // If there are no more streets to flood stop and evaluate
    if (floodContinues === false) {
        spreadTimer.stop();
        for (x = 0; x < levels[currentLevel].length; x += 1) {
            for (y = 0; y < levels[currentLevel][0].length; y += 1) {
                if (levels[currentLevel][x][y] === 1) {

                    // Give points for every dry street
                    points += 1;

                }
            }
        }

        // Update the point counter
        pointCounter.text = points;

        // Start the next level if possible
        if (levels[++currentLevel]) {
            startLevel(currentLevel);
        }
    }
}