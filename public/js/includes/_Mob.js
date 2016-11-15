var Mob;

Mob = (function() {

  /**
   * Create Mob instance.
   *
   * @param  {Game} @game
   * @param  {string} @name
   * @param  {object} @spriteObj
   *
   * @return {void}
   */
  function Mob(game, name, spriteObj) {
    this.game = game;
    this.name = name;
    this.spriteObj = spriteObj;
    return;
  }

  Mob.prototype.loadSprite = function() {
    this.game.load.spritesheet(this.name, this.spriteObj.path, this.spriteObj.x, this.spriteObj.y);
  };

  return Mob;

})();
