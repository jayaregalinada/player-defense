
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

$$$game.mobs = {};

$$$game.characters = {};

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
    this.state.start('Preload');
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

Game.Menu = function(game) {};

Game.Menu.prototype = {
  preload: function($game) {},
  create: function($game) {
    var char_kit, char_pacman, char_wilber, m1, m2, m3;
    m1 = this.add.button(this.world.centerX - 300, this.world.centerY, 'button_play', function() {
      char_kit.animations.play('fight');
    }, this, 2, 1, 0);
    char_kit = $$$game.characters.kit.sprite(0, 0);
    $$$game.characters.kit.loadAnimations(char_kit);
    char_kit.alignTo(m1, Phaser.TOP_CENTER, 0, 10);
    char_kit.animations.play('idle');
    m2 = this.add.button(0, 0, 'button_play', function() {
      char_pacman.animations.play('fight');
    }, this, 2, 1, 0);
    m2.alignTo(m1, Phaser.RIGHT_CENTER, 16);
    char_pacman = $$$game.characters.pacman.sprite(0, 0);
    $$$game.characters.pacman.loadAnimations(char_pacman);
    char_pacman.alignTo(m2, Phaser.TOP_CENTER, 0, 10);
    char_pacman.animations.play('idle');
    m3 = this.add.button(0, 0, 'button_play', function() {
      char_wilber.animations.play('fight');
    }, this, 2, 1, 0);
    m3.alignTo(m2, Phaser.RIGHT_CENTER, 16);
    char_wilber = $$$game.characters.wilber.sprite(0, 0);
    $$$game.characters.wilber.loadAnimations(char_wilber);
    char_wilber.alignTo(m3, Phaser.TOP_CENTER, 0, 10);
    char_wilber.animations.play('idle');
  },
  update: function($game) {},
  createButton: function($game, string, x, y, width, height, callback) {
    var button;
    button = $game.add.button(x, y, 'button_play', callback, this, 2, 1, 0);
    button.anchor.setTo(0.5, 0.5);
    button.width = width;
    button.height = height;
  },
  buttonClicked: function() {
    console.log('buttonClicked');
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

  Helper.prototype.loadImages = function(images) {
    images.forEach((function(_this) {
      return function(val, key, arr) {
        var img;
        img = val.split('|');
        _this.game.load.image(img[0], img[1]);
      };
    })(this));
    return this;
  };

  Helper.prototype.loadSpritesheets = function(images) {
    images.forEach((function(_this) {
      return function(val, key, arr) {
        var img;
        img = val.split('|');
        _this.game.load.spritesheet(img[0], img[1], parseInt(img[2], parseInt(img[3])));
      };
    })(this));
    return this;
  };

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

  Player.prototype.loadAnimations = function(sprite) {
    this.animations.forEach(function(val) {
      sprite.animations.add(val.name, val.spriteIndex, val.speed, val.loop);
    });
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZy5qcyIsImJvb3QuanMiLCJwcmVsb2FkLmpzIiwibWVudS5qcyIsIl9Db250cm9scy5qcyIsIl9HYW1lLkxheWVyLmpzIiwiX0hlbHBlci5qcyIsIl9Nb2IuanMiLCJfUGxheWVyLmpzIiwiZW5lbWllcy90b25ndWUuanMiLCIxLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBDb25maWd1cmF0aW9uXG4gKi9cbnZhciAkJCRnYW1lLCBHYW1lLCBNb2JzLCBfY29udHJvbHMsIF9wbGF5ZXI7XG5cbkdhbWUgPSB7fTtcblxuR2FtZS5MZXZlbCA9IHt9O1xuXG5HYW1lLkxldmVsLmNvbmYgPSB7XG4gIG9uZToge1xuICAgIGJhY2tncm91bmRDb2xvcjogJyMzYTU5NjMnXG4gIH1cbn07XG5cbkdhbWUuTWFwID0gdm9pZCAwO1xuXG5HYW1lLkxheWVyID0ge307XG5cbkdhbWUuUGh5c2ljcyA9IFBoYXNlci5QaHlzaWNzLlAySlM7XG5cbkdhbWUuR3Jhdml0eSA9IDE1MDA7XG5cbkdhbWUuUmVzdGl0dXRpb24gPSAwLjE7XG5cbkdhbWUuRGVidWcgPSB0cnVlO1xuXG5HYW1lLkNhbWVyYSA9IHtcbiAgdHlwZTogUGhhc2VyLkNhbWVyYS5GT0xMT1dfTE9DS09OLFxuICBzcGVlZDoge1xuICAgIHg6IDAuMSxcbiAgICB5OiAwLjFcbiAgfVxufTtcblxud2luZG93LiRHQU1FID0gdm9pZCAwO1xuXG5fY29udHJvbHMgPSB7XG4gIHJpZ2h0OiAnRCcsXG4gIGxlZnQ6ICdBJyxcbiAgdXA6ICdTUEFDRUJBUicsXG4gIGRvd246ICdTJyxcbiAgZmlnaHQ6ICdtb3VzZTpsZWZ0QnV0dG9uJ1xufTtcblxuX3BsYXllciA9IHtcbiAgc3BlZWQ6IDMwMCxcbiAganVtcDogNjAwLFxuICBqdW1wVGltZXI6IDAsXG4gIGp1bXBTdGF0dXM6IGZhbHNlLFxuICBmaWdodE1vZGU6IGZhbHNlLFxuICByZXNwYXduOiB2b2lkIDBcbn07XG5cbiQkJGdhbWUgPSB7fTtcblxuJCQkZ2FtZS5tb2JzID0ge307XG5cbiQkJGdhbWUuY2hhcmFjdGVycyA9IHt9O1xuXG5Nb2JzID0ge1xuICBFbmVteToge30sXG4gIE5ldXRyYWw6IHt9XG59O1xuIiwiXG4vKipcbiAqIGJvb3QuY29mZmVlXG4gKi9cbkdhbWUuQm9vdCA9IGZ1bmN0aW9uKGdhbWUpIHt9O1xuXG5HYW1lLkJvb3QucHJvdG90eXBlID0ge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmlucHV0Lm1heFBvaW50ZXJzID0gMTtcbiAgfSxcbiAgcHJlbG9hZDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coJ0Jvb3QgbG9hZGluZy4uLicpO1xuICAgIHRoaXMubG9hZC5pbWFnZSgncHJlbG9hZGVySW1nJywgJ2Fzc2V0cy9wcmVsb2FkZXIuZ2lmJyk7XG4gIH0sXG4gIGNyZWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zdGF0ZS5zdGFydCgnUHJlbG9hZCcpO1xuICB9XG59O1xuIiwiXG4vKipcbiAqIHByZWxvYWQuY29mZmVlXG4gKi9cbkdhbWUuUHJlbG9hZCA9IGZ1bmN0aW9uKGdhbWUpIHtcbiAgdGhpcy5wcmVsb2FkZXIgPSBudWxsO1xufTtcblxuR2FtZS5QcmVsb2FkLnByb3RvdHlwZSA9IHtcbiAgcHJlbG9hZDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coJ1ByZWxvYWQgbG9hZGluZy4uLicpO1xuICAgIHRoaXMucHJlbG9hZGVyID0gdGhpcy5hZGQuc3ByaXRlKHRoaXMud29ybGQuY2VudGVyWCwgdGhpcy53b3JsZC5jZW50ZXJZLCAncHJlbG9hZGVySW1nJyk7XG4gICAgdGhpcy50aW1lLmFkdmFuY2VUaW1pbmcgPSB0cnVlO1xuICAgIHRoaXMubG9hZC5zZXRQcmVsb2FkU3ByaXRlKHRoaXMucHJlbG9hZGVyKTtcbiAgICB0aGlzLmxvYWQudGlsZW1hcCgnbWFwJywgJ2Fzc2V0cy9tYXAvMS9tYXAuanNvbicsIG51bGwsIFBoYXNlci5UaWxlbWFwLlRJTEVEX0pTT04pO1xuICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnYnV0dG9uX3BsYXknLCAnYXNzZXRzL2J1dHRvbnMvcGxheS5wbmcnLCAyMDAsIDUwKTtcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ3RpbGVzZXQnLCAnYXNzZXRzL21hcC8xL3RpbGVzZXQucG5nJyk7XG4gICAgJCQkZ2FtZS5jaGFyYWN0ZXJzLmtpdCA9IG5ldyBQbGF5ZXIodGhpcywgJ2tpdCcsIHtcbiAgICAgIHBhdGg6ICdhc3NldHMvcGxheWVyL2tpdF9mcm9tX2ZpcmVmb3gucG5nJyxcbiAgICAgIHg6IDQyLFxuICAgICAgeTogNjBcbiAgICB9KTtcbiAgICAkJCRnYW1lLmNoYXJhY3RlcnMua2l0LmxvYWRTcHJpdGUoKTtcbiAgICAkJCRnYW1lLmNoYXJhY3RlcnMucGFjbWFuID0gbmV3IFBsYXllcih0aGlzLCAncGFjbWFuJywge1xuICAgICAgcGF0aDogJ2Fzc2V0cy9wbGF5ZXIvcGFjbWFuX2Zyb21fcGhpbGlwcGluZXMucG5nJyxcbiAgICAgIHg6IDQyLFxuICAgICAgeTogNjBcbiAgICB9KTtcbiAgICAkJCRnYW1lLmNoYXJhY3RlcnMucGFjbWFuLmxvYWRTcHJpdGUoKTtcbiAgICAkJCRnYW1lLmNoYXJhY3RlcnMud2lsYmVyID0gbmV3IFBsYXllcih0aGlzLCAnd2lsYmVyJywge1xuICAgICAgcGF0aDogJ2Fzc2V0cy9wbGF5ZXIvd2lsYmVyX2Zyb21fZ2ltcC5wbmcnLFxuICAgICAgeDogNDIsXG4gICAgICB5OiA2MFxuICAgIH0pO1xuICAgICQkJGdhbWUuY2hhcmFjdGVycy53aWxiZXIubG9hZFNwcml0ZSgpO1xuICAgICQkJGdhbWUubW9icy50b25ndWUgPSBuZXcgTW9icy5FbmVteS50b25ndWUodGhpcywgJ21vYkVuZW15VG9uZ3VlJywge1xuICAgICAgcGF0aDogJ2Fzc2V0cy9tb2IvZW5lbWllcy90b25ndWUucG5nJyxcbiAgICAgIHg6IDQ5LFxuICAgICAgeTogNDBcbiAgICB9KTtcbiAgICAkJCRnYW1lLm1vYnMudG9uZ3VlLmxvYWRTcHJpdGUoKTtcbiAgfSxcbiAgY3JlYXRlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0YXRlLnN0YXJ0KCdNZW51Jyk7XG4gIH1cbn07XG4iLCJHYW1lLk1lbnUgPSBmdW5jdGlvbihnYW1lKSB7fTtcblxuR2FtZS5NZW51LnByb3RvdHlwZSA9IHtcbiAgcHJlbG9hZDogZnVuY3Rpb24oJGdhbWUpIHt9LFxuICBjcmVhdGU6IGZ1bmN0aW9uKCRnYW1lKSB7XG4gICAgdmFyIGNoYXJfa2l0LCBjaGFyX3BhY21hbiwgY2hhcl93aWxiZXIsIG0xLCBtMiwgbTM7XG4gICAgbTEgPSB0aGlzLmFkZC5idXR0b24odGhpcy53b3JsZC5jZW50ZXJYIC0gMzAwLCB0aGlzLndvcmxkLmNlbnRlclksICdidXR0b25fcGxheScsIGZ1bmN0aW9uKCkge1xuICAgICAgY2hhcl9raXQuYW5pbWF0aW9ucy5wbGF5KCdmaWdodCcpO1xuICAgIH0sIHRoaXMsIDIsIDEsIDApO1xuICAgIGNoYXJfa2l0ID0gJCQkZ2FtZS5jaGFyYWN0ZXJzLmtpdC5zcHJpdGUoMCwgMCk7XG4gICAgJCQkZ2FtZS5jaGFyYWN0ZXJzLmtpdC5sb2FkQW5pbWF0aW9ucyhjaGFyX2tpdCk7XG4gICAgY2hhcl9raXQuYWxpZ25UbyhtMSwgUGhhc2VyLlRPUF9DRU5URVIsIDAsIDEwKTtcbiAgICBjaGFyX2tpdC5hbmltYXRpb25zLnBsYXkoJ2lkbGUnKTtcbiAgICBtMiA9IHRoaXMuYWRkLmJ1dHRvbigwLCAwLCAnYnV0dG9uX3BsYXknLCBmdW5jdGlvbigpIHtcbiAgICAgIGNoYXJfcGFjbWFuLmFuaW1hdGlvbnMucGxheSgnZmlnaHQnKTtcbiAgICB9LCB0aGlzLCAyLCAxLCAwKTtcbiAgICBtMi5hbGlnblRvKG0xLCBQaGFzZXIuUklHSFRfQ0VOVEVSLCAxNik7XG4gICAgY2hhcl9wYWNtYW4gPSAkJCRnYW1lLmNoYXJhY3RlcnMucGFjbWFuLnNwcml0ZSgwLCAwKTtcbiAgICAkJCRnYW1lLmNoYXJhY3RlcnMucGFjbWFuLmxvYWRBbmltYXRpb25zKGNoYXJfcGFjbWFuKTtcbiAgICBjaGFyX3BhY21hbi5hbGlnblRvKG0yLCBQaGFzZXIuVE9QX0NFTlRFUiwgMCwgMTApO1xuICAgIGNoYXJfcGFjbWFuLmFuaW1hdGlvbnMucGxheSgnaWRsZScpO1xuICAgIG0zID0gdGhpcy5hZGQuYnV0dG9uKDAsIDAsICdidXR0b25fcGxheScsIGZ1bmN0aW9uKCkge1xuICAgICAgY2hhcl93aWxiZXIuYW5pbWF0aW9ucy5wbGF5KCdmaWdodCcpO1xuICAgIH0sIHRoaXMsIDIsIDEsIDApO1xuICAgIG0zLmFsaWduVG8obTIsIFBoYXNlci5SSUdIVF9DRU5URVIsIDE2KTtcbiAgICBjaGFyX3dpbGJlciA9ICQkJGdhbWUuY2hhcmFjdGVycy53aWxiZXIuc3ByaXRlKDAsIDApO1xuICAgICQkJGdhbWUuY2hhcmFjdGVycy53aWxiZXIubG9hZEFuaW1hdGlvbnMoY2hhcl93aWxiZXIpO1xuICAgIGNoYXJfd2lsYmVyLmFsaWduVG8obTMsIFBoYXNlci5UT1BfQ0VOVEVSLCAwLCAxMCk7XG4gICAgY2hhcl93aWxiZXIuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJyk7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24oJGdhbWUpIHt9LFxuICBjcmVhdGVCdXR0b246IGZ1bmN0aW9uKCRnYW1lLCBzdHJpbmcsIHgsIHksIHdpZHRoLCBoZWlnaHQsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGJ1dHRvbjtcbiAgICBidXR0b24gPSAkZ2FtZS5hZGQuYnV0dG9uKHgsIHksICdidXR0b25fcGxheScsIGNhbGxiYWNrLCB0aGlzLCAyLCAxLCAwKTtcbiAgICBidXR0b24uYW5jaG9yLnNldFRvKDAuNSwgMC41KTtcbiAgICBidXR0b24ud2lkdGggPSB3aWR0aDtcbiAgICBidXR0b24uaGVpZ2h0ID0gaGVpZ2h0O1xuICB9LFxuICBidXR0b25DbGlja2VkOiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnYnV0dG9uQ2xpY2tlZCcpO1xuICB9XG59O1xuIiwidmFyIENvbnRyb2xzO1xuXG5Db250cm9scyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gQ29udHJvbHMoZ2FtZSwgY29uZmlnKSB7XG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLmNvbnRyb2xzID0ge307XG4gIH1cblxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IGtleVxuICAgKlxuICAgKiBAcmV0dXJuIHtQaGFzZXIuSW5wdXR9XG4gICAqL1xuXG4gIENvbnRyb2xzLnByb3RvdHlwZS5jcmVhdGVDb250cm9sID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKChrZXkuaW5kZXhPZignbW91c2U6JykpID09PSAtMSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkW2tleV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5nYW1lLmlucHV0LmFjdGl2ZVBvaW50ZXJba2V5LnJlcGxhY2UoJ21vdXNlOicsICcnKV07XG4gICAgfVxuICB9O1xuXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBjb250cm9scy5cbiAgICpcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cblxuICBDb250cm9scy5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5jb25maWcpLmZvckVhY2goKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgX3RoaXMuY29udHJvbHNbT2JqZWN0LmtleXMoX3RoaXMuY29uZmlnKVtrZXldXSA9IF90aGlzLmNyZWF0ZUNvbnRyb2woX3RoaXMuY29uZmlnW3ZhbF0pO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbHM7XG4gIH07XG5cbiAgcmV0dXJuIENvbnRyb2xzO1xuXG59KSgpO1xuIiwiR2FtZS5MYXllciA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gTGF5ZXIoZ2FtZSwgbWFwLCBsYXllcnNOYW1lKSB7XG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICB0aGlzLm1hcCA9IG1hcDtcbiAgICB0aGlzLmxheWVyc05hbWUgPSBsYXllcnNOYW1lO1xuICAgIHRoaXMuZ2FtZUxheWVycyA9IFtdO1xuICB9XG5cbiAgTGF5ZXIucHJvdG90eXBlLmNyZWF0ZUxheWVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubGF5ZXJzTmFtZS5mb3JFYWNoKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgIHZhciBsYXllcjtcbiAgICAgICAgbGF5ZXIgPSBfdGhpcy5tYXAuY3JlYXRlTGF5ZXIodmFsKTtcbiAgICAgICAgbGF5ZXIucmVzaXplV29ybGQoKTtcbiAgICAgICAgX3RoaXMuZ2FtZUxheWVycy5wdXNoKGxheWVyKTtcbiAgICAgICAgY29uc29sZS5sb2coX3RoaXMuZ2FtZUxheWVycyk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfTtcblxuICByZXR1cm4gTGF5ZXI7XG5cbn0pKCk7XG4iLCJ2YXIgSGVscGVyO1xuXG5IZWxwZXIgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIEhlbHBlcihnYW1lKSB7XG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgfVxuXG4gIEhlbHBlci5wcm90b3R5cGUubG9hZEltYWdlcyA9IGZ1bmN0aW9uKGltYWdlcykge1xuICAgIGltYWdlcy5mb3JFYWNoKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbCwga2V5LCBhcnIpIHtcbiAgICAgICAgdmFyIGltZztcbiAgICAgICAgaW1nID0gdmFsLnNwbGl0KCd8Jyk7XG4gICAgICAgIF90aGlzLmdhbWUubG9hZC5pbWFnZShpbWdbMF0sIGltZ1sxXSk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBIZWxwZXIucHJvdG90eXBlLmxvYWRTcHJpdGVzaGVldHMgPSBmdW5jdGlvbihpbWFnZXMpIHtcbiAgICBpbWFnZXMuZm9yRWFjaCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbih2YWwsIGtleSwgYXJyKSB7XG4gICAgICAgIHZhciBpbWc7XG4gICAgICAgIGltZyA9IHZhbC5zcGxpdCgnfCcpO1xuICAgICAgICBfdGhpcy5nYW1lLmxvYWQuc3ByaXRlc2hlZXQoaW1nWzBdLCBpbWdbMV0sIHBhcnNlSW50KGltZ1syXSwgcGFyc2VJbnQoaW1nWzNdKSkpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgcmV0dXJuIEhlbHBlcjtcblxufSkoKTtcbiIsInZhciBNb2I7XG5cbk1vYiA9IChmdW5jdGlvbigpIHtcblxuICAvKipcbiAgICogQ3JlYXRlIE1vYiBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBhcmFtICB7R2FtZX0gQGdhbWVcbiAgICogQHBhcmFtICB7c3RyaW5nfSBAbmFtZVxuICAgKiBAcGFyYW0gIHtvYmplY3R9IEBzcHJpdGVPYmpcbiAgICpcbiAgICogQHJldHVybiB7dm9pZH1cbiAgICovXG4gIGZ1bmN0aW9uIE1vYihnYW1lLCBuYW1lLCBzcHJpdGVPYmopIHtcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5zcHJpdGVPYmogPSBzcHJpdGVPYmo7XG4gICAgY29uc29sZS5sb2coJ05ldyBNb2IgaGFzIGJlZW4gbG9hZGVkJywgdGhpcy5uYW1lKTtcbiAgfVxuXG4gIE1vYi5wcm90b3R5cGUubG9hZFNwcml0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZ2FtZS5sb2FkLnNwcml0ZXNoZWV0KHRoaXMubmFtZSwgdGhpcy5zcHJpdGVPYmoucGF0aCwgdGhpcy5zcHJpdGVPYmoueCwgdGhpcy5zcHJpdGVPYmoueSk7XG4gIH07XG5cbiAgcmV0dXJuIE1vYjtcblxufSkoKTtcbiIsInZhciBQbGF5ZXIsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5QbGF5ZXIgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUGxheWVyLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBQbGF5ZXIoKSB7XG4gICAgcmV0dXJuIFBsYXllci5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFBsYXllciBjcmVhdGUuXG4gICAqXG4gICAqIEBwYXJhbSAge251bWJlcn0geCBQbGF5ZXIgcG9zaXRpb24geCBjb29yZGluYXRlXG4gICAqIEBwYXJhbSAge251bWJlcn0geSBQbGF5ZXIgcG9zaXRpb24geSBjb29yZGluYXRlXG4gICAqXG4gICAqIEByZXR1cm4ge1BoYXNlci5TcHJpdGV9XG4gICAqL1xuXG4gIFBsYXllci5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oeCwgeSwgcGh5c2ljczEpIHtcbiAgICB2YXIgX3Nwcml0ZTtcbiAgICB0aGlzLnBoeXNpY3MgPSBwaHlzaWNzMTtcbiAgICBfc3ByaXRlID0gdGhpcy5zcHJpdGUoeCwgeSk7XG4gICAgdGhpcy5nYW1lU3ByaXRlID0gX3Nwcml0ZTtcbiAgICB0aGlzLmFuY2hvcihfc3ByaXRlLCAwLjUsIDAuNSk7XG4gICAgdGhpcy5hbmltYXRpb25zLmZvckVhY2goZnVuY3Rpb24odmFsKSB7XG4gICAgICBfc3ByaXRlLmFuaW1hdGlvbnMuYWRkKHZhbC5uYW1lLCB2YWwuc3ByaXRlSW5kZXgsIHZhbC5zcGVlZCwgdmFsLmxvb3ApO1xuICAgIH0pO1xuICAgIHRoaXMuY2FtZXJhKF9zcHJpdGUpO1xuICAgIHRoaXMucGh5c2ljc0VuYWJsZSh0aGlzLnBoeXNpY3MpO1xuICAgIHRoaXMuY3JlYXRlUGh5c2ljcygpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIFBsYXllci5wcm90b3R5cGUubG9hZEFuaW1hdGlvbnMgPSBmdW5jdGlvbihzcHJpdGUpIHtcbiAgICB0aGlzLmFuaW1hdGlvbnMuZm9yRWFjaChmdW5jdGlvbih2YWwpIHtcbiAgICAgIHNwcml0ZS5hbmltYXRpb25zLmFkZCh2YWwubmFtZSwgdmFsLnNwcml0ZUluZGV4LCB2YWwuc3BlZWQsIHZhbC5sb29wKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBDcmVhdGUgc3ByaXRlIGZyb20gdGhlIHNwcml0ZXNoZWV0LlxuICAgKlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IHBvc1hcbiAgICogQHBhcmFtICB7bnVtYmVyfSBwb3NZXG4gICAqXG4gICAqIEByZXR1cm4ge1BoYXNlci5TcHJpdGV9XG4gICAqL1xuXG4gIFBsYXllci5wcm90b3R5cGUuc3ByaXRlID0gZnVuY3Rpb24ocG9zWCwgcG9zWSkge1xuICAgIHJldHVybiB0aGlzLmdhbWUuYWRkLnNwcml0ZShwb3NYLCBwb3NZLCB0aGlzLm5hbWUpO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIFBsYXllciBhbmNob3IgbG9jYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSAge1BoYXNlci5TcHJpdGV9IHNwcml0ZVxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IHhcbiAgICogQHBhcmFtICB7bnVtYmVyfSB5XG4gICAqXG4gICAqIEByZXR1cm4ge1BoYXNlci5TcHJpdGV9XG4gICAqL1xuXG4gIFBsYXllci5wcm90b3R5cGUuYW5jaG9yID0gZnVuY3Rpb24oc3ByaXRlLCB4LCB5KSB7XG4gICAgcmV0dXJuIHNwcml0ZS5hbmNob3Iuc2V0VG8oeCwgeSk7XG4gIH07XG5cblxuICAvKipcbiAgICogQ3JlYXRlIGFuaW1hdGlvbi5cbiAgICpcbiAgICogQHBhcmFtICB7UGhhc2VyLlNwcml0ZX0gc3ByaXRlXG4gICAqIEBwYXJhbSAge3N0cmluZ30gbmFtZSAgICAgICAgTmFtZSBvZiB0aGUgYW5pbWF0aW9uXG4gICAqIEBwYXJhbSAge2FycmF5fSBzcHJpdGVJbmRleCAgQXJyYXkgb2YgaW5kZXhcbiAgICogQHBhcmFtICB7bnVtYmVyfSBzcGVlZCAgICAgICBTcGVlZCBvZiB0aGUgYW5pbWF0aW9uXG4gICAqIEBwYXJhbSAge2Jvb2x9ICRsb29wICAgICAgICAgTG9vcCBvciBub3RcbiAgICpcbiAgICogQHJldHVybiB7UGhhc2VyLkFuaW1hdGlvbnN9XG4gICAqL1xuXG4gIFBsYXllci5wcm90b3R5cGUuY3JlYXRlQW5pbWF0aW9ucyA9IGZ1bmN0aW9uKHNwcml0ZSwgbmFtZSwgc3ByaXRlSW5kZXgsIHNwZWVkLCAkbG9vcCkge1xuICAgIHJldHVybiBzcHJpdGUuYW5pbWF0aW9ucy5hZGQobmFtZSwgc3ByaXRlSW5kZXgsIHNwZWVkLCAkbG9vcCk7XG4gIH07XG5cblxuICAvKipcbiAgICogRGVmYXVsdCBhbmltYXRpb24uXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheX1cbiAgICovXG5cbiAgUGxheWVyLnByb3RvdHlwZS5hbmltYXRpb25zID0gW1xuICAgIHtcbiAgICAgIG5hbWU6ICdpZGxlJyxcbiAgICAgIHNwcml0ZUluZGV4OiBbMCwgMSwgMiwgMV0sXG4gICAgICBzcGVlZDogNCxcbiAgICAgIGxvb3A6IHRydWVcbiAgICB9LCB7XG4gICAgICBuYW1lOiAnanVtcCcsXG4gICAgICBzcHJpdGVJbmRleDogWzYsIDcsIDE4LCAxOSwgMjAsIDhdLFxuICAgICAgc3BlZWQ6IDEwLFxuICAgICAgbG9vcDogZmFsc2VcbiAgICB9LCB7XG4gICAgICBuYW1lOiAncnVuJyxcbiAgICAgIHNwcml0ZUluZGV4OiBbMywgNCwgNSwgNF0sXG4gICAgICBzcGVlZDogMTAsXG4gICAgICBsb29wOiB0cnVlXG4gICAgfSwge1xuICAgICAgbmFtZTogJ2ZpZ2h0JyxcbiAgICAgIHNwcml0ZUluZGV4OiBbMjMsIDIyLCAyMV0sXG4gICAgICBzcGVlZDogMTAsXG4gICAgICBsb29wOiB0cnVlXG4gICAgfSwge1xuICAgICAgbmFtZTogJ2h1cnQnLFxuICAgICAgc3ByaXRlSW5kZXg6IFs5LCAxMCwgMTEsIDEwXSxcbiAgICAgIHNwZWVkOiA1LFxuICAgICAgbG9vcDogZmFsc2VcbiAgICB9LCB7XG4gICAgICBuYW1lOiAnZmFsbGluZycsXG4gICAgICBzcHJpdGVJbmRleDogWzhdLFxuICAgICAgc3BlZWQ6IDEsXG4gICAgICBsb29wOiB0cnVlXG4gICAgfVxuICBdO1xuXG5cbiAgLyoqXG4gICAqIENhbWVyYSB3aWxsIGZvbGxvdyBwbGF5ZXIuXG4gICAqXG4gICAqIEBwYXJhbSAge1BoYXNlci5TcHJpdGV9IHNwcml0ZVxuICAgKlxuICAgKiBAcmV0dXJuIHtQaGFzZXIuQ2FtZXJhfVxuICAgKi9cblxuICBQbGF5ZXIucHJvdG90eXBlLmNhbWVyYSA9IGZ1bmN0aW9uKHNwcml0ZSkge1xuICAgIHJldHVybiB0aGlzLmdhbWUuY2FtZXJhLmZvbGxvdyhzcHJpdGUsIEdhbWUuQ2FtZXJhLnR5cGUsIEdhbWUuQ2FtZXJhLnNwZWVkLngsIEdhbWUuQ2FtZXJhLnNwZWVkLnkpO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIEVuYWJsZSBwaHlzaWNzLlxuICAgKlxuICAgKiBAcGFyYW0gIHtQaGFzZXIuUGh5c2ljc30gcGh5c2ljc1xuICAgKlxuICAgKiBAcmV0dXJuIHtQaGFzZXIuUGh5c2ljc31cbiAgICovXG5cbiAgUGxheWVyLnByb3RvdHlwZS5waHlzaWNzRW5hYmxlID0gZnVuY3Rpb24ocGh5c2ljcykge1xuICAgIHJldHVybiBwaHlzaWNzLmVuYWJsZSh0aGlzLmdhbWVTcHJpdGUpO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBQaHlzaWNzLlxuICAgKiBOT1RFOiBNVVNUISBFbmFibGUgcGh5c2ljcyBmaXJzdCBAcGh5c2ljc0VuYWJsZSgpLlxuICAgKlxuICAgKiBAcmV0dXJuIHt2b2lkfSBbZGVzY3JpcHRpb25dXG4gICAqL1xuXG4gIFBsYXllci5wcm90b3R5cGUuY3JlYXRlUGh5c2ljcyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucGh5c2ljcy5jb2xsaWRlV29ybGRCb3VuZHMgPSB0cnVlO1xuICAgIHRoaXMuZ2V0UGh5c2ljc0JvZHkoKS5maXhlZFJvdGF0aW9uID0gdHJ1ZTtcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBHZXQgUGh5c2ljcyBCb2R5LlxuICAgKlxuICAgKiBAcmV0dXJuIHtQaGFzZXIuUGh5c2ljcy5Cb2R5fVxuICAgKi9cblxuICBQbGF5ZXIucHJvdG90eXBlLmdldFBoeXNpY3NCb2R5ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2FtZVNwcml0ZS5ib2R5O1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBtZXRob2QuXG4gICAqXG4gICAqIEBwYXJhbSAge29ian0gY29udHJvbHMgR2FtZS5Db250cm9sc1xuICAgKlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cblxuICBQbGF5ZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKGNvbnRyb2xzKSB7XG4gICAgdGhpcy5jb250cm9scyA9IGNvbnRyb2xzO1xuICAgIHRoaXMuZ2V0UGh5c2ljc0JvZHkoKS52ZWxvY2l0eS54ID0gMDtcbiAgICB0aGlzLmNoYW5nZUp1bXBTdGF0dXMoKTtcbiAgICB0aGlzLmNvbnRyb2xIb3Jpem9udGFsKCdsZWZ0Jyk7XG4gICAgdGhpcy5jb250cm9sSG9yaXpvbnRhbCgncmlnaHQnKTtcbiAgICB0aGlzLmNvbnRyb2xGaWdodCgpO1xuICAgIHRoaXMuY29udHJvbFVwKCk7XG4gICAgdGhpcy5hbmltYXRpb25JZGxlKCk7XG4gIH07XG5cbiAgUGxheWVyLnByb3RvdHlwZS5hbmltYXRpb25JZGxlID0gZnVuY3Rpb24oc3ByaXRlKSB7XG4gICAgdmFyIF9zcHJpdGU7XG4gICAgX3Nwcml0ZSA9IHNwcml0ZSA/IHNwcml0ZSA6IHRoaXMuZ2FtZVNwcml0ZTtcbiAgICBpZiAoKF9zcHJpdGUuYm9keS52ZWxvY2l0eS54IDw9IDAgJiYgX3Nwcml0ZS5ib2R5LnZlbG9jaXR5LnggPiAtMSkgJiYgKF9zcHJpdGUuYm9keS52ZWxvY2l0eS55IDw9IDAgJiYgX3Nwcml0ZS5ib2R5LnZlbG9jaXR5LnkgPiAtMSkpIHtcbiAgICAgIF9zcHJpdGUuYW5pbWF0aW9ucy5wbGF5KCdpZGxlJyk7XG4gICAgfVxuICB9O1xuXG5cbiAgLyoqXG4gICAqIFBsYXllciBjb250cm9scyBob3Jpem9udGFsbHkuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gbGVmdE9yUmlnaHRcbiAgICogQHBhcmFtICB7b2JqfSBjb250cm9scyAgICBHYW1lLkNvbnRyb2xzXG4gICAqXG4gICAqIEByZXR1cm4ge3ZvaWR9XG4gICAqL1xuXG4gIFBsYXllci5wcm90b3R5cGUuY29udHJvbEhvcml6b250YWwgPSBmdW5jdGlvbihsZWZ0T3JSaWdodCwgY29udHJvbHMpIHtcbiAgICB2YXIgX2NvbnRyb2xzO1xuICAgIF9jb250cm9scyA9IGNvbnRyb2xzID8gY29udHJvbHMgOiB0aGlzLmNvbnRyb2xzO1xuICAgIGlmIChfY29udHJvbHNbbGVmdE9yUmlnaHRdLmlzRG93bikge1xuICAgICAgdGhpcy5nYW1lU3ByaXRlLmFuaW1hdGlvbnMucGxheSgncnVuJyk7XG4gICAgICBzd2l0Y2ggKGxlZnRPclJpZ2h0KSB7XG4gICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgIHRoaXMuZ2FtZVNwcml0ZS5zY2FsZS5zZXRUbygtMSwgMSk7XG4gICAgICAgICAgdGhpcy5nZXRQaHlzaWNzQm9keSgpLm1vdmVMZWZ0KF9wbGF5ZXIuc3BlZWQpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICAgIHRoaXMuZ2FtZVNwcml0ZS5zY2FsZS5zZXRUbygxLCAxKTtcbiAgICAgICAgICB0aGlzLmdldFBoeXNpY3NCb2R5KCkubW92ZVJpZ2h0KF9wbGF5ZXIuc3BlZWQpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cblxuICAvKipcbiAgICogUGxheWVyIEp1bXBzIHdoZW4ganVtcCBidXR0b24gaXMgcHJlc3NlZC5cbiAgICpcbiAgICogQHBhcmFtICB7b2JqfSBjb250cm9scyBHYW1lLkNvbnRyb2xzXG4gICAqXG4gICAqIEByZXR1cm4ge3ZvaWR9XG4gICAqL1xuXG4gIFBsYXllci5wcm90b3R5cGUuY29udHJvbFVwID0gZnVuY3Rpb24oY29udHJvbHMpIHtcbiAgICB2YXIgX2NvbnRyb2xzO1xuICAgIF9jb250cm9scyA9IGNvbnRyb2xzID8gY29udHJvbHMgOiB0aGlzLmNvbnRyb2xzO1xuICAgIGlmIChfY29udHJvbHMudXAuaXNEb3duICYmIHRoaXMuY2hlY2tJZkNhbkp1bXAoKSkge1xuICAgICAgdGhpcy5nYW1lU3ByaXRlLmFuaW1hdGlvbnMucGxheSgnanVtcCcpO1xuICAgICAgX3BsYXllci5qdW1wU3RhdHVzID0gdHJ1ZTtcbiAgICAgIHRoaXMuZ2V0UGh5c2ljc0JvZHkoKS5tb3ZlVXAoX3BsYXllci5qdW1wKTtcbiAgICAgIF9wbGF5ZXIuanVtcFRpbWVyID0gdGhpcy5nYW1lLnRpbWUubm93O1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoX2NvbnRyb2xzLnVwLmlzRG93biAmJiAhdGhpcy5jaGVja0lmQ2FuSnVtcCgpICYmIF9wbGF5ZXIuanVtcFN0YXR1cykge1xuICAgICAgdGhpcy5nYW1lU3ByaXRlLmFuaW1hdGlvbnMucGxheSgnanVtcCcpO1xuICAgICAgdGhpcy5nZXRQaHlzaWNzQm9keSgpLm1vdmVVcChfcGxheWVyLmp1bXAgLyAyKTtcbiAgICB9XG4gIH07XG5cblxuICAvKipcbiAgICogUGxheWVyIGZpZ2h0cyB3aGVuIGZpZ2h0IGJ1dHRvbiBpcyBwcmVzc2VkLlxuICAgKlxuICAgKiBAcGFyYW0gIHtvYmp9IGNvbnRyb2xzIEdhbWUuQ29udHJvbHNcbiAgICpcbiAgICogQHJldHVybiB7dm9pZH1cbiAgICovXG5cbiAgUGxheWVyLnByb3RvdHlwZS5jb250cm9sRmlnaHQgPSBmdW5jdGlvbihjb250cm9scykge1xuICAgIHZhciBfY29udHJvbHM7XG4gICAgX2NvbnRyb2xzID0gY29udHJvbHMgPyBjb250cm9scyA6IHRoaXMuY29udHJvbHM7XG4gICAgaWYgKF9jb250cm9scy5maWdodC5pc0Rvd24pIHtcbiAgICAgIF9wbGF5ZXIuZmlnaHRNb2RlID0gdHJ1ZTtcbiAgICAgIHRoaXMuZ2FtZVNwcml0ZS5hbmltYXRpb25zLnBsYXkoJ2ZpZ2h0MicsIGZhbHNlLCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgX3BsYXllci5maWdodE1vZGUgPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cblxuICAvKipcbiAgICogQ2hlY2sgaWYgcGxheWVyIGNhbiBqdW1wLlxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sfVxuICAgKi9cblxuICBQbGF5ZXIucHJvdG90eXBlLmNoZWNrSWZDYW5KdW1wID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGMsIGQsIGksIHJlc3VsdCwgeUF4aXM7XG4gICAgeUF4aXMgPSBwMi52ZWMyLmZyb21WYWx1ZXMoMCwgMSk7XG4gICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCB0aGlzLnBoeXNpY3Mud29ybGQubmFycm93cGhhc2UuY29udGFjdEVxdWF0aW9ucy5sZW5ndGgpIHtcbiAgICAgIGMgPSB0aGlzLnBoeXNpY3Mud29ybGQubmFycm93cGhhc2UuY29udGFjdEVxdWF0aW9uc1tpXTtcbiAgICAgIGlmIChjLmJvZHlBID09PSB0aGlzLmdldFBoeXNpY3NCb2R5KCkuZGF0YSB8fCBjLmJvZHlCID09PSB0aGlzLmdldFBoeXNpY3NCb2R5KCkuZGF0YSkge1xuICAgICAgICBkID0gcDIudmVjMi5kb3QoYy5ub3JtYWxBLCB5QXhpcyk7XG4gICAgICAgIGlmIChjLmJvZHlBID09PSB0aGlzLmdldFBoeXNpY3NCb2R5KCkuZGF0YSkge1xuICAgICAgICAgIGQgKj0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGQgPiAwLjUpIHtcbiAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgUGxheWVyLnByb3RvdHlwZS5jaGFuZ2VKdW1wU3RhdHVzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuZ2FtZS50aW1lLm5vdyAtIF9wbGF5ZXIuanVtcFRpbWVyID4gUGhhc2VyLlRpbWVyLkhBTEYpIHtcbiAgICAgIF9wbGF5ZXIuanVtcFN0YXR1cyA9IGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICBQbGF5ZXIucHJvdG90eXBlLmRlYnVnTW9kZSA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICB0aGlzLmdhbWUuZGVidWcuYm9keUluZm8odGhpcy5nYW1lU3ByaXRlLCB4LCB5KTtcbiAgfTtcblxuICByZXR1cm4gUGxheWVyO1xuXG59KShNb2IpO1xuIiwidmFyIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5Nb2JzLkVuZW15LnRvbmd1ZSA9IChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZCh0b25ndWUsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIHRvbmd1ZSgpIHtcbiAgICByZXR1cm4gdG9uZ3VlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIHRvbmd1ZTtcblxufSkoTW9iKTtcbiIsIlxuLyoqXG4gKiBMZXZlbCAxXG4gKi9cbnZhciBfdGltZTtcblxuR2FtZS5MZXZlbC5vbmUgPSBmdW5jdGlvbihnYW1lKSB7fTtcblxuX3RpbWUgPSB2b2lkIDA7XG5cbkdhbWUuTGV2ZWwub25lLnByb3RvdHlwZSA9IHtcbiAgcHJlbG9hZDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coJ0xvYWRpbmcgTGV2ZWwgMSAuLi4nKTtcbiAgfSxcbiAgY3JlYXRlOiBmdW5jdGlvbigkZ2FtZSkge1xuICAgIGNvbnNvbGUubG9nKCdMZXZlbCAxOjpjcmVhdGUnLCAkZ2FtZSwgdGhpcyk7XG4gICAgdGhpcy5zdGFnZS5iYWNrZ3JvdW5kQ29sb3IgPSBHYW1lLkxldmVsLmNvbmYub25lLmJhY2tncm91bmRDb2xvcjtcbiAgICB0aGlzLnBoeXNpY3Muc3RhcnRTeXN0ZW0oR2FtZS5QaHlzaWNzKTtcbiAgICB0aGlzLnBoeXNpY3MucDIuYXBwbHlHcmF2aXR5ID0gdHJ1ZTtcbiAgICB0aGlzLnBoeXNpY3MucDIuc2V0SW1wYWN0RXZlbnRzKHRydWUpO1xuICAgIHRoaXMucGh5c2ljcy5wMi5hcHBseVNwcmluZ0ZvcmNlcyA9IHRydWU7XG4gICAgR2FtZS5NYXAgPSB0aGlzLmFkZC50aWxlbWFwKCdtYXAnKTtcbiAgICBHYW1lLk1hcC5hZGRUaWxlc2V0SW1hZ2UoJ3RpbGVzZXQnKTtcbiAgICAkJCRnYW1lLmxheWVyID0gbmV3IEdhbWUuTGF5ZXIoJGdhbWUsIEdhbWUuTWFwLCBbJ0dyb3VuZCcsICdQbGF0Zm9ybScsICdBZXN0aGV0aWNzJywgJ1Bvd2VydXBzJ10pO1xuICAgICQkJGdhbWUubGF5ZXIuY3JlYXRlTGF5ZXJzKCk7XG4gICAgR2FtZS5NYXAuc2V0Q29sbGlzaW9uQmV0d2VlbigwLCAyNTYsIHRydWUsICdHcm91bmQnKTtcbiAgICBHYW1lLk1hcC5zZXRDb2xsaXNpb25CZXR3ZWVuKDAsIDI1NiwgdHJ1ZSwgJ1BsYXRmb3JtJyk7XG4gICAgX3BsYXllci5yZXNwYXduID0gdGhpcy5hZGQuZ3JvdXAoKTtcbiAgICBHYW1lLk1hcC5jcmVhdGVGcm9tT2JqZWN0cygnU3Bhd25wb2ludCcsIDUsICcnLCAwLCB0cnVlLCBmYWxzZSwgX3BsYXllci5yZXNwYXduKTtcbiAgICBHYW1lLkNvbnRyb2xzID0gKG5ldyBDb250cm9scyh0aGlzLCBfY29udHJvbHMpKS5jcmVhdGUoKTtcbiAgICB0aGlzLnBoeXNpY3MucDIuY29udmVydFRpbGVtYXAoR2FtZS5NYXAsICQkJGdhbWUubGF5ZXIuZ2FtZUxheWVyc1swXSk7XG4gICAgdGhpcy5waHlzaWNzLnAyLmNvbnZlcnRUaWxlbWFwKEdhbWUuTWFwLCAkJCRnYW1lLmxheWVyLmdhbWVMYXllcnNbMV0pO1xuICAgICQkJGdhbWUucGxheWVyLmNyZWF0ZSgwLCAwLCB0aGlzLnBoeXNpY3MucDIpO1xuICAgIHRoaXMucGh5c2ljcy5wMi5yZXN0aXR1dGlvbiA9IEdhbWUuUmVzdGl0dXRpb247XG4gICAgdGhpcy5waHlzaWNzLnAyLmdyYXZpdHkueSA9IEdhbWUuR3Jhdml0eTtcbiAgICB0aGlzLnNwYXduKCk7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24oJHVwZGF0ZSkge1xuICAgICQkJGdhbWUucGxheWVyLnVwZGF0ZShHYW1lLkNvbnRyb2xzKTtcbiAgICBpZiAoR2FtZS5Db250cm9scy51cC5pc0Rvd24pIHtcbiAgICAgIGlmIChHYW1lLkNvbnRyb2xzLnJpZ2h0LmlzRG93bikge1xuICAgICAgICBjb25zb2xlLmxvZygnVVAgYW5kIFJJR0hUJywgJCQkZ2FtZS5wbGF5ZXIuZ2FtZVNwcml0ZSk7XG4gICAgICB9XG4gICAgICBpZiAoR2FtZS5Db250cm9scy5sZWZ0LmlzRG93bikge1xuICAgICAgICBjb25zb2xlLmxvZygnVVAgYW5kIExFRlQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oJGdhbWUpIHtcbiAgICAkZ2FtZS5kZWJ1Zy5ib2R5SW5mbygkJCRnYW1lLnBsYXllci5nYW1lU3ByaXRlLCAzMiwgMzIpO1xuICB9LFxuICBub01vcmVKdW1wOiBmdW5jdGlvbigpIHtcbiAgICBQbGF5ZXIuanVtcFN0YXR1cyA9IGZhbHNlO1xuICAgIGNvbnNvbGUubG9nKCdObyBtb3JlIEp1bXAhJyk7XG4gIH0sXG4gIHNwYXduOiBmdW5jdGlvbigpIHtcbiAgICBfcGxheWVyLnJlc3Bhd24uZm9yRWFjaCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihzcGF3blBvaW50KSB7XG4gICAgICAgICQkJGdhbWUucGxheWVyLmdhbWVTcHJpdGUucmVzZXQoc3Bhd25Qb2ludC54LCBzcGF3blBvaW50LnkpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH0sXG4gIGNoZWNrSGl0OiBmdW5jdGlvbihzcHJpdGVBLCBzcHJpdGVCKSB7XG4gICAgdmFyIGJvdW5kcywgaW50ZXJzZWN0cztcbiAgICBib3VuZHMgPSBbc3ByaXRlQS5nZXRCb3VuZHMoKSwgc3ByaXRlQi5nZXRCb3VuZHMoKV07XG4gICAgaW50ZXJzZWN0cyA9IFBoYXNlci5SZWN0YW5nbGUuaW50ZXJzZWN0cyhib3VuZHNbMF0sIGJvdW5kc1sxXSk7XG4gICAgaWYgKGludGVyc2VjdHMpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdjaGVja0hpdCcsIGludGVyc2VjdHMsIGJvdW5kcyk7XG4gICAgfVxuICAgIHJldHVybiBpbnRlcnNlY3RzO1xuICB9XG59O1xuIl19
