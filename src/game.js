
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.spritesheet('tileset', 'assets/tileset.png', 40, 40);
    game.load.json('levels', 'data/levels.json');
}

var levels;
var buildings;
var streets;
var graphics;

var x;
var y;
var tileWidth = 40;
var tileHeight = 40;
var tileX;
var tileY;
var cityX = 200;
var cityY = 160;
var barricades = 3;
var barricadeCounter;

function create() {

    // A simple background for our game
    game.stage.backgroundColor = "#00f";

    // A simple header for our game
    graphics = game.add.graphics(0, 0);
    graphics.beginFill("#000");
    graphics.drawRect(0, 0, 800, 120);
    graphics.endFill();

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

    // Display how many barricades left to build
    barricadeCounter = game.add.text(45, 40, barricades, { 
        font: 'bold 30pt Arial',
        fill: '#fff',
        boundsAlignH: 'right',
        boundsAlignV: 'middle'
    });
    game.add.image(80, 40, 'tileset', 18);

}


function update() {
    
}

function actionOnClick () {
    
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