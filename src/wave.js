/**
 * Waves are special actors that constantly move and leave water behind them.
 * @param {number} x - The x coordinate of the Wave.
 * @param {number} y - The y coordinate of the Wave.
 * @param {number} xd - The index of the Wave's image within the tileset.
 */
var Wave = function (x, y, xd, yd, i) {
  
  /**
   * Set the x, y coordinates and the i index with the Actor's constructor.
   */
  Actor.call(this, x, y, 60);

  /**
   * Hide the water until the wave arrives.
   */
  this.image.frame = 0;

  /**
   * Create a wave tile at the source of the wave.
   */
  this.animation = new Tile(x - xd, y - yd, 1 , i);

  /**
   * Move it to the destination.
   */
  this.animation.x = x;
  this.animation.y = y;

  /**
   * Create a wave animation towards the destination.
   */
  game.add.tween(this.animation.image).to({
    x: this.animation.getIsoX(),
    y: this.animation.getIsoY()
  }, Phaser.Timer.SECOND * 1, Phaser.Easing.None, true);

  /**
   * Spread the water after each movement.
   */
  game.time.events.add(Phaser.Timer.SECOND * 1, this.spread, this);

}
Wave.prototype = Object.create(Actor.prototype);
Wave.constructor = Wave;

/**
 * Moves the wave and creates new waves towards other directions if possible.
 */
Wave.prototype.spread = function () {

  /**
   * Create a new wave on the left if needed.
   */
  if (game.map.getXYZ(this.x + 1, this.y, 1).isFloodable()) {
    new Wave(this.x + 1, this.y, 1, 0, 45);
  }

  /**
   * Create a new wave on the right if needed.
   */
  if (game.map.getXYZ(this.x - 1, this.y, 1).isFloodable()) {
    new Wave(this.x - 1, this.y, -1, 0, 48);
  }

  /**
   * Create a new wave on the bottom if needed.
   */
  if (game.map.getXYZ(this.x, this.y + 1, 1).isFloodable()) {
    new Wave(this.x, this.y + 1, 0, 1, 44);
  }

  /**
  * Create a new wave on the top if needed.
  */
  if (game.map.getXYZ(this.x, this.y - 1, 1).isFloodable()) {
    new Wave(this.x, this.y - 1, 0, -1, 49);
  }

  /**
   * Leave the image of a raised water tile behind.
   */
  this.image.frame = 60;

  /**
   * Hide the wave.
   */
  this.animation.image.frame = 0;
}