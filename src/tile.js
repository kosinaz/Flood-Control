/**
 * Tiles are the most basic components of the game map. The map basically is 
 * list of tiles, that are containing information about their position and
 * graphical representation. The position information is what makes tiles 
 * slightly more complex than the solution that for example Tiled provides, 
 * because this makes it possible to combine tiles in the same position, on the
 * same layer.
 * Semi-isometric layers are made of Phaser.Groups. Every Tile of a layer is in
 * the same Phaser.Group, and they are getting depth sorted after every update
 * to properly display them isometrically.
 * @param {number} [x=0] - The x coordinate of the tile object.
 * @param {number} [y=0] - The y coordinate of the tile object.
 * @param {number} [i=0] - The index of the tile's image within the tileset.
 * @param {Phaser.Group} [layer] - The layer of the tile to be displayed on.
 */
var Tile = function (x, y, i, layer) {

    /**
     * @property {number} [x=0] - The x coordinate of the tile object.
     */
    this.x = x || 0;

    /**
     * @property {number} [y=0] - The y coordinate of the tile object.
     */
    this.y = y || 0;

    /**
     * @property {number} [i=0] - The index of the tile's image.
     */
    this.i = i || 0;

    /**
     * @property {Phaser.Group} [layer] - The layer of the tile.
     */
    this.layer = layer;

    /**
     * Draw the isometric Tile and add to the specified layer.
     */
    game.add.image(this.getIX(), this.getIY(), 'tileset', this.i, this.layer);
}

/** 
 * Translates the Tile's 2-dimensional position into an isometric x 
 * coordinate of a 2-dimensional map and positions it to the middle of the 
 * screen.
 * This function comes handy when a 2-dimensional position needs to be 
 * displayed in isometric 2-dimensions.
 */
Tile.prototype.getIX = function () {
    return (this.x - this.y) * game.map.tilewidth / 2 + 
        game.map.tilewidth / 2 * game.map.width / 2 - 
        game.map.tilewidth;
}

/** 
 * Translates the Tile's 2-dimensional position into an isometric y 
 * coordinate of a 2-dimensional map and positions it to the middle of the 
 * screen.
 * This function comes handy when a 2-dimensional position needs to be 
 * displayed in isometric 2-dimensions.
 */
Tile.prototype.getIY = function () {
    return (this.x + this.y) * game.map.tileheight / 2 - 
        game.map.tileheight / 2 * game.map.height / 2 - 
        game.map.tileheight / 2;
}