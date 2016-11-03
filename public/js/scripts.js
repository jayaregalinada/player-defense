
/**
 * Configuration
 */
var $$$game, Game, Mobs, _controls, _player;

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

Mobs = {
  Enemy: {},
  Neutral: {}
};


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
    return this.state.start('Preload');
  }
};


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

var Controls;

Controls = (function() {
  function Controls(game, config) {
    this.game = game;
    this.config = config;
    this.controls = {};
  }


  /**
   * Create a control.
   *
   * @param  {string} key
   *
   * @return {Phaser.Input}
   */

  Controls.prototype.createControl = function(key) {
    if ((key.indexOf('mouse:')) === -1) {
      return this.game.input.keyboard.addKey(Phaser.Keyboard[key]);
    } else {
      return this.game.input.activePointer[key.replace('mouse:', '')];
    }
  };


  /**
   * Create controls.
   *
   * @return {object}
   */

  Controls.prototype.create = function() {
    Object.keys(this.config).forEach((function(_this) {
      return function(val, key) {
        _this.controls[Object.keys(_this.config)[key]] = _this.createControl(_this.config[val]);
      };
    })(this));
    return this.controls;
  };

  return Controls;

})();

Game.Layer = (function() {
  function Layer(game, map, layersName) {
    this.game = game;
    this.map = map;
    this.layersName = layersName;
    this.gameLayers = [];
  }

  Layer.prototype.createLayers = function() {
    this.layersName.forEach((function(_this) {
      return function(val, key) {
        var layer;
        layer = _this.map.createLayer(val);
        layer.resizeWorld();
        _this.gameLayers.push(layer);
        console.log(_this.gameLayers);
      };
    })(this));
  };

  return Layer;

})();

var Helper;

Helper = (function() {
  function Helper(game) {
    this.game = game;
  }

  return Helper;

})();

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
    console.log('New Mob has been loaded', this.name);
  }

  Mob.prototype.loadSprite = function() {
    this.game.load.spritesheet(this.name, this.spriteObj.path, this.spriteObj.x, this.spriteObj.y);
  };

  return Mob;

})();

