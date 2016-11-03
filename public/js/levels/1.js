
/**
 * Level 1
 */
var _time;

Game.Level.one = function(game) {};

_time = void 0;

Game.Level.one.prototype = {
  preload: function() {
    console.log('Loading Level 1 ...');
  },
  create: function($game) {
    console.log('Level 1::create', $game, this);
    this.stage.backgroundColor = Game.Level.conf.one.backgroundColor;
    this.physics.startSystem(Game.Physics);
    this.physics.p2.applyGravity = true;
    this.physics.p2.setImpactEvents(true);
    this.physics.p2.applySpringForces = true;
    Game.Map = this.add.tilemap('map');
    Game.Map.addTilesetImage('tileset');
    $$$game.layer = new Game.Layer($game, Game.Map, ['Ground', 'Platform', 'Aesthetics', 'Powerups']);
    $$$game.layer.createLayers();
    Game.Map.setCollisionBetween(0, 256, true, 'Ground');
    Game.Map.setCollisionBetween(0, 256, true, 'Platform');
    _player.respawn = this.add.group();
    Game.Map.createFromObjects('Spawnpoint', 5, '', 0, true, false, _player.respawn);
    Game.Controls = (new Controls(this, _controls)).create();
    this.physics.p2.convertTilemap(Game.Map, $$$game.layer.gameLayers[0]);
    this.physics.p2.convertTilemap(Game.Map, $$$game.layer.gameLayers[1]);
    $$$game.player.create(0, 0, this.physics.p2);
    this.physics.p2.restitution = Game.Restitution;
    this.physics.p2.gravity.y = Game.Gravity;
    this.spawn();
  },
  update: function($update) {
    $$$game.player.update(Game.Controls);
    if (Game.Controls.up.isDown) {
      if (Game.Controls.right.isDown) {
        console.log('UP and RIGHT', $$$game.player.gameSprite);
      }
      if (Game.Controls.left.isDown) {
        console.log('UP and LEFT');
      }
    }
  },
  render: function($game) {
    $game.debug.bodyInfo($$$game.player.gameSprite, 32, 32);
  },
  noMoreJump: function() {
    Player.jumpStatus = false;
    console.log('No more Jump!');
  },
  spawn: function() {
    _player.respawn.forEach((function(_this) {
      return function(spawnPoint) {
        $$$game.player.gameSprite.reset(spawnPoint.x, spawnPoint.y);
      };
    })(this));
  },
  checkHit: function(spriteA, spriteB) {
    var bounds, intersects;
    bounds = [spriteA.getBounds(), spriteB.getBounds()];
    intersects = Phaser.Rectangle.intersects(bounds[0], bounds[1]);
    if (intersects) {
      console.log('checkHit', intersects, bounds);
    }
    return intersects;
  }
};
