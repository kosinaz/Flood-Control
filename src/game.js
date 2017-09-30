
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.spritesheet('tileset', 'assets/tileset.png', 40, 40);
    game.load.json('levels', 'data/levels.json');
}

var levels;
var buildings;
var streets;

var x;
var y;
var tileWidth = 40;
var tileHeight = 40;
var tileX;
var tileY;
var cityX = 180;
var cityY = 80;

function create() {

    // A simple background for our game
    game.stage.backgroundColor = "#0000ff";

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
                game.add.button(tileX, tileY, 'tileset', actionOnClick, this, 17, 1, 18);

            } else {

                // Build an intersection on every other tile
                streets.create(tileX, tileY, 'tileset', 1);
            }
        }
    }    
}


function update() {
    
}

function actionOnClick () {
    
    // Build a barricade on the selected street
    buildings.create(arguments[0].x, arguments[0].y, 'tileset', 18);
    
    // Make sure that the barricades will be displayed above the street
    game.world.bringToTop(buildings);
}