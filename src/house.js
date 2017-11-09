/**
 * Houses are three-part tiles that are colored randomly. The parts are walls,
 * roof, eyes and windows.
 * @param {number} x - The x coordinate of the tile object.
 * @param {number} y - The y coordinate of the tile object.
 * @param {number} i - The index of the first part's image within the tileset.
 * @param {number} j - The index of the second part's image within the tileset.
 * @param {number} k - The index of the third part's image within the tileset.
 * @param {Phaser.Group} layer - The layer of the tile to be displayed on.
 */
var House = function (x, y, i, j, k, layer) {

    /**
     * @property {number} j - The index of the second part's image.
     */
    this.j = j;

    /**
     * @property {number} k - The index of the third part's image.
     */
    this.k = k;

    /**
     * Set the x, y coordinates and the i index with the Tile's constructor.
     */
    Tile.call(this, x, y, i, layer);

}
House.prototype = Object.create(Tile.prototype);
House.constructor = House;

/**
 * Overrides the Tile's addImage called in its constructor to add three 
 * differently colored images.
 */
House.prototype.addImage = function () {

    /**
     * Pick a random color hue
     */ 
    var color = Phaser.Color.HSLtoRGB(Math.random(), 1, 0.5);
     
    /**
     * Draw and color the wall
     */ 
    this.image = game.add.image(
        this.getIsometricX(), 
        this.getIsometricY(), 
        'tileset', 
        this.i, 
        this.layer
    ).tint = Phaser.Color.createColor(color.r, color.g, color.b).color;

    /**
     * Draw and color the roof with a different color
     */ 
    game.add.image(
        this.getIsometricX(), 
        this.getIsometricY(), 
        'tileset', 
        this.j, 
        this.layer
    ).tint = Phaser.Color.createColor(color.g, color.b, color.r).color;

    /**
     * Draw the rest
     */ 
    game.add.image(
        this.getIsometricX(), 
        this.getIsometricY(), 
        'tileset', 
        this.k, 
        this.layer
    );
}