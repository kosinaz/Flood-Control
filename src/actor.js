/**
 * Actors are special tiles that can move around and interact with each other.
 * @param {number} x - The x coordinate of the actor.
 * @param {number} y - The y coordinate of the actor.
 * @param {number} z - The y coordinate of the actor.
 * @param {number} i - The index of the actor's image within the tileset.
 * @param {Phaser.Group} layer - The layer of the tile to be displayed on.
 */
var Actor = function (x, y, z, i) {

  /**
   * Set the x, y, z coordinates and the i index with the Tile's constructor.
   */
  Tile.call(this, x, y, z, i);

}
Actor.prototype = Object.create(Tile.prototype);
Actor.constructor = Actor;

/**
 * Moves the actor to a nearby position based on the x and y distance of
 * the original position of the actor and its destination. Also changes the
 * tile to display based on the new direction of the actor.
 * The actor's original position is already stored, and the player can
 * move either to next or previous x or y position, so one of the 
 * parameters will always be 0.
 * @param {number} x - The x distance of the destination from the actor.
 * @param {number} y - The y distance of the destination from the actor.
 * @param {number} [i] - The index of the tile to display after the movement.
 */
Actor.prototype.move = function (x, y, i) {

  // Determine the destination 
  var dx = game.player.x + x, dy = game.player.y + y;

  // If the destination is not a street ignore the input
  if (!game.map.getXYZ(dx, dy, 0).isStreet()) {
    return false;
  }

  // If the destination is a barrier and the actor is the player push it.
  if (game.map.getXYZ(dx, dy, 1).isBarrier() && game.player === this) {
    if (!game.map.getXYZ(dx, dy, 1).move(dx + x, dy + y)) {
      return false;
    }
  }

  // Move the actor to its destination
  this.x = dx;
  this.y = dy;

  // Face the image to the specified direction if needed
  game.player.image.frame = i || game.player.image.frame;

  // Update the position of the player and its image
  game.add.tween(this.image).to({
    x: this.getIsoX(),
    y: this.getIsoY()
  }, 200, Phaser.Easing.None, true);

  return true;

}