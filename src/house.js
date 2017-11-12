/**
 * Houses are three-part tiles that are colored randomly. The parts are walls,
 * roof, eyes and windows.
 * @param {number} x - The x coordinate of the house.
 * @param {number} y - The y coordinate of the house.
 * @param {number} z - The y coordinate of the house.
 * @param {number} i - The index of the first part's image within the tileset.
 * @param {number} j - The index of the second part's image within the tileset.
 * @param {number} k - The index of the third part's image within the tileset.
 */
var House = function (x, y, z, i, j, k) {

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
    Tile.call(this, x, y, z, i);

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
        this.getIsoX(), 
        this.getIsoY(), 
        'tileset', 
        this.i, 
        this.layer
    ).tint = Phaser.Color.createColor(color.r, color.g, color.b).color;

    /**
     * Draw and color the roof with a different color
     */ 
    game.add.image(
        this.getIsoX(), 
        this.getIsoY(), 
        'tileset', 
        this.j, 
        this.layer
    ).tint = Phaser.Color.createColor(color.g, color.b, color.r).color;

    /**
     * Draw the rest
     */ 
    game.add.image(
        this.getIsoX(), 
        this.getIsoY(), 
        'tileset', 
        this.k, 
        this.layer
    );
}