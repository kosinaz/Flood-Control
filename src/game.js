
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.spritesheet('tileset', 'assets/tileset.png', 40, 40);
    game.load.json('levels', 'data/levels.json');
}

var levels;
var buildings;
var streets;
var graphics;
var timer;

var x;
var y;
var tileWidth = 40;
var tileHeight = 40;
var tileX;
var tileY;
var cityX = 220;
var cityY = 180;
var barricades = 3;
var barricadeCounter;
var countdownTimer;

function create() {
    
    // A simple background for our game
    game.stage.backgroundColor = "#00f";
    
    // A simple header for our game
    graphics = game.add.graphics(0, 0);
    graphics.beginFill(0x000000);
    graphics.drawRect(0, 0, 800, 120);
    graphics.endFill();
 
    // A timer to count the seconds before the flood
    timer = game.time.create(true);
    timer.loop(7000, flood, this);
    timer.start();

    // Display how many seconds left to build
    countdownTimer = game.add.text(65, 40, '0:00', { 
        font: 'bold 30pt Arial',
        fill: '#fff',
        boundsAlignH: 'right',
        boundsAlignV: 'middle'
    });

    // The countdown timer bar of the flood
    graphics.beginFill(0x888888);
    graphics.drawRect(200, 40, 400, 40);
    graphics.endFill();

    // Display how many barricades left to build
    barricadeCounter = game.add.text(665, 40, barricades, { 
        font: 'bold 30pt Arial',
        fill: '#fff',
        boundsAlignH: 'right',
        boundsAlignV: 'middle'
    });
    game.add.image(700, 40, 'tileset', 18);
    
    // The external level data containg buildings and streets
    levels = game.cache.getJSON('levels');

    // The streets where barricades can be built like a simle tap on a button
    streets = game.add.group();
    
    // The buildings group contains the initial barricades of the flood
    buildings = game.add.group();

    // Build all the assets of the current level data
    for (x = 0; x < levels[0].length; x += 1) {
        for (y = 0; y < levels[0][0].length; y += 1) {
            
            // The x position of the current tile
            tileX = cityX + x * tileWidth;
            
            // The y position of the current tile
            tileY = cityY + y * tileHeight;
            
            if (!levels[0][x][y]) {

                // Build a building
                buildings.create(tileX, tileY, 'tileset', 0)

            } else if (x % 2 || y % 2) {

                // Build a street suitable for a barricade on every second tile
                streets.add(game.add.button(tileX, tileY, 'tileset', actionOnClick, this, 17, 1, 18));

            } else {

                // Build an intersection on every other tile
                game.add.image(tileX, tileY, 'tileset', 1);
            }
        }
    }    
}

function update() {

    // Update how many seconds left to build
    countdownTimer.text = '0:0' + Math.floor(timer.duration / 1000);

    // Update the countdown timer bar of the flood
    graphics.beginFill(0x0000ff);
    graphics.drawRect(200, 40, Math.min(timer.ms / 6000 * 400, 400), 40);
    graphics.endFill();
}

function actionOnClick() {
    
    // Build a barricade on the selected street
    buildings.create(arguments[0].x, arguments[0].y, 'tileset', 18);
    
    // Make sure that the barricades will be displayed above the street
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

function flood() {

}