
/**
 * boot.coffee
 */
Game.Boot = function(game) {};

Game.Boot.prototype = {
  init: function() {
    this.input.maxPointers = 1;
  },
  preload: function() {
    console.log('Boot loading...');
    this.load.image('preloaderImg', 'assets/preloader.gif');
  },
  create: function() {
    this.state.start('Preload');
  }
};
