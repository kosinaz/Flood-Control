/**
 * Contains all the map data to provide information about where the player, the
 * walls, and waves can go.
 */
var Map = function () {

    /**
     * @property {number} map - The container of all the map data.
     */
    this.map = {};
}

/**
 * Adds the specified map data to the map at the given x and y coordinates.
 * @param {number} x - The x coordinate of the map data.
 * @param {number} y - The y coordinate of the map data.
 * @param {number} z - The z coordinate of the map data.
 * @param {number} data - The data to be set on the map.
 */
Map.prototype.setXYZ = function (x, y, z, data) {
    
    /**
     * Set the data as a coordinate attribute of the map.
     */
    this.map[x + ',' + y + ',' + z] = data;
}

/**
 * Returns the map data of the given position. 
 * @param {number} x - The x coordinate of the map data.
 * @param {number} y - The y coordinate of the map data.
 * @param {number} z - The z coordinate of the map data.
 */
Map.prototype.getXYZ = function (x, y, z) {
    
    /**
     * Get the data of the specified coordinate attribute of the map.
     */
    return this.map[x + ',' + y + ',' + z] || new Tile();
}

/**
 * Move the specified map data to the given x, y and z coordinates.
 * @param {number} x1 - The x coordinate of the origin.
 * @param {number} y1 - The y coordinate of the origin.
 * @param {number} z1 - The z coordinate of the origin.
 * @param {number} x2 - The x coordinate of the destination.
 * @param {number} y2 - The y coordinate of the destination.
 * @param {number} z2 - The z coordinate of the destination.
 */
Map.prototype.moveXYZ = function (x1, y1, z1, x2, y2, z2) {

    /**
     * Get and set the data of the specified coordinate attribute of the map.
     */
    this.setXYZ(x2, y2, z2, this.getXYZ(x1, y1, z1));
    this.setXYZ(x1, y1, z1, null);
}

/**
 * Returns true if there is no water, no house and no vertical wall in the
 * specified position.
 * @param {number} x 
 * @param {number} y 
 */
Map.prototype.XYisFloodableHorizontally = function (x, y) {
    return !this.XYisWater(x, y) && 
        this.getXYZ(x, y, 1).isFloodableHorizontally();
}

/**
 * Returns true if there is no water, no house and no horizontal wall in the
 * specified position.
 * @param {number} x 
 * @param {number} y 
 */
Map.prototype.XYisFloodableVertically = function (x, y) {
    return !this.XYisWater(x, y) && 
        this.getXYZ(x, y, 1).isFloodableVertically();
}

/**
 * Returns true if there is water in the specified position.
 * @param {number} x 
 * @param {number} y 
 */
Map.prototype.XYisWater = function (x, y) {
    return !!this.map[x + ',' + y + ',' + 2];
}