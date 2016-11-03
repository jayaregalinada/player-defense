
/**
 * preload.coffee
 */
Game.Preload = function(game) {
  this.preloader = null;
};

Game.Preload.prototype = {
  preload: function() {
    console.log('Preload loading...');
    this.preloader = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderImg');
    this.time.advanceTiming = true;
    this.load.setPreloadSprite(this.preloader);
    this.load.tilemap('map', 'assets/map/1/map.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tileset', 'assets/map/1/tileset.png');
    $$$game.player = new Player(this, 'player', {
      path: 'assets/player/kit_from_firefox.png',
      x: 56,
      y: 80
    });
    $$$game.player.loadSprite();
    (new Mobs.Enemy.tongue(this, 'mobEnemyTongue', {
      path: 'assets/mob/enemies/tongue.png',
      x: 49,
      y: 40
    })).loadSprite();
  },
  create: function() {
    this.state.start('Level 1');
  }
};
