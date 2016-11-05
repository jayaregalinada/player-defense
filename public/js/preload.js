
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
    this.load.spritesheet('button_play', 'assets/buttons/play.png', 200, 50);
    this.load.image('tileset', 'assets/map/1/tileset.png');
    $$$game.characters.kit = new Player(this, 'kit', {
      path: 'assets/player/kit_from_firefox.png',
      x: 42,
      y: 60
    });
    $$$game.characters.kit.loadSprite();
    $$$game.characters.pacman = new Player(this, 'pacman', {
      path: 'assets/player/pacman_from_philippines.png',
      x: 42,
      y: 60
    });
    $$$game.characters.pacman.loadSprite();
    $$$game.characters.wilber = new Player(this, 'wilber', {
      path: 'assets/player/wilber_from_gimp.png',
      x: 42,
      y: 60
    });
    $$$game.characters.wilber.loadSprite();
    $$$game.mobs.tongue = new Mobs.Enemy.tongue(this, 'mobEnemyTongue', {
      path: 'assets/mob/enemies/tongue.png',
      x: 49,
      y: 40
    });
    $$$game.mobs.tongue.loadSprite();
  },
  create: function() {
    this.state.start('Menu');
  }
};