var Player,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Player = (function(superClass) {
  extend(Player, superClass);

  function Player() {
    return Player.__super__.constructor.apply(this, arguments);
  }


  /**
   * Player create.
   *
   * @param  {number} x Player position x coordinate
   * @param  {number} y Player position y coordinate
   *
   * @return {Phaser.Sprite}
   */

  Player.prototype.create = function(x, y, physics1) {
    var _sprite;
    this.physics = physics1;
    _sprite = this.sprite(x, y);
    this.gameSprite = _sprite;
    this.anchor(_sprite, 0.5, 0.5);
    this.animations.forEach(function(val) {
      _sprite.animations.add(val.name, val.spriteIndex, val.speed, val.loop);
    });
    this.camera(_sprite);
    this.physicsEnable(this.physics);
    this.createPhysics();
    return this;
  };


  /**
   * Create sprite from the spritesheet.
   *
   * @param  {number} posX
   * @param  {number} posY
   *
   * @return {Phaser.Sprite}
   */

  Player.prototype.sprite = function(posX, posY) {
    return this.game.add.sprite(posX, posY, this.name);
  };


  /**
   * Player anchor location.
   *
   * @param  {Phaser.Sprite} sprite
   * @param  {number} x
   * @param  {number} y
   *
   * @return {Phaser.Sprite}
   */

  Player.prototype.anchor = function(sprite, x, y) {
    return sprite.anchor.setTo(x, y);
  };


  /**
   * Create animation.
   *
   * @param  {Phaser.Sprite} sprite
   * @param  {string} name        Name of the animation
   * @param  {array} spriteIndex  Array of index
   * @param  {number} speed       Speed of the animation
   * @param  {bool} $loop         Loop or not
   *
   * @return {Phaser.Animations}
   */

  Player.prototype.createAnimations = function(sprite, name, spriteIndex, speed, $loop) {
    return sprite.animations.add(name, spriteIndex, speed, $loop);
  };


  /**
   * Default animation.
   *
   * @type {Array}
   */

  Player.prototype.animations = [
    {
      name: 'idle',
      spriteIndex: [0, 1, 2, 1],
      speed: 4,
      loop: true
    }, {
      name: 'jump',
      spriteIndex: [6, 7, 18, 19, 20, 8],
      speed: 10,
      loop: false
    }, {
      name: 'run',
      spriteIndex: [3, 4, 5, 4],
      speed: 10,
      loop: true
    }, {
      name: 'fight',
      spriteIndex: [23, 22, 21],
      speed: 10,
      loop: true
    }, {
      name: 'hurt',
      spriteIndex: [9, 10, 11, 10],
      speed: 5,
      loop: false
    }, {
      name: 'falling',
      spriteIndex: [8],
      speed: 1,
      loop: true
    }
  ];


  /**
   * Camera will follow player.
   *
   * @param  {Phaser.Sprite} sprite
   *
   * @return {Phaser.Camera}
   */

  Player.prototype.camera = function(sprite) {
    return this.game.camera.follow(sprite, Game.Camera.type, Game.Camera.speed.x, Game.Camera.speed.y);
  };


  /**
   * Enable physics.
   *
   * @param  {Phaser.Physics} physics
   *
   * @return {Phaser.Physics}
   */

  Player.prototype.physicsEnable = function(physics) {
    return physics.enable(this.gameSprite);
  };


  /**
   * Create Physics.
   * NOTE: MUST! Enable physics first @physicsEnable().
   *
   * @return {void} [description]
   */

  Player.prototype.createPhysics = function() {
    this.physics.collideWorldBounds = true;
    this.getPhysicsBody().fixedRotation = true;
  };


  /**
   * Get Physics Body.
   *
   * @return {Phaser.Physics.Body}
   */

  Player.prototype.getPhysicsBody = function() {
    return this.gameSprite.body;
  };


  /**
   * Update method.
   *
   * @param  {obj} controls Game.Controls
   *
   * @return {void}
   */

  Player.prototype.update = function(controls) {
    this.controls = controls;
    this.getPhysicsBody().velocity.x = 0;
    this.changeJumpStatus();
    this.controlHorizontal('left');
    this.controlHorizontal('right');
    this.controlFight();
    this.controlUp();
    this.animationIdle();
  };

  Player.prototype.animationIdle = function(sprite) {
    var _sprite;
    _sprite = sprite ? sprite : this.gameSprite;
    if ((_sprite.body.velocity.x <= 0 && _sprite.body.velocity.x > -1) && (_sprite.body.velocity.y <= 0 && _sprite.body.velocity.y > -1)) {
      _sprite.animations.play('idle');
    }
  };


  /**
   * Player controls horizontally.
   *
   * @param  {string} leftOrRight
   * @param  {obj} controls    Game.Controls
   *
   * @return {void}
   */

  Player.prototype.controlHorizontal = function(leftOrRight, controls) {
    var _controls;
    _controls = controls ? controls : this.controls;
    if (_controls[leftOrRight].isDown) {
      this.gameSprite.animations.play('run');
      switch (leftOrRight) {
        case 'left':
          this.gameSprite.scale.setTo(-1, 1);
          this.getPhysicsBody().moveLeft(_player.speed);
          return;
        case 'right':
          this.gameSprite.scale.setTo(1, 1);
          this.getPhysicsBody().moveRight(_player.speed);
          return;
      }
    }
  };


  /**
   * Player Jumps when jump button is pressed.
   *
   * @param  {obj} controls Game.Controls
   *
   * @return {void}
   */

  Player.prototype.controlUp = function(controls) {
    var _controls;
    _controls = controls ? controls : this.controls;
    if (_controls.up.isDown && this.checkIfCanJump()) {
      this.gameSprite.animations.play('jump');
      _player.jumpStatus = true;
      this.getPhysicsBody().moveUp(_player.jump);
      _player.jumpTimer = this.game.time.now;
      return;
    }
    if (_controls.up.isDown && !this.checkIfCanJump() && _player.jumpStatus) {
      this.gameSprite.animations.play('jump');
      this.getPhysicsBody().moveUp(_player.jump / 2);
    }
  };


  /**
   * Player fights when fight button is pressed.
   *
   * @param  {obj} controls Game.Controls
   *
   * @return {void}
   */

  Player.prototype.controlFight = function(controls) {
    var _controls;
    _controls = controls ? controls : this.controls;
    if (_controls.fight.isDown) {
      _player.fightMode = true;
      this.gameSprite.animations.play('fight2', false, true);
    } else {
      _player.fightMode = false;
    }
  };


  /**
   * Check if player can jump.
   *
   * @return {bool}
   */

  Player.prototype.checkIfCanJump = function() {
    var c, d, i, result, yAxis;
    yAxis = p2.vec2.fromValues(0, 1);
    result = false;
    i = 0;
    while (i < this.physics.world.narrowphase.contactEquations.length) {
      c = this.physics.world.narrowphase.contactEquations[i];
      if (c.bodyA === this.getPhysicsBody().data || c.bodyB === this.getPhysicsBody().data) {
        d = p2.vec2.dot(c.normalA, yAxis);
        if (c.bodyA === this.getPhysicsBody().data) {
          d *= -1;
        }
        if (d > 0.5) {
          result = true;
        }
      }
      i++;
    }
    return result;
  };

  Player.prototype.changeJumpStatus = function() {
    if (this.game.time.now - _player.jumpTimer > Phaser.Timer.HALF) {
      _player.jumpStatus = false;
    }
  };

  Player.prototype.debugMode = function(x, y) {
    this.game.debug.bodyInfo(this.gameSprite, x, y);
  };

  return Player;

})(Mob);

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Mobs.Enemy.tongue = (function(superClass) {
  extend(tongue, superClass);

  function tongue() {
    return tongue.__super__.constructor.apply(this, arguments);
  }

  return tongue;

})(Mob);


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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZy5qcyIsImJvb3QuanMiLCJwcmVsb2FkLmpzIiwiX0NvbnRyb2xzLmpzIiwiX0dhbWUuTGF5ZXIuanMiLCJfSGVscGVyLmpzIiwiX01vYi5qcyIsIl9QbGF5ZXIuanMiLCJlbmVtaWVzL3Rvbmd1ZS5qcyIsIjEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBDb25maWd1cmF0aW9uXG4gKi9cbnZhciAkJCRnYW1lLCBHYW1lLCBNb2JzLCBfY29udHJvbHMsIF9wbGF5ZXI7XG5cbkdhbWUgPSB7fTtcblxuR2FtZS5MZXZlbCA9IHt9O1xuXG5HYW1lLkxldmVsLmNvbmYgPSB7XG4gIG9uZToge1xuICAgIGJhY2tncm91bmRDb2xvcjogJyMzYTU5NjMnXG4gIH1cbn07XG5cbkdhbWUuTWFwID0gdm9pZCAwO1xuXG5HYW1lLkxheWVyID0ge307XG5cbkdhbWUuUGh5c2ljcyA9IFBoYXNlci5QaHlzaWNzLlAySlM7XG5cbkdhbWUuR3Jhdml0eSA9IDE1MDA7XG5cbkdhbWUuUmVzdGl0dXRpb24gPSAwLjE7XG5cbkdhbWUuRGVidWcgPSB0cnVlO1xuXG5HYW1lLkNhbWVyYSA9IHtcbiAgdHlwZTogUGhhc2VyLkNhbWVyYS5GT0xMT1dfTE9DS09OLFxuICBzcGVlZDoge1xuICAgIHg6IDAuMSxcbiAgICB5OiAwLjFcbiAgfVxufTtcblxud2luZG93LiRHQU1FID0gdm9pZCAwO1xuXG5fY29udHJvbHMgPSB7XG4gIHJpZ2h0OiAnRCcsXG4gIGxlZnQ6ICdBJyxcbiAgdXA6ICdTUEFDRUJBUicsXG4gIGRvd246ICdTJyxcbiAgZmlnaHQ6ICdtb3VzZTpsZWZ0QnV0dG9uJ1xufTtcblxuX3BsYXllciA9IHtcbiAgc3BlZWQ6IDMwMCxcbiAganVtcDogNjAwLFxuICBqdW1wVGltZXI6IDAsXG4gIGp1bXBTdGF0dXM6IGZhbHNlLFxuICBmaWdodE1vZGU6IGZhbHNlLFxuICByZXNwYXduOiB2b2lkIDBcbn07XG5cbiQkJGdhbWUgPSB7fTtcblxuTW9icyA9IHtcbiAgRW5lbXk6IHt9LFxuICBOZXV0cmFsOiB7fVxufTtcbiIsIlxuLyoqXG4gKiBib290LmNvZmZlZVxuICovXG5HYW1lLkJvb3QgPSBmdW5jdGlvbihnYW1lKSB7fTtcblxuR2FtZS5Cb290LnByb3RvdHlwZSA9IHtcbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pbnB1dC5tYXhQb2ludGVycyA9IDE7XG4gIH0sXG4gIHByZWxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCdCb290IGxvYWRpbmcuLi4nKTtcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ3ByZWxvYWRlckltZycsICdhc3NldHMvcHJlbG9hZGVyLmdpZicpO1xuICB9LFxuICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLnN0YXJ0KCdQcmVsb2FkJyk7XG4gIH1cbn07XG4iLCJcbi8qKlxuICogcHJlbG9hZC5jb2ZmZWVcbiAqL1xuR2FtZS5QcmVsb2FkID0gZnVuY3Rpb24oZ2FtZSkge1xuICB0aGlzLnByZWxvYWRlciA9IG51bGw7XG59O1xuXG5HYW1lLlByZWxvYWQucHJvdG90eXBlID0ge1xuICBwcmVsb2FkOiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnUHJlbG9hZCBsb2FkaW5nLi4uJyk7XG4gICAgdGhpcy5wcmVsb2FkZXIgPSB0aGlzLmFkZC5zcHJpdGUodGhpcy53b3JsZC5jZW50ZXJYLCB0aGlzLndvcmxkLmNlbnRlclksICdwcmVsb2FkZXJJbWcnKTtcbiAgICB0aGlzLnRpbWUuYWR2YW5jZVRpbWluZyA9IHRydWU7XG4gICAgdGhpcy5sb2FkLnNldFByZWxvYWRTcHJpdGUodGhpcy5wcmVsb2FkZXIpO1xuICAgIHRoaXMubG9hZC50aWxlbWFwKCdtYXAnLCAnYXNzZXRzL21hcC8xL21hcC5qc29uJywgbnVsbCwgUGhhc2VyLlRpbGVtYXAuVElMRURfSlNPTik7XG4gICAgdGhpcy5sb2FkLmltYWdlKCd0aWxlc2V0JywgJ2Fzc2V0cy9tYXAvMS90aWxlc2V0LnBuZycpO1xuICAgICQkJGdhbWUucGxheWVyID0gbmV3IFBsYXllcih0aGlzLCAncGxheWVyJywge1xuICAgICAgcGF0aDogJ2Fzc2V0cy9wbGF5ZXIva2l0X2Zyb21fZmlyZWZveC5wbmcnLFxuICAgICAgeDogNTYsXG4gICAgICB5OiA4MFxuICAgIH0pO1xuICAgICQkJGdhbWUucGxheWVyLmxvYWRTcHJpdGUoKTtcbiAgICAobmV3IE1vYnMuRW5lbXkudG9uZ3VlKHRoaXMsICdtb2JFbmVteVRvbmd1ZScsIHtcbiAgICAgIHBhdGg6ICdhc3NldHMvbW9iL2VuZW1pZXMvdG9uZ3VlLnBuZycsXG4gICAgICB4OiA0OSxcbiAgICAgIHk6IDQwXG4gICAgfSkpLmxvYWRTcHJpdGUoKTtcbiAgfSxcbiAgY3JlYXRlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0YXRlLnN0YXJ0KCdMZXZlbCAxJyk7XG4gIH1cbn07XG4iLCJ2YXIgQ29udHJvbHM7XG5cbkNvbnRyb2xzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBDb250cm9scyhnYW1lLCBjb25maWcpIHtcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuY29udHJvbHMgPSB7fTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGNvbnRyb2wuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30ga2V5XG4gICAqXG4gICAqIEByZXR1cm4ge1BoYXNlci5JbnB1dH1cbiAgICovXG5cbiAgQ29udHJvbHMucHJvdG90eXBlLmNyZWF0ZUNvbnRyb2wgPSBmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoKGtleS5pbmRleE9mKCdtb3VzZTonKSkgPT09IC0xKSB7XG4gICAgICByZXR1cm4gdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmRba2V5XSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmdhbWUuaW5wdXQuYWN0aXZlUG9pbnRlcltrZXkucmVwbGFjZSgnbW91c2U6JywgJycpXTtcbiAgICB9XG4gIH07XG5cblxuICAvKipcbiAgICogQ3JlYXRlIGNvbnRyb2xzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuXG4gIENvbnRyb2xzLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmNvbmZpZykuZm9yRWFjaCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICBfdGhpcy5jb250cm9sc1tPYmplY3Qua2V5cyhfdGhpcy5jb25maWcpW2tleV1dID0gX3RoaXMuY3JlYXRlQ29udHJvbChfdGhpcy5jb25maWdbdmFsXSk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgICByZXR1cm4gdGhpcy5jb250cm9scztcbiAgfTtcblxuICByZXR1cm4gQ29udHJvbHM7XG5cbn0pKCk7XG4iLCJHYW1lLkxheWVyID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBMYXllcihnYW1lLCBtYXAsIGxheWVyc05hbWUpIHtcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgIHRoaXMubWFwID0gbWFwO1xuICAgIHRoaXMubGF5ZXJzTmFtZSA9IGxheWVyc05hbWU7XG4gICAgdGhpcy5nYW1lTGF5ZXJzID0gW107XG4gIH1cblxuICBMYXllci5wcm90b3R5cGUuY3JlYXRlTGF5ZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sYXllcnNOYW1lLmZvckVhY2goKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgdmFyIGxheWVyO1xuICAgICAgICBsYXllciA9IF90aGlzLm1hcC5jcmVhdGVMYXllcih2YWwpO1xuICAgICAgICBsYXllci5yZXNpemVXb3JsZCgpO1xuICAgICAgICBfdGhpcy5nYW1lTGF5ZXJzLnB1c2gobGF5ZXIpO1xuICAgICAgICBjb25zb2xlLmxvZyhfdGhpcy5nYW1lTGF5ZXJzKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9O1xuXG4gIHJldHVybiBMYXllcjtcblxufSkoKTtcbiIsInZhciBIZWxwZXI7XG5cbkhlbHBlciA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gSGVscGVyKGdhbWUpIHtcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICB9XG5cbiAgcmV0dXJuIEhlbHBlcjtcblxufSkoKTtcbiIsInZhciBNb2I7XG5cbk1vYiA9IChmdW5jdGlvbigpIHtcblxuICAvKipcbiAgICogQ3JlYXRlIE1vYiBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBhcmFtICB7R2FtZX0gQGdhbWVcbiAgICogQHBhcmFtICB7c3RyaW5nfSBAbmFtZVxuICAgKiBAcGFyYW0gIHtvYmplY3R9IEBzcHJpdGVPYmpcbiAgICpcbiAgICogQHJldHVybiB7dm9pZH1cbiAgICovXG4gIGZ1bmN0aW9uIE1vYihnYW1lLCBuYW1lLCBzcHJpdGVPYmopIHtcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5zcHJpdGVPYmogPSBzcHJpdGVPYmo7XG4gICAgY29uc29sZS5sb2coJ05ldyBNb2IgaGFzIGJlZW4gbG9hZGVkJywgdGhpcy5uYW1lKTtcbiAgfVxuXG4gIE1vYi5wcm90b3R5cGUubG9hZFNwcml0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZ2FtZS5sb2FkLnNwcml0ZXNoZWV0KHRoaXMubmFtZSwgdGhpcy5zcHJpdGVPYmoucGF0aCwgdGhpcy5zcHJpdGVPYmoueCwgdGhpcy5zcHJpdGVPYmoueSk7XG4gIH07XG5cbiAgcmV0dXJuIE1vYjtcblxufSkoKTtcbiIsInZhciBQbGF5ZXIsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5QbGF5ZXIgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUGxheWVyLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBQbGF5ZXIoKSB7XG4gICAgcmV0dXJuIFBsYXllci5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFBsYXllciBjcmVhdGUuXG4gICAqXG4gICAqIEBwYXJhbSAge251bWJlcn0geCBQbGF5ZXIgcG9zaXRpb24geCBjb29yZGluYXRlXG4gICAqIEBwYXJhbSAge251bWJlcn0geSBQbGF5ZXIgcG9zaXRpb24geSBjb29yZGluYXRlXG4gICAqXG4gICAqIEByZXR1cm4ge1BoYXNlci5TcHJpdGV9XG4gICAqL1xuXG4gIFBsYXllci5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oeCwgeSwgcGh5c2ljczEpIHtcbiAgICB2YXIgX3Nwcml0ZTtcbiAgICB0aGlzLnBoeXNpY3MgPSBwaHlzaWNzMTtcbiAgICBfc3ByaXRlID0gdGhpcy5zcHJpdGUoeCwgeSk7XG4gICAgdGhpcy5nYW1lU3ByaXRlID0gX3Nwcml0ZTtcbiAgICB0aGlzLmFuY2hvcihfc3ByaXRlLCAwLjUsIDAuNSk7XG4gICAgdGhpcy5hbmltYXRpb25zLmZvckVhY2goZnVuY3Rpb24odmFsKSB7XG4gICAgICBfc3ByaXRlLmFuaW1hdGlvbnMuYWRkKHZhbC5uYW1lLCB2YWwuc3ByaXRlSW5kZXgsIHZhbC5zcGVlZCwgdmFsLmxvb3ApO1xuICAgIH0pO1xuICAgIHRoaXMuY2FtZXJhKF9zcHJpdGUpO1xuICAgIHRoaXMucGh5c2ljc0VuYWJsZSh0aGlzLnBoeXNpY3MpO1xuICAgIHRoaXMuY3JlYXRlUGh5c2ljcygpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBzcHJpdGUgZnJvbSB0aGUgc3ByaXRlc2hlZXQuXG4gICAqXG4gICAqIEBwYXJhbSAge251bWJlcn0gcG9zWFxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IHBvc1lcbiAgICpcbiAgICogQHJldHVybiB7UGhhc2VyLlNwcml0ZX1cbiAgICovXG5cbiAgUGxheWVyLnByb3RvdHlwZS5zcHJpdGUgPSBmdW5jdGlvbihwb3NYLCBwb3NZKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2FtZS5hZGQuc3ByaXRlKHBvc1gsIHBvc1ksIHRoaXMubmFtZSk7XG4gIH07XG5cblxuICAvKipcbiAgICogUGxheWVyIGFuY2hvciBsb2NhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtICB7UGhhc2VyLlNwcml0ZX0gc3ByaXRlXG4gICAqIEBwYXJhbSAge251bWJlcn0geFxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IHlcbiAgICpcbiAgICogQHJldHVybiB7UGhhc2VyLlNwcml0ZX1cbiAgICovXG5cbiAgUGxheWVyLnByb3RvdHlwZS5hbmNob3IgPSBmdW5jdGlvbihzcHJpdGUsIHgsIHkpIHtcbiAgICByZXR1cm4gc3ByaXRlLmFuY2hvci5zZXRUbyh4LCB5KTtcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW5pbWF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gIHtQaGFzZXIuU3ByaXRlfSBzcHJpdGVcbiAgICogQHBhcmFtICB7c3RyaW5nfSBuYW1lICAgICAgICBOYW1lIG9mIHRoZSBhbmltYXRpb25cbiAgICogQHBhcmFtICB7YXJyYXl9IHNwcml0ZUluZGV4ICBBcnJheSBvZiBpbmRleFxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IHNwZWVkICAgICAgIFNwZWVkIG9mIHRoZSBhbmltYXRpb25cbiAgICogQHBhcmFtICB7Ym9vbH0gJGxvb3AgICAgICAgICBMb29wIG9yIG5vdFxuICAgKlxuICAgKiBAcmV0dXJuIHtQaGFzZXIuQW5pbWF0aW9uc31cbiAgICovXG5cbiAgUGxheWVyLnByb3RvdHlwZS5jcmVhdGVBbmltYXRpb25zID0gZnVuY3Rpb24oc3ByaXRlLCBuYW1lLCBzcHJpdGVJbmRleCwgc3BlZWQsICRsb29wKSB7XG4gICAgcmV0dXJuIHNwcml0ZS5hbmltYXRpb25zLmFkZChuYW1lLCBzcHJpdGVJbmRleCwgc3BlZWQsICRsb29wKTtcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBEZWZhdWx0IGFuaW1hdGlvbi5cbiAgICpcbiAgICogQHR5cGUge0FycmF5fVxuICAgKi9cblxuICBQbGF5ZXIucHJvdG90eXBlLmFuaW1hdGlvbnMgPSBbXG4gICAge1xuICAgICAgbmFtZTogJ2lkbGUnLFxuICAgICAgc3ByaXRlSW5kZXg6IFswLCAxLCAyLCAxXSxcbiAgICAgIHNwZWVkOiA0LFxuICAgICAgbG9vcDogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIG5hbWU6ICdqdW1wJyxcbiAgICAgIHNwcml0ZUluZGV4OiBbNiwgNywgMTgsIDE5LCAyMCwgOF0sXG4gICAgICBzcGVlZDogMTAsXG4gICAgICBsb29wOiBmYWxzZVxuICAgIH0sIHtcbiAgICAgIG5hbWU6ICdydW4nLFxuICAgICAgc3ByaXRlSW5kZXg6IFszLCA0LCA1LCA0XSxcbiAgICAgIHNwZWVkOiAxMCxcbiAgICAgIGxvb3A6IHRydWVcbiAgICB9LCB7XG4gICAgICBuYW1lOiAnZmlnaHQnLFxuICAgICAgc3ByaXRlSW5kZXg6IFsyMywgMjIsIDIxXSxcbiAgICAgIHNwZWVkOiAxMCxcbiAgICAgIGxvb3A6IHRydWVcbiAgICB9LCB7XG4gICAgICBuYW1lOiAnaHVydCcsXG4gICAgICBzcHJpdGVJbmRleDogWzksIDEwLCAxMSwgMTBdLFxuICAgICAgc3BlZWQ6IDUsXG4gICAgICBsb29wOiBmYWxzZVxuICAgIH0sIHtcbiAgICAgIG5hbWU6ICdmYWxsaW5nJyxcbiAgICAgIHNwcml0ZUluZGV4OiBbOF0sXG4gICAgICBzcGVlZDogMSxcbiAgICAgIGxvb3A6IHRydWVcbiAgICB9XG4gIF07XG5cblxuICAvKipcbiAgICogQ2FtZXJhIHdpbGwgZm9sbG93IHBsYXllci5cbiAgICpcbiAgICogQHBhcmFtICB7UGhhc2VyLlNwcml0ZX0gc3ByaXRlXG4gICAqXG4gICAqIEByZXR1cm4ge1BoYXNlci5DYW1lcmF9XG4gICAqL1xuXG4gIFBsYXllci5wcm90b3R5cGUuY2FtZXJhID0gZnVuY3Rpb24oc3ByaXRlKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2FtZS5jYW1lcmEuZm9sbG93KHNwcml0ZSwgR2FtZS5DYW1lcmEudHlwZSwgR2FtZS5DYW1lcmEuc3BlZWQueCwgR2FtZS5DYW1lcmEuc3BlZWQueSk7XG4gIH07XG5cblxuICAvKipcbiAgICogRW5hYmxlIHBoeXNpY3MuXG4gICAqXG4gICAqIEBwYXJhbSAge1BoYXNlci5QaHlzaWNzfSBwaHlzaWNzXG4gICAqXG4gICAqIEByZXR1cm4ge1BoYXNlci5QaHlzaWNzfVxuICAgKi9cblxuICBQbGF5ZXIucHJvdG90eXBlLnBoeXNpY3NFbmFibGUgPSBmdW5jdGlvbihwaHlzaWNzKSB7XG4gICAgcmV0dXJuIHBoeXNpY3MuZW5hYmxlKHRoaXMuZ2FtZVNwcml0ZSk7XG4gIH07XG5cblxuICAvKipcbiAgICogQ3JlYXRlIFBoeXNpY3MuXG4gICAqIE5PVEU6IE1VU1QhIEVuYWJsZSBwaHlzaWNzIGZpcnN0IEBwaHlzaWNzRW5hYmxlKCkuXG4gICAqXG4gICAqIEByZXR1cm4ge3ZvaWR9IFtkZXNjcmlwdGlvbl1cbiAgICovXG5cbiAgUGxheWVyLnByb3RvdHlwZS5jcmVhdGVQaHlzaWNzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5waHlzaWNzLmNvbGxpZGVXb3JsZEJvdW5kcyA9IHRydWU7XG4gICAgdGhpcy5nZXRQaHlzaWNzQm9keSgpLmZpeGVkUm90YXRpb24gPSB0cnVlO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIEdldCBQaHlzaWNzIEJvZHkuXG4gICAqXG4gICAqIEByZXR1cm4ge1BoYXNlci5QaHlzaWNzLkJvZHl9XG4gICAqL1xuXG4gIFBsYXllci5wcm90b3R5cGUuZ2V0UGh5c2ljc0JvZHkgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5nYW1lU3ByaXRlLmJvZHk7XG4gIH07XG5cblxuICAvKipcbiAgICogVXBkYXRlIG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtICB7b2JqfSBjb250cm9scyBHYW1lLkNvbnRyb2xzXG4gICAqXG4gICAqIEByZXR1cm4ge3ZvaWR9XG4gICAqL1xuXG4gIFBsYXllci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oY29udHJvbHMpIHtcbiAgICB0aGlzLmNvbnRyb2xzID0gY29udHJvbHM7XG4gICAgdGhpcy5nZXRQaHlzaWNzQm9keSgpLnZlbG9jaXR5LnggPSAwO1xuICAgIHRoaXMuY2hhbmdlSnVtcFN0YXR1cygpO1xuICAgIHRoaXMuY29udHJvbEhvcml6b250YWwoJ2xlZnQnKTtcbiAgICB0aGlzLmNvbnRyb2xIb3Jpem9udGFsKCdyaWdodCcpO1xuICAgIHRoaXMuY29udHJvbEZpZ2h0KCk7XG4gICAgdGhpcy5jb250cm9sVXAoKTtcbiAgICB0aGlzLmFuaW1hdGlvbklkbGUoKTtcbiAgfTtcblxuICBQbGF5ZXIucHJvdG90eXBlLmFuaW1hdGlvbklkbGUgPSBmdW5jdGlvbihzcHJpdGUpIHtcbiAgICB2YXIgX3Nwcml0ZTtcbiAgICBfc3ByaXRlID0gc3ByaXRlID8gc3ByaXRlIDogdGhpcy5nYW1lU3ByaXRlO1xuICAgIGlmICgoX3Nwcml0ZS5ib2R5LnZlbG9jaXR5LnggPD0gMCAmJiBfc3ByaXRlLmJvZHkudmVsb2NpdHkueCA+IC0xKSAmJiAoX3Nwcml0ZS5ib2R5LnZlbG9jaXR5LnkgPD0gMCAmJiBfc3ByaXRlLmJvZHkudmVsb2NpdHkueSA+IC0xKSkge1xuICAgICAgX3Nwcml0ZS5hbmltYXRpb25zLnBsYXkoJ2lkbGUnKTtcbiAgICB9XG4gIH07XG5cblxuICAvKipcbiAgICogUGxheWVyIGNvbnRyb2xzIGhvcml6b250YWxseS5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSBsZWZ0T3JSaWdodFxuICAgKiBAcGFyYW0gIHtvYmp9IGNvbnRyb2xzICAgIEdhbWUuQ29udHJvbHNcbiAgICpcbiAgICogQHJldHVybiB7dm9pZH1cbiAgICovXG5cbiAgUGxheWVyLnByb3RvdHlwZS5jb250cm9sSG9yaXpvbnRhbCA9IGZ1bmN0aW9uKGxlZnRPclJpZ2h0LCBjb250cm9scykge1xuICAgIHZhciBfY29udHJvbHM7XG4gICAgX2NvbnRyb2xzID0gY29udHJvbHMgPyBjb250cm9scyA6IHRoaXMuY29udHJvbHM7XG4gICAgaWYgKF9jb250cm9sc1tsZWZ0T3JSaWdodF0uaXNEb3duKSB7XG4gICAgICB0aGlzLmdhbWVTcHJpdGUuYW5pbWF0aW9ucy5wbGF5KCdydW4nKTtcbiAgICAgIHN3aXRjaCAobGVmdE9yUmlnaHQpIHtcbiAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgdGhpcy5nYW1lU3ByaXRlLnNjYWxlLnNldFRvKC0xLCAxKTtcbiAgICAgICAgICB0aGlzLmdldFBoeXNpY3NCb2R5KCkubW92ZUxlZnQoX3BsYXllci5zcGVlZCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgdGhpcy5nYW1lU3ByaXRlLnNjYWxlLnNldFRvKDEsIDEpO1xuICAgICAgICAgIHRoaXMuZ2V0UGh5c2ljc0JvZHkoKS5tb3ZlUmlnaHQoX3BsYXllci5zcGVlZCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuXG4gIC8qKlxuICAgKiBQbGF5ZXIgSnVtcHMgd2hlbiBqdW1wIGJ1dHRvbiBpcyBwcmVzc2VkLlxuICAgKlxuICAgKiBAcGFyYW0gIHtvYmp9IGNvbnRyb2xzIEdhbWUuQ29udHJvbHNcbiAgICpcbiAgICogQHJldHVybiB7dm9pZH1cbiAgICovXG5cbiAgUGxheWVyLnByb3RvdHlwZS5jb250cm9sVXAgPSBmdW5jdGlvbihjb250cm9scykge1xuICAgIHZhciBfY29udHJvbHM7XG4gICAgX2NvbnRyb2xzID0gY29udHJvbHMgPyBjb250cm9scyA6IHRoaXMuY29udHJvbHM7XG4gICAgaWYgKF9jb250cm9scy51cC5pc0Rvd24gJiYgdGhpcy5jaGVja0lmQ2FuSnVtcCgpKSB7XG4gICAgICB0aGlzLmdhbWVTcHJpdGUuYW5pbWF0aW9ucy5wbGF5KCdqdW1wJyk7XG4gICAgICBfcGxheWVyLmp1bXBTdGF0dXMgPSB0cnVlO1xuICAgICAgdGhpcy5nZXRQaHlzaWNzQm9keSgpLm1vdmVVcChfcGxheWVyLmp1bXApO1xuICAgICAgX3BsYXllci5qdW1wVGltZXIgPSB0aGlzLmdhbWUudGltZS5ub3c7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChfY29udHJvbHMudXAuaXNEb3duICYmICF0aGlzLmNoZWNrSWZDYW5KdW1wKCkgJiYgX3BsYXllci5qdW1wU3RhdHVzKSB7XG4gICAgICB0aGlzLmdhbWVTcHJpdGUuYW5pbWF0aW9ucy5wbGF5KCdqdW1wJyk7XG4gICAgICB0aGlzLmdldFBoeXNpY3NCb2R5KCkubW92ZVVwKF9wbGF5ZXIuanVtcCAvIDIpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qKlxuICAgKiBQbGF5ZXIgZmlnaHRzIHdoZW4gZmlnaHQgYnV0dG9uIGlzIHByZXNzZWQuXG4gICAqXG4gICAqIEBwYXJhbSAge29ian0gY29udHJvbHMgR2FtZS5Db250cm9sc1xuICAgKlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cblxuICBQbGF5ZXIucHJvdG90eXBlLmNvbnRyb2xGaWdodCA9IGZ1bmN0aW9uKGNvbnRyb2xzKSB7XG4gICAgdmFyIF9jb250cm9scztcbiAgICBfY29udHJvbHMgPSBjb250cm9scyA/IGNvbnRyb2xzIDogdGhpcy5jb250cm9scztcbiAgICBpZiAoX2NvbnRyb2xzLmZpZ2h0LmlzRG93bikge1xuICAgICAgX3BsYXllci5maWdodE1vZGUgPSB0cnVlO1xuICAgICAgdGhpcy5nYW1lU3ByaXRlLmFuaW1hdGlvbnMucGxheSgnZmlnaHQyJywgZmFsc2UsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBfcGxheWVyLmZpZ2h0TW9kZSA9IGZhbHNlO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBwbGF5ZXIgY2FuIGp1bXAuXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2x9XG4gICAqL1xuXG4gIFBsYXllci5wcm90b3R5cGUuY2hlY2tJZkNhbkp1bXAgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYywgZCwgaSwgcmVzdWx0LCB5QXhpcztcbiAgICB5QXhpcyA9IHAyLnZlYzIuZnJvbVZhbHVlcygwLCAxKTtcbiAgICByZXN1bHQgPSBmYWxzZTtcbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHRoaXMucGh5c2ljcy53b3JsZC5uYXJyb3dwaGFzZS5jb250YWN0RXF1YXRpb25zLmxlbmd0aCkge1xuICAgICAgYyA9IHRoaXMucGh5c2ljcy53b3JsZC5uYXJyb3dwaGFzZS5jb250YWN0RXF1YXRpb25zW2ldO1xuICAgICAgaWYgKGMuYm9keUEgPT09IHRoaXMuZ2V0UGh5c2ljc0JvZHkoKS5kYXRhIHx8IGMuYm9keUIgPT09IHRoaXMuZ2V0UGh5c2ljc0JvZHkoKS5kYXRhKSB7XG4gICAgICAgIGQgPSBwMi52ZWMyLmRvdChjLm5vcm1hbEEsIHlBeGlzKTtcbiAgICAgICAgaWYgKGMuYm9keUEgPT09IHRoaXMuZ2V0UGh5c2ljc0JvZHkoKS5kYXRhKSB7XG4gICAgICAgICAgZCAqPSAtMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZCA+IDAuNSkge1xuICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICBQbGF5ZXIucHJvdG90eXBlLmNoYW5nZUp1bXBTdGF0dXMgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5nYW1lLnRpbWUubm93IC0gX3BsYXllci5qdW1wVGltZXIgPiBQaGFzZXIuVGltZXIuSEFMRikge1xuICAgICAgX3BsYXllci5qdW1wU3RhdHVzID0gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIFBsYXllci5wcm90b3R5cGUuZGVidWdNb2RlID0gZnVuY3Rpb24oeCwgeSkge1xuICAgIHRoaXMuZ2FtZS5kZWJ1Zy5ib2R5SW5mbyh0aGlzLmdhbWVTcHJpdGUsIHgsIHkpO1xuICB9O1xuXG4gIHJldHVybiBQbGF5ZXI7XG5cbn0pKE1vYik7XG4iLCJ2YXIgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbk1vYnMuRW5lbXkudG9uZ3VlID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKHRvbmd1ZSwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gdG9uZ3VlKCkge1xuICAgIHJldHVybiB0b25ndWUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gdG9uZ3VlO1xuXG59KShNb2IpO1xuIiwiXG4vKipcbiAqIExldmVsIDFcbiAqL1xudmFyIF90aW1lO1xuXG5HYW1lLkxldmVsLm9uZSA9IGZ1bmN0aW9uKGdhbWUpIHt9O1xuXG5fdGltZSA9IHZvaWQgMDtcblxuR2FtZS5MZXZlbC5vbmUucHJvdG90eXBlID0ge1xuICBwcmVsb2FkOiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnTG9hZGluZyBMZXZlbCAxIC4uLicpO1xuICB9LFxuICBjcmVhdGU6IGZ1bmN0aW9uKCRnYW1lKSB7XG4gICAgY29uc29sZS5sb2coJ0xldmVsIDE6OmNyZWF0ZScsICRnYW1lLCB0aGlzKTtcbiAgICB0aGlzLnN0YWdlLmJhY2tncm91bmRDb2xvciA9IEdhbWUuTGV2ZWwuY29uZi5vbmUuYmFja2dyb3VuZENvbG9yO1xuICAgIHRoaXMucGh5c2ljcy5zdGFydFN5c3RlbShHYW1lLlBoeXNpY3MpO1xuICAgIHRoaXMucGh5c2ljcy5wMi5hcHBseUdyYXZpdHkgPSB0cnVlO1xuICAgIHRoaXMucGh5c2ljcy5wMi5zZXRJbXBhY3RFdmVudHModHJ1ZSk7XG4gICAgdGhpcy5waHlzaWNzLnAyLmFwcGx5U3ByaW5nRm9yY2VzID0gdHJ1ZTtcbiAgICBHYW1lLk1hcCA9IHRoaXMuYWRkLnRpbGVtYXAoJ21hcCcpO1xuICAgIEdhbWUuTWFwLmFkZFRpbGVzZXRJbWFnZSgndGlsZXNldCcpO1xuICAgICQkJGdhbWUubGF5ZXIgPSBuZXcgR2FtZS5MYXllcigkZ2FtZSwgR2FtZS5NYXAsIFsnR3JvdW5kJywgJ1BsYXRmb3JtJywgJ0Flc3RoZXRpY3MnLCAnUG93ZXJ1cHMnXSk7XG4gICAgJCQkZ2FtZS5sYXllci5jcmVhdGVMYXllcnMoKTtcbiAgICBHYW1lLk1hcC5zZXRDb2xsaXNpb25CZXR3ZWVuKDAsIDI1NiwgdHJ1ZSwgJ0dyb3VuZCcpO1xuICAgIEdhbWUuTWFwLnNldENvbGxpc2lvbkJldHdlZW4oMCwgMjU2LCB0cnVlLCAnUGxhdGZvcm0nKTtcbiAgICBfcGxheWVyLnJlc3Bhd24gPSB0aGlzLmFkZC5ncm91cCgpO1xuICAgIEdhbWUuTWFwLmNyZWF0ZUZyb21PYmplY3RzKCdTcGF3bnBvaW50JywgNSwgJycsIDAsIHRydWUsIGZhbHNlLCBfcGxheWVyLnJlc3Bhd24pO1xuICAgIEdhbWUuQ29udHJvbHMgPSAobmV3IENvbnRyb2xzKHRoaXMsIF9jb250cm9scykpLmNyZWF0ZSgpO1xuICAgIHRoaXMucGh5c2ljcy5wMi5jb252ZXJ0VGlsZW1hcChHYW1lLk1hcCwgJCQkZ2FtZS5sYXllci5nYW1lTGF5ZXJzWzBdKTtcbiAgICB0aGlzLnBoeXNpY3MucDIuY29udmVydFRpbGVtYXAoR2FtZS5NYXAsICQkJGdhbWUubGF5ZXIuZ2FtZUxheWVyc1sxXSk7XG4gICAgJCQkZ2FtZS5wbGF5ZXIuY3JlYXRlKDAsIDAsIHRoaXMucGh5c2ljcy5wMik7XG4gICAgdGhpcy5waHlzaWNzLnAyLnJlc3RpdHV0aW9uID0gR2FtZS5SZXN0aXR1dGlvbjtcbiAgICB0aGlzLnBoeXNpY3MucDIuZ3Jhdml0eS55ID0gR2FtZS5HcmF2aXR5O1xuICAgIHRoaXMuc3Bhd24oKTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbigkdXBkYXRlKSB7XG4gICAgJCQkZ2FtZS5wbGF5ZXIudXBkYXRlKEdhbWUuQ29udHJvbHMpO1xuICAgIGlmIChHYW1lLkNvbnRyb2xzLnVwLmlzRG93bikge1xuICAgICAgaWYgKEdhbWUuQ29udHJvbHMucmlnaHQuaXNEb3duKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdVUCBhbmQgUklHSFQnLCAkJCRnYW1lLnBsYXllci5nYW1lU3ByaXRlKTtcbiAgICAgIH1cbiAgICAgIGlmIChHYW1lLkNvbnRyb2xzLmxlZnQuaXNEb3duKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdVUCBhbmQgTEVGVCcpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigkZ2FtZSkge1xuICAgICRnYW1lLmRlYnVnLmJvZHlJbmZvKCQkJGdhbWUucGxheWVyLmdhbWVTcHJpdGUsIDMyLCAzMik7XG4gIH0sXG4gIG5vTW9yZUp1bXA6IGZ1bmN0aW9uKCkge1xuICAgIFBsYXllci5qdW1wU3RhdHVzID0gZmFsc2U7XG4gICAgY29uc29sZS5sb2coJ05vIG1vcmUgSnVtcCEnKTtcbiAgfSxcbiAgc3Bhd246IGZ1bmN0aW9uKCkge1xuICAgIF9wbGF5ZXIucmVzcGF3bi5mb3JFYWNoKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHNwYXduUG9pbnQpIHtcbiAgICAgICAgJCQkZ2FtZS5wbGF5ZXIuZ2FtZVNwcml0ZS5yZXNldChzcGF3blBvaW50LngsIHNwYXduUG9pbnQueSk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfSxcbiAgY2hlY2tIaXQ6IGZ1bmN0aW9uKHNwcml0ZUEsIHNwcml0ZUIpIHtcbiAgICB2YXIgYm91bmRzLCBpbnRlcnNlY3RzO1xuICAgIGJvdW5kcyA9IFtzcHJpdGVBLmdldEJvdW5kcygpLCBzcHJpdGVCLmdldEJvdW5kcygpXTtcbiAgICBpbnRlcnNlY3RzID0gUGhhc2VyLlJlY3RhbmdsZS5pbnRlcnNlY3RzKGJvdW5kc1swXSwgYm91bmRzWzFdKTtcbiAgICBpZiAoaW50ZXJzZWN0cykge1xuICAgICAgY29uc29sZS5sb2coJ2NoZWNrSGl0JywgaW50ZXJzZWN0cywgYm91bmRzKTtcbiAgICB9XG4gICAgcmV0dXJuIGludGVyc2VjdHM7XG4gIH1cbn07XG4iXX0=
