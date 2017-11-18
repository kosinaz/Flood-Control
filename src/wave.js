/**
 * Waves are special actors that constantly move and leave water behind them.
 * The z coordinate is not necessary because all waves are z = 2.
 * @param {number} x - The x coordinate of the Wave.
 * @param {number} y - The y coordinate of the Wave.
 * @param {number} xd - The index of the Wave's image within the tileset.
 */
var Wave = function (x, y, xd, yd, i) {

  /**
   * Set the x, y coordinates and the i index with the Actor's constructor.
   */
  Actor.call(this, x, y, 2, 60);

  /**
   * Hide the water until the wave arrives.
   */
  this.image.frame = 0;

  /**
   * Create a wave tile at the source of the wave.
   */
  this.animation = new Tile(x - xd, y - yd, 2, i);

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
   * Spread the water.
   */
  game.time.events.add(Phaser.Timer.SECOND * 1, this.spread, this);

}
Wave.prototype = Object.create(Actor.prototype);
Wave.constructor = Wave;

/**
 * Moves the wave and creates new waves towards other directions if possible.
 */
Wave.prototype.spread = function () {

  var text, bar;

  /**
   * Create a new wave on the top if needed.
   */
  if (playState.map.XYisFloodableVertically(this.x, this.y - 1)) {
    new Wave(this.x, this.y - 1, 0, -1, 49);
  }

  /**
   * Create a new wave on the left if needed.
   */
  if (playState.map.XYisFloodableHorizontally(this.x - 1, this.y)) {
    new Wave(this.x - 1, this.y, -1, 0, 48);
  }

  /**
   * Create a new wave on the bottom if needed.
   */
  if (playState.map.XYisFloodableVertically(this.x, this.y + 1)) {
    new Wave(this.x, this.y + 1, 0, 1, 44);
  }

  /**
   * Create a new wave on the right if needed.
   */
  if (playState.map.XYisFloodableHorizontally(this.x + 1, this.y)) {
    new Wave(this.x + 1, this.y, 1, 0, 45);
  }

  /**
   * If there is a misplaced wall.
   */
  if ((playState.map.getXYZ(this.x, this.y, 1).i === 32 && 
    !playState.map.getXYZ(this.x, this.y, 1).wallsHorizontally()) ||
    (playState.map.getXYZ(this.x, this.y, 1).i === 33 && 
    !playState.map.getXYZ(this.x, this.y, 1).wallsVertically())) {

    /**
     * Set the wall flooded that is not between two houses.
     */
    playState.map.getXYZ(this.x, this.y, 1).image.frame += 4;

  } else {

    /**
     * Leave the image of a raised water tile behind on non-walled streets.
     */
    this.image.frame = 60;

    /**
     * If the player's dozer is flooded make the player lose the game.
     */
    if (this.x === game.player.x && this.y === game.player.y) {
      bar = game.add.graphics();
      bar.beginFill(0xff0000, 0.7);
      bar.drawRect(0, 200, 1024, 100);
      text = game.add.text(0, 0, 'Blub-blub-blub', {
        boundsAlignH: "center", 
        boundsAlignV: "middle",
        fill: '#fff',
        font: 'bold 60pt Arial'
      });
      text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
      text.setTextBounds(0, 200, 1024, 100);
      game.time.events.add(Phaser.Timer.SECOND * 5, playState.lose, this);
    }

    /**
     * If the player's dozer is flooded make the player win the game.
     */
    if (this.x === Math.floor(playState.tiledMap.width / 2) && 
      this.y === playState.tiledMap.height - 1) {
      bar = game.add.graphics();
      bar.beginFill(0xffff00, 0.7);
      bar.drawRect(0, 200, 1024, 100);
      text = game.add.text(0, 0, 'Still dry...', {
        boundsAlignH: "center",
        boundsAlignV: "middle",
        fill: '#fff',
        font: 'bold 60pt Arial'
      });
      text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
      text.setTextBounds(0, 200, 1024, 100);
      game.time.events.add(Phaser.Timer.SECOND * 5, playState.win, this);
    }
  }
  
  /**
   * Hide the wave.
   */
  this.animation.image.frame = 0;
}