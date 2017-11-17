/**
 * Tiles are the most basic components of the game map. The map is basically a 
 * list of tiles, that are containing information about their position and
 * graphical representation. The position information is what makes tiles 
 * slightly more complex than the solution that for example Tiled provides, 
 * because this makes it possible to combine tiles in the same position, on the
 * same layer.
 * Semi-isometric layers are made of Phaser.Groups. Every Tile of a layer is in
 * the same Phaser.Group, and they are getting depth sorted after every update
 * to properly display them isometrically.
 * @param {number} x - The x coordinate of the tile object.
 * @param {number} y - The y coordinate of the tile object.
 * @param {number} z - The z coordinate of the tile object.
 * @param {number} i - The index of the tile's image within the tileset.
 */
var Tile = function (x, y, z, i) {

    /**
     * @property {number} x - The x coordinate of the tile object.
     */
    this.x = x;

    /**
     * @property {number} y - The y coordinate of the tile object.
     */
    this.y = y;

    /**
     * @property {number} z - The z coordinate of the tile object.
     */
    this.z = z;

    /**
     * @property {number} i - The index of the tile's image.
     */
    this.i = i;

    /**
     * @property {Phaser.Group} layer - The layer of the tile. It is background
     * for z = 0, and scene for z = 1 like the walls and the dozer and z = 2
     * like the water.
     */
    this.layer = z ? game.scene : game.background;

    /**
     * @property {Phaser.Image} image - The image of the tile.
     */
    this.image = this.addImage();

    /**
     * Add the Tile to the game map.
     */
    game.map.setXYZ(x, y, z, this); 

}

/**
 * Adds the graphical representation of the tile to the game based on its own
 * attributes.
 */
Tile.prototype.addImage = function () {

    /**
     * Draw the isometric Tile and add to the specified layer.
     */
    return game.add.image(
        this.getIsoX(), 
        this.getIsoY(), 
        'tileset', 
        this.i, 
        this.layer
    );
}

/** 
 * Translates the Tile's 2-dimensional position into an isometric x 
 * coordinate of a 2-dimensional map and positions it to the middle of the 
 * screen.
 * This function comes handy when a 2-dimensional position needs to be 
 * displayed in isometric 2-dimensions.
 */
Tile.prototype.getIsoX = function () {
    return (this.x - this.y) * game.tiledMap.tilewidth / 2 + 
        game.tiledMap.tilewidth / 2 * game.tiledMap.width / 2 - 
        game.tiledMap.tilewidth;
}

/** 
 * Translates the Tile's 2-dimensional position into an isometric y 
 * coordinate of a 2-dimensional map and positions it to the middle of the 
 * screen.
 * This function comes handy when a 2-dimensional position needs to be 
 * displayed in isometric 2-dimensions.
 */
Tile.prototype.getIsoY = function () {
    return (this.x + this.y) * game.tiledMap.tileheight / 2 - 
        game.tiledMap.tileheight / 2 * game.tiledMap.height / 2 - 
        game.tiledMap.tileheight / 2;
}

/**
 * Returns true if the current tile is a street-type tile.
 * This function comes handy when it needs to be decided if the tile is 
 * passable by the player or not.
 */
Tile.prototype.isStreet = function () {
    return this.i > 7 && this.i < 22;
}

/**
 * Returns true if the current tile is a wall.
 * This function comes handy when it needs to be decided if the tile is 
 * pushable by the player or not.
 */
Tile.prototype.isWall = function () {
    return this.i === 32 || this.i === 33;
}

/**
 * Returns true if the current tile is a horizontal wall between two houses.
 * This function comes handy when it needs to be decided if the tile is 
 * floodable or not.
 */
Tile.prototype.wallsHorizontally = function () {
    return this.i === 32 && game.map.getXYZ(this.x - 1, this.y, 1).isHouse() && 
        game.map.getXYZ(this.x + 1, this.y, 1).isHouse();
}

/**
 * Returns true if the current tile is a vertical wall between two houses.
 * This function comes handy when it needs to be decided if the tile is 
 * floodable or not.
 */
Tile.prototype.wallsVertically = function () {
    return this.i === 33 && game.map.getXYZ(this.x, this.y - 1, 1).isHouse() &&
        game.map.getXYZ(this.x, this.y + 1, 1).isHouse();
}

/**
 * Returns true if the current tile is a house.
 * This function comes handy when it needs to be decided if the tile is 
 * passable by the waves or not.
 */
Tile.prototype.isHouse = function () {
    return this.i > 67;
}

/**
 * Returns true if the current tile is not water, not house, or not a vertical 
 * wall between two houses.
 * This function comes handy when it needs to be decided if the tile is 
 * floodable or not.
 */
Tile.prototype.isFloodableHorizontally = function () {
    return !(this.isHouse() || this.wallsVertically());
}

/**
 * Returns true if the current tile is not water, not house, or not a 
 * horizontal wall between two houses.
 * This function comes handy when it needs to be decided if the tile is 
 * floodable or not.
 */
Tile.prototype.isFloodableVertically = function () {
    return !(this.isHouse() || this.wallsHorizontally());
}