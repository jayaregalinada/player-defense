Game.Preload = (function() {
  function Preload(game) {
    this.game = game;
  }

  Preload.prototype.preload = function() {
    this._config = this.game.cache.getJSON('config');
    this.stage.backgroundColor = this._config.background.color;
    this.load.pack('preload', this._config.assetPack.directory + this._config.assetPack.filename, null, this);
  };

  Preload.prototype.create = function() {
    this.stage.backgroundColor = this._config.background.color;
    this.add.sprite(this.world.centerX - (64 / 2), this.world.centerY - (64 / 2), 'preloaderImg');
    this.state.start('Menu');
  };

  return Preload;

})();
