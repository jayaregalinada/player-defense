
/**
 * Configuration
 */
var $$$game, Game, Mobs, _controls, _player, setConfig;

Game = {};

Game.Level = {};

Game.Level.conf = {
  one: {
    backgroundColor: '#3a5963'
  }
};

Game.Map = void 0;

Game.Layer = {};

Game.Physics = Phaser.Physics.P2JS;

Game.Gravity = 1500;

Game.Restitution = 0.1;

Game.Debug = true;

Game.Camera = {
  type: Phaser.Camera.FOLLOW_LOCKON,
  speed: {
    x: 0.1,
    y: 0.1
  }
};

window.$GAME = void 0;

_controls = {
  right: 'D',
  left: 'A',
  up: 'SPACEBAR',
  down: 'S',
  fight: 'mouse:leftButton'
};

_player = {
  speed: 300,
  jump: 600,
  jumpTimer: 0,
  jumpStatus: false,
  fightMode: false,
  respawn: void 0
};

$$$game = {};

$$$game.mobs = {};

$$$game.characters = {};

$$$game.conf = {};

window.$$$game = $$$game;

Mobs = {
  Enemy: {},
  Neutral: {}
};

setConfig = function(key, value) {
  return window.$$$game.conf = value;
};
