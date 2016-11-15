Game.Boot = (function() {
  function Boot(game) {
    this.game = game;
  }

  Boot.prototype.preload = function() {
    this.input.maxPointers = 1;
    this.load.json('config', 'data/config.json');
  };

  Boot.prototype.create = function() {
    var config;
    config = this.cache.getJSON('config');
    this.state.start('Preload');
  };

  return Boot;

})();
