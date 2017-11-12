/**
 * Waves are special actors that constantly move and leave water behind them.
 * @param {number} x - The x coordinate of the Wave.
 * @param {number} y - The y coordinate of the Wave.
 * @param {number} i - The index of the Wave's image within the tileset.
 */
var Wave = function (x, y, i) {
  
  /**
   * Set the x, y coordinates and the i index with the Actor's constructor.
   */
  Actor.call(this, x, y, i);

  /**
   * Spread the water after each movement.
   */
  game.time.events.repeat(Phaser.Timer.SECOND * 1, 100, this.spread, this);

}
Wave.prototype = Object.create(Actor.prototype);
Wave.constructor = Wave;

/**
 * Moves the Wave to a nearby position based on the x and y distance of
 * the original position of the Wave and its destination. Also changes the
 * tile to display based on the new direction of the Wave.
 * The Wave's original position is already stored, and the Wave can
 * move either to next or previous x or y position, so one of the 
 * parameters will always be 0.
 * @param {number} x - The x distance of the destination from the wave.
 * @param {number} y - The y distance of the destination from the wave.
 * @param {number} [i] - The index of the tile to display after the movement.
 */
Actor.prototype.move = function (x, y, i) {

  /**
   * Determine the destination.
   */
  var dx = this.x + x, dy = this.y + y;

  /**
   * If the destination is a house ignore the input.
   */
  if (game.map.getXYZ(dx, dy, 1).isHouse()) {
    return false;
  }

  /**
   * If the destination is a barrier ignore the input.
   */
  if (game.map.getXYZ(dx, dy, 1).isBarrier()) {
    return false;
  }

  /**
   * Move the actor to its destination.
   */
  game.map.moveXYZ(this.x, this.y, 1, dx, dy, 1);
  this.x = dx;
  this.y = dy;

  /**
   * Face the image to the specified direction if needed.
   */
  this.image.frame = i || this.image.frame;

  /**
   * Update the position of the player and its image.
   */
  game.add.tween(this.image).to({
    x: this.getIsoX(),
    y: this.getIsoY()
  }, Phaser.Timer.SECOND * 1, Phaser.Easing.None, true);

  /**
   * Return the movement as successful.
   */
  return true;
}

/**
 * Moves the wave and creates new waves towards other directions if possible.
 */
Wave.prototype.spread = function () {

  /**
   * Raise the water after a short delay.
   */
  game.time.events.add(Phaser.Timer.SECOND * 1, this.raiseWater, {
    x: this.x,
    y: this.y
  });
  
  /**
   * Move down or remove the wave after a short delay.
   */ 
  if(!this.move(0, 1, 44)) {
    game.time.events.add(Phaser.Timer.SECOND * 1, this.remove, this);
  }

  /**
   * Create a new wave on the left if needed.
   */
  if (!game.map.getXYZ(this.x + 1, this.y, 1).isWater()) {
    new Wave(this.x, this.y, 45).move(1, 0, 45);
  }

  /**
   * Create a new wave on the right if needed.
   */
  if (!game.map.getXYZ(this.x - 1, this.y, 1).isWater()) {
    new Wave(this.x, this.y, 48).move(-1, 0, 48);
  }
}

/**
 * Raises the water behind the wave.
 */
Wave.prototype.raiseWater = function () {
  new Tile(this.x, this.y, 1, 60);
}

/**
 * Removes the wave.
 */
Wave.prototype.remove = function () {
  this.image.kill();
}