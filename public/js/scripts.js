
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

Game.Menu = (function() {
  function Menu(game) {
    this.game = game;
    this.characters = {};
    this._config = {};
    this.container = void 0;
  }

  Menu.prototype.spriteCharacters = function() {
    this.characters = {
      kit: this.add.sprite(this.world.centerX, this.world.centerY, 'char_kit')
    };
  };

  Menu.prototype.loadCharacters = function() {
    this.characters = {
      kit: new Character(this, 'char_kit', this.world.centerX, this.world.centerY),
      pacman: new Character(this, 'char_pacman', this.world.centerX, this.world.centerY),
      wilber: new Character(this, 'char_wilber', this.world.centerX, this.world.centerY)
    };
  };

  Menu.prototype.preload = function() {
    this._config = this.cache.getJSON('config');
    this.load.pack('menu', this._config.assetPackPath, null, this);
    this.load.pack('characters', this._config.assetPackPath, null, this);
    this.loadCharacters();
  };

  Menu.prototype.create = function() {
    var char_kit, char_pacman, char_wilber, h, w;
    w = 610 * 1.5;
    h = window.innerHeight - 400;
    this.container = new Phaser.Rectangle(this.world.centerX - (w / 2), this.world.centerY - (h / 2), w, h);
    this.c1 = new Phaser.Rectangle(this.container.topLeft.x, this.container.topLeft.y, w / 3, h);
    this.c2 = new Phaser.Rectangle(this.c1.topLeft.x + (w / 3), this.container.topLeft.y, w / 3, h);
    this.c3 = new Phaser.Rectangle(this.c2.topLeft.x + (w / 3), this.container.topLeft.y, w / 3, h);
    char_kit = this.characters.kit.create().play('idle').sprite;
    char_pacman = this.characters.pacman.create().play('idle').sprite;
    char_wilber = this.characters.wilber.create().play('idle').sprite;
    char_kit.alignIn(this.c1, Phaser.CENTER, 0, 0);
    char_pacman.alignIn(this.c2, Phaser.CENTER, 0, 0);
    char_wilber.alignIn(this.c3, Phaser.CENTER, 0, 0);
  };

  Menu.prototype.render = function() {
    this.game.debug.rectangle(this.container, '#ffffff', false);
    this.game.debug.rectangle(this.c1, '#ff0000', false);
    this.game.debug.rectangle(this.c2, '#00ff00', false);
    this.game.debug.rectangle(this.c3, '#0000ff', false);
  };

  return Menu;

})();

var Character;

Character = (function() {
  function Character(game, name1, posX, posY) {
    this.game = game;
    this.name = name1;
    this.posX = posX;
    this.posY = posY;
    this.game.load.json(this.name, 'data/characters/' + this.name + '.json');
    this.anchor = {
      x: 0.5,
      y: 0.5
    };
    this.width = 42;
    this.height = 60;
  }

  Character.prototype.createSprite = function(level) {
    this.getConfig();
    this.sprite = this.game.add.sprite(this.posX, this.posY, this.name);
    this.sprite.maxHealth = this.config.maxHealths[level + 1];
    this.sprite.health = this.config.maxHealths[level + 1];
    this.sprite.data = this.config;
    this.sprite.name = this.name;
    this.setAnchor();
    return this;
  };

  Character.prototype.setAnchor = function() {
    this.sprite.anchor.setTo(this.anchor.x, this.anchor.y);
    return this;
  };

  Character.prototype.getConfig = function() {
    this.config = this.game.cache.getJSON(this.name);
    return this;
  };

  Character.prototype.create = function(level) {
    level = level ? level : 0;
    this.createSprite(level);
    this.loadAnimations();
    return this;
  };

  Character.prototype.loadAnimations = function() {
    this.animations.forEach((function(_this) {
      return function(val) {
        _this.sprite.animations.add(val.name, val.spriteIndex, val.speed, val.loop);
      };
    })(this));
    return this;
  };


  /**
   * Default animation.
   *
   * @type {Array}
   */

  Character.prototype.animations = [
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

  Character.prototype.getAnimations = function() {
    return this.sprite.animations;
  };

  Character.prototype.play = function(name, frameRate, _loop, killOnComplete) {
    this.sprite.animations.play(name, frameRate, _loop, killOnComplete);
    return this;
  };

  return Character;

})();

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
    return;
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

  return Player;

})(Phaser.Sprite);

var Test;

Test = (function() {
  function Test() {}

  return Test;

})();

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZy5qcyIsImJvb3QuanMiLCJwcmVsb2FkLmpzIiwibWVudS5qcyIsIl9DaGFyYWN0ZXIuanMiLCJfQ29udHJvbHMuanMiLCJfR2FtZS5MYXllci5qcyIsIl9IZWxwZXIuanMiLCJfTW9iLmpzIiwiX1BsYXllci5qcyIsIl9UZXN0LmpzIiwiZW5lbWllcy90b25ndWUuanMiLCIxLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBDb25maWd1cmF0aW9uXG4gKi9cbnZhciAkJCRnYW1lLCBHYW1lLCBNb2JzLCBfY29udHJvbHMsIF9wbGF5ZXIsIHNldENvbmZpZztcblxuR2FtZSA9IHt9O1xuXG5HYW1lLkxldmVsID0ge307XG5cbkdhbWUuTGV2ZWwuY29uZiA9IHtcbiAgb25lOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiAnIzNhNTk2MydcbiAgfVxufTtcblxuR2FtZS5NYXAgPSB2b2lkIDA7XG5cbkdhbWUuTGF5ZXIgPSB7fTtcblxuR2FtZS5QaHlzaWNzID0gUGhhc2VyLlBoeXNpY3MuUDJKUztcblxuR2FtZS5HcmF2aXR5ID0gMTUwMDtcblxuR2FtZS5SZXN0aXR1dGlvbiA9IDAuMTtcblxuR2FtZS5EZWJ1ZyA9IHRydWU7XG5cbkdhbWUuQ2FtZXJhID0ge1xuICB0eXBlOiBQaGFzZXIuQ2FtZXJhLkZPTExPV19MT0NLT04sXG4gIHNwZWVkOiB7XG4gICAgeDogMC4xLFxuICAgIHk6IDAuMVxuICB9XG59O1xuXG53aW5kb3cuJEdBTUUgPSB2b2lkIDA7XG5cbl9jb250cm9scyA9IHtcbiAgcmlnaHQ6ICdEJyxcbiAgbGVmdDogJ0EnLFxuICB1cDogJ1NQQUNFQkFSJyxcbiAgZG93bjogJ1MnLFxuICBmaWdodDogJ21vdXNlOmxlZnRCdXR0b24nXG59O1xuXG5fcGxheWVyID0ge1xuICBzcGVlZDogMzAwLFxuICBqdW1wOiA2MDAsXG4gIGp1bXBUaW1lcjogMCxcbiAganVtcFN0YXR1czogZmFsc2UsXG4gIGZpZ2h0TW9kZTogZmFsc2UsXG4gIHJlc3Bhd246IHZvaWQgMFxufTtcblxuJCQkZ2FtZSA9IHt9O1xuXG4kJCRnYW1lLm1vYnMgPSB7fTtcblxuJCQkZ2FtZS5jaGFyYWN0ZXJzID0ge307XG5cbiQkJGdhbWUuY29uZiA9IHt9O1xuXG53aW5kb3cuJCQkZ2FtZSA9ICQkJGdhbWU7XG5cbk1vYnMgPSB7XG4gIEVuZW15OiB7fSxcbiAgTmV1dHJhbDoge31cbn07XG5cbnNldENvbmZpZyA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIHdpbmRvdy4kJCRnYW1lLmNvbmYgPSB2YWx1ZTtcbn07XG4iLCJHYW1lLkJvb3QgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIEJvb3QoZ2FtZSkge1xuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gIH1cblxuICBCb290LnByb3RvdHlwZS5wcmVsb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pbnB1dC5tYXhQb2ludGVycyA9IDE7XG4gICAgdGhpcy5sb2FkLmpzb24oJ2NvbmZpZycsICdkYXRhL2NvbmZpZy5qc29uJyk7XG4gIH07XG5cbiAgQm9vdC5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbmZpZztcbiAgICBjb25maWcgPSB0aGlzLmNhY2hlLmdldEpTT04oJ2NvbmZpZycpO1xuICAgIHRoaXMuc3RhdGUuc3RhcnQoJ1ByZWxvYWQnKTtcbiAgfTtcblxuICByZXR1cm4gQm9vdDtcblxufSkoKTtcbiIsIkdhbWUuUHJlbG9hZCA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gUHJlbG9hZChnYW1lKSB7XG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgfVxuXG4gIFByZWxvYWQucHJvdG90eXBlLnByZWxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9jb25maWcgPSB0aGlzLmdhbWUuY2FjaGUuZ2V0SlNPTignY29uZmlnJyk7XG4gICAgdGhpcy5zdGFnZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLl9jb25maWcuYmFja2dyb3VuZC5jb2xvcjtcbiAgICB0aGlzLmxvYWQucGFjaygncHJlbG9hZCcsIHRoaXMuX2NvbmZpZy5hc3NldFBhY2suZGlyZWN0b3J5ICsgdGhpcy5fY29uZmlnLmFzc2V0UGFjay5maWxlbmFtZSwgbnVsbCwgdGhpcyk7XG4gIH07XG5cbiAgUHJlbG9hZC5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zdGFnZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLl9jb25maWcuYmFja2dyb3VuZC5jb2xvcjtcbiAgICB0aGlzLmFkZC5zcHJpdGUodGhpcy53b3JsZC5jZW50ZXJYIC0gKDY0IC8gMiksIHRoaXMud29ybGQuY2VudGVyWSAtICg2NCAvIDIpLCAncHJlbG9hZGVySW1nJyk7XG4gICAgdGhpcy5zdGF0ZS5zdGFydCgnTWVudScpO1xuICB9O1xuXG4gIHJldHVybiBQcmVsb2FkO1xuXG59KSgpO1xuIiwiR2FtZS5NZW51ID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBNZW51KGdhbWUpIHtcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgIHRoaXMuY2hhcmFjdGVycyA9IHt9O1xuICAgIHRoaXMuX2NvbmZpZyA9IHt9O1xuICAgIHRoaXMuY29udGFpbmVyID0gdm9pZCAwO1xuICB9XG5cbiAgTWVudS5wcm90b3R5cGUuc3ByaXRlQ2hhcmFjdGVycyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY2hhcmFjdGVycyA9IHtcbiAgICAgIGtpdDogdGhpcy5hZGQuc3ByaXRlKHRoaXMud29ybGQuY2VudGVyWCwgdGhpcy53b3JsZC5jZW50ZXJZLCAnY2hhcl9raXQnKVxuICAgIH07XG4gIH07XG5cbiAgTWVudS5wcm90b3R5cGUubG9hZENoYXJhY3RlcnMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNoYXJhY3RlcnMgPSB7XG4gICAgICBraXQ6IG5ldyBDaGFyYWN0ZXIodGhpcywgJ2NoYXJfa2l0JywgdGhpcy53b3JsZC5jZW50ZXJYLCB0aGlzLndvcmxkLmNlbnRlclkpLFxuICAgICAgcGFjbWFuOiBuZXcgQ2hhcmFjdGVyKHRoaXMsICdjaGFyX3BhY21hbicsIHRoaXMud29ybGQuY2VudGVyWCwgdGhpcy53b3JsZC5jZW50ZXJZKSxcbiAgICAgIHdpbGJlcjogbmV3IENoYXJhY3Rlcih0aGlzLCAnY2hhcl93aWxiZXInLCB0aGlzLndvcmxkLmNlbnRlclgsIHRoaXMud29ybGQuY2VudGVyWSlcbiAgICB9O1xuICB9O1xuXG4gIE1lbnUucHJvdG90eXBlLnByZWxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9jb25maWcgPSB0aGlzLmNhY2hlLmdldEpTT04oJ2NvbmZpZycpO1xuICAgIHRoaXMubG9hZC5wYWNrKCdtZW51JywgdGhpcy5fY29uZmlnLmFzc2V0UGFja1BhdGgsIG51bGwsIHRoaXMpO1xuICAgIHRoaXMubG9hZC5wYWNrKCdjaGFyYWN0ZXJzJywgdGhpcy5fY29uZmlnLmFzc2V0UGFja1BhdGgsIG51bGwsIHRoaXMpO1xuICAgIHRoaXMubG9hZENoYXJhY3RlcnMoKTtcbiAgfTtcblxuICBNZW51LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2hhcl9raXQsIGNoYXJfcGFjbWFuLCBjaGFyX3dpbGJlciwgaCwgdztcbiAgICB3ID0gNjEwICogMS41O1xuICAgIGggPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSA0MDA7XG4gICAgdGhpcy5jb250YWluZXIgPSBuZXcgUGhhc2VyLlJlY3RhbmdsZSh0aGlzLndvcmxkLmNlbnRlclggLSAodyAvIDIpLCB0aGlzLndvcmxkLmNlbnRlclkgLSAoaCAvIDIpLCB3LCBoKTtcbiAgICB0aGlzLmMxID0gbmV3IFBoYXNlci5SZWN0YW5nbGUodGhpcy5jb250YWluZXIudG9wTGVmdC54LCB0aGlzLmNvbnRhaW5lci50b3BMZWZ0LnksIHcgLyAzLCBoKTtcbiAgICB0aGlzLmMyID0gbmV3IFBoYXNlci5SZWN0YW5nbGUodGhpcy5jMS50b3BMZWZ0LnggKyAodyAvIDMpLCB0aGlzLmNvbnRhaW5lci50b3BMZWZ0LnksIHcgLyAzLCBoKTtcbiAgICB0aGlzLmMzID0gbmV3IFBoYXNlci5SZWN0YW5nbGUodGhpcy5jMi50b3BMZWZ0LnggKyAodyAvIDMpLCB0aGlzLmNvbnRhaW5lci50b3BMZWZ0LnksIHcgLyAzLCBoKTtcbiAgICBjaGFyX2tpdCA9IHRoaXMuY2hhcmFjdGVycy5raXQuY3JlYXRlKCkucGxheSgnaWRsZScpLnNwcml0ZTtcbiAgICBjaGFyX3BhY21hbiA9IHRoaXMuY2hhcmFjdGVycy5wYWNtYW4uY3JlYXRlKCkucGxheSgnaWRsZScpLnNwcml0ZTtcbiAgICBjaGFyX3dpbGJlciA9IHRoaXMuY2hhcmFjdGVycy53aWxiZXIuY3JlYXRlKCkucGxheSgnaWRsZScpLnNwcml0ZTtcbiAgICBjaGFyX2tpdC5hbGlnbkluKHRoaXMuYzEsIFBoYXNlci5DRU5URVIsIDAsIDApO1xuICAgIGNoYXJfcGFjbWFuLmFsaWduSW4odGhpcy5jMiwgUGhhc2VyLkNFTlRFUiwgMCwgMCk7XG4gICAgY2hhcl93aWxiZXIuYWxpZ25Jbih0aGlzLmMzLCBQaGFzZXIuQ0VOVEVSLCAwLCAwKTtcbiAgfTtcblxuICBNZW51LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmdhbWUuZGVidWcucmVjdGFuZ2xlKHRoaXMuY29udGFpbmVyLCAnI2ZmZmZmZicsIGZhbHNlKTtcbiAgICB0aGlzLmdhbWUuZGVidWcucmVjdGFuZ2xlKHRoaXMuYzEsICcjZmYwMDAwJywgZmFsc2UpO1xuICAgIHRoaXMuZ2FtZS5kZWJ1Zy5yZWN0YW5nbGUodGhpcy5jMiwgJyMwMGZmMDAnLCBmYWxzZSk7XG4gICAgdGhpcy5nYW1lLmRlYnVnLnJlY3RhbmdsZSh0aGlzLmMzLCAnIzAwMDBmZicsIGZhbHNlKTtcbiAgfTtcblxuICByZXR1cm4gTWVudTtcblxufSkoKTtcbiIsInZhciBDaGFyYWN0ZXI7XG5cbkNoYXJhY3RlciA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gQ2hhcmFjdGVyKGdhbWUsIG5hbWUxLCBwb3NYLCBwb3NZKSB7XG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICB0aGlzLm5hbWUgPSBuYW1lMTtcbiAgICB0aGlzLnBvc1ggPSBwb3NYO1xuICAgIHRoaXMucG9zWSA9IHBvc1k7XG4gICAgdGhpcy5nYW1lLmxvYWQuanNvbih0aGlzLm5hbWUsICdkYXRhL2NoYXJhY3RlcnMvJyArIHRoaXMubmFtZSArICcuanNvbicpO1xuICAgIHRoaXMuYW5jaG9yID0ge1xuICAgICAgeDogMC41LFxuICAgICAgeTogMC41XG4gICAgfTtcbiAgICB0aGlzLndpZHRoID0gNDI7XG4gICAgdGhpcy5oZWlnaHQgPSA2MDtcbiAgfVxuXG4gIENoYXJhY3Rlci5wcm90b3R5cGUuY3JlYXRlU3ByaXRlID0gZnVuY3Rpb24obGV2ZWwpIHtcbiAgICB0aGlzLmdldENvbmZpZygpO1xuICAgIHRoaXMuc3ByaXRlID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUodGhpcy5wb3NYLCB0aGlzLnBvc1ksIHRoaXMubmFtZSk7XG4gICAgdGhpcy5zcHJpdGUubWF4SGVhbHRoID0gdGhpcy5jb25maWcubWF4SGVhbHRoc1tsZXZlbCArIDFdO1xuICAgIHRoaXMuc3ByaXRlLmhlYWx0aCA9IHRoaXMuY29uZmlnLm1heEhlYWx0aHNbbGV2ZWwgKyAxXTtcbiAgICB0aGlzLnNwcml0ZS5kYXRhID0gdGhpcy5jb25maWc7XG4gICAgdGhpcy5zcHJpdGUubmFtZSA9IHRoaXMubmFtZTtcbiAgICB0aGlzLnNldEFuY2hvcigpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIENoYXJhY3Rlci5wcm90b3R5cGUuc2V0QW5jaG9yID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zcHJpdGUuYW5jaG9yLnNldFRvKHRoaXMuYW5jaG9yLngsIHRoaXMuYW5jaG9yLnkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIENoYXJhY3Rlci5wcm90b3R5cGUuZ2V0Q29uZmlnID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5jb25maWcgPSB0aGlzLmdhbWUuY2FjaGUuZ2V0SlNPTih0aGlzLm5hbWUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIENoYXJhY3Rlci5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24obGV2ZWwpIHtcbiAgICBsZXZlbCA9IGxldmVsID8gbGV2ZWwgOiAwO1xuICAgIHRoaXMuY3JlYXRlU3ByaXRlKGxldmVsKTtcbiAgICB0aGlzLmxvYWRBbmltYXRpb25zKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgQ2hhcmFjdGVyLnByb3RvdHlwZS5sb2FkQW5pbWF0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYW5pbWF0aW9ucy5mb3JFYWNoKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICBfdGhpcy5zcHJpdGUuYW5pbWF0aW9ucy5hZGQodmFsLm5hbWUsIHZhbC5zcHJpdGVJbmRleCwgdmFsLnNwZWVkLCB2YWwubG9vcCk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBEZWZhdWx0IGFuaW1hdGlvbi5cbiAgICpcbiAgICogQHR5cGUge0FycmF5fVxuICAgKi9cblxuICBDaGFyYWN0ZXIucHJvdG90eXBlLmFuaW1hdGlvbnMgPSBbXG4gICAge1xuICAgICAgbmFtZTogJ2lkbGUnLFxuICAgICAgc3ByaXRlSW5kZXg6IFswLCAxLCAyLCAxXSxcbiAgICAgIHNwZWVkOiA0LFxuICAgICAgbG9vcDogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIG5hbWU6ICdqdW1wJyxcbiAgICAgIHNwcml0ZUluZGV4OiBbNiwgNywgMTgsIDE5LCAyMCwgOF0sXG4gICAgICBzcGVlZDogMTAsXG4gICAgICBsb29wOiBmYWxzZVxuICAgIH0sIHtcbiAgICAgIG5hbWU6ICdydW4nLFxuICAgICAgc3ByaXRlSW5kZXg6IFszLCA0LCA1LCA0XSxcbiAgICAgIHNwZWVkOiAxMCxcbiAgICAgIGxvb3A6IHRydWVcbiAgICB9LCB7XG4gICAgICBuYW1lOiAnZmlnaHQnLFxuICAgICAgc3ByaXRlSW5kZXg6IFsyMywgMjIsIDIxXSxcbiAgICAgIHNwZWVkOiAxMCxcbiAgICAgIGxvb3A6IHRydWVcbiAgICB9LCB7XG4gICAgICBuYW1lOiAnaHVydCcsXG4gICAgICBzcHJpdGVJbmRleDogWzksIDEwLCAxMSwgMTBdLFxuICAgICAgc3BlZWQ6IDUsXG4gICAgICBsb29wOiBmYWxzZVxuICAgIH0sIHtcbiAgICAgIG5hbWU6ICdmYWxsaW5nJyxcbiAgICAgIHNwcml0ZUluZGV4OiBbOF0sXG4gICAgICBzcGVlZDogMSxcbiAgICAgIGxvb3A6IHRydWVcbiAgICB9XG4gIF07XG5cbiAgQ2hhcmFjdGVyLnByb3RvdHlwZS5nZXRBbmltYXRpb25zID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3ByaXRlLmFuaW1hdGlvbnM7XG4gIH07XG5cbiAgQ2hhcmFjdGVyLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24obmFtZSwgZnJhbWVSYXRlLCBfbG9vcCwga2lsbE9uQ29tcGxldGUpIHtcbiAgICB0aGlzLnNwcml0ZS5hbmltYXRpb25zLnBsYXkobmFtZSwgZnJhbWVSYXRlLCBfbG9vcCwga2lsbE9uQ29tcGxldGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJldHVybiBDaGFyYWN0ZXI7XG5cbn0pKCk7XG4iLCJ2YXIgQ29udHJvbHM7XG5cbkNvbnRyb2xzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBDb250cm9scyhnYW1lLCBjb25maWcpIHtcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuY29udHJvbHMgPSB7fTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGNvbnRyb2wuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30ga2V5XG4gICAqXG4gICAqIEByZXR1cm4ge1BoYXNlci5JbnB1dH1cbiAgICovXG5cbiAgQ29udHJvbHMucHJvdG90eXBlLmNyZWF0ZUNvbnRyb2wgPSBmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoKGtleS5pbmRleE9mKCdtb3VzZTonKSkgPT09IC0xKSB7XG4gICAgICByZXR1cm4gdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmRba2V5XSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmdhbWUuaW5wdXQuYWN0aXZlUG9pbnRlcltrZXkucmVwbGFjZSgnbW91c2U6JywgJycpXTtcbiAgICB9XG4gIH07XG5cblxuICAvKipcbiAgICogQ3JlYXRlIGNvbnRyb2xzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuXG4gIENvbnRyb2xzLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmNvbmZpZykuZm9yRWFjaCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICBfdGhpcy5jb250cm9sc1tPYmplY3Qua2V5cyhfdGhpcy5jb25maWcpW2tleV1dID0gX3RoaXMuY3JlYXRlQ29udHJvbChfdGhpcy5jb25maWdbdmFsXSk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgICByZXR1cm4gdGhpcy5jb250cm9scztcbiAgfTtcblxuICByZXR1cm4gQ29udHJvbHM7XG5cbn0pKCk7XG4iLCJHYW1lLkxheWVyID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBMYXllcihnYW1lLCBtYXAsIGxheWVyc05hbWUpIHtcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgIHRoaXMubWFwID0gbWFwO1xuICAgIHRoaXMubGF5ZXJzTmFtZSA9IGxheWVyc05hbWU7XG4gICAgdGhpcy5nYW1lTGF5ZXJzID0gW107XG4gIH1cblxuICBMYXllci5wcm90b3R5cGUuY3JlYXRlTGF5ZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sYXllcnNOYW1lLmZvckVhY2goKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgdmFyIGxheWVyO1xuICAgICAgICBsYXllciA9IF90aGlzLm1hcC5jcmVhdGVMYXllcih2YWwpO1xuICAgICAgICBsYXllci5yZXNpemVXb3JsZCgpO1xuICAgICAgICBfdGhpcy5nYW1lTGF5ZXJzLnB1c2gobGF5ZXIpO1xuICAgICAgICBjb25zb2xlLmxvZyhfdGhpcy5nYW1lTGF5ZXJzKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9O1xuXG4gIHJldHVybiBMYXllcjtcblxufSkoKTtcbiIsInZhciBIZWxwZXI7XG5cbkhlbHBlciA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gSGVscGVyKGdhbWUpIHtcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICB9XG5cbiAgSGVscGVyLnByb3RvdHlwZS5sb2FkSW1hZ2VzID0gZnVuY3Rpb24oaW1hZ2VzKSB7XG4gICAgaW1hZ2VzLmZvckVhY2goKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24odmFsLCBrZXksIGFycikge1xuICAgICAgICB2YXIgaW1nO1xuICAgICAgICBpbWcgPSB2YWwuc3BsaXQoJ3wnKTtcbiAgICAgICAgX3RoaXMuZ2FtZS5sb2FkLmltYWdlKGltZ1swXSwgaW1nWzFdKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEhlbHBlci5wcm90b3R5cGUubG9hZFNwcml0ZXNoZWV0cyA9IGZ1bmN0aW9uKGltYWdlcykge1xuICAgIGltYWdlcy5mb3JFYWNoKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbCwga2V5LCBhcnIpIHtcbiAgICAgICAgdmFyIGltZztcbiAgICAgICAgaW1nID0gdmFsLnNwbGl0KCd8Jyk7XG4gICAgICAgIF90aGlzLmdhbWUubG9hZC5zcHJpdGVzaGVldChpbWdbMF0sIGltZ1sxXSwgcGFyc2VJbnQoaW1nWzJdLCBwYXJzZUludChpbWdbM10pKSk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZXR1cm4gSGVscGVyO1xuXG59KSgpO1xuIiwidmFyIE1vYjtcblxuTW9iID0gKGZ1bmN0aW9uKCkge1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgTW9iIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtHYW1lfSBAZ2FtZVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IEBuYW1lXG4gICAqIEBwYXJhbSAge29iamVjdH0gQHNwcml0ZU9ialxuICAgKlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgZnVuY3Rpb24gTW9iKGdhbWUsIG5hbWUsIHNwcml0ZU9iaikge1xuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnNwcml0ZU9iaiA9IHNwcml0ZU9iajtcbiAgICByZXR1cm47XG4gIH1cblxuICBNb2IucHJvdG90eXBlLmxvYWRTcHJpdGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmdhbWUubG9hZC5zcHJpdGVzaGVldCh0aGlzLm5hbWUsIHRoaXMuc3ByaXRlT2JqLnBhdGgsIHRoaXMuc3ByaXRlT2JqLngsIHRoaXMuc3ByaXRlT2JqLnkpO1xuICB9O1xuXG4gIHJldHVybiBNb2I7XG5cbn0pKCk7XG4iLCJ2YXIgUGxheWVyLFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuUGxheWVyID0gKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKFBsYXllciwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gUGxheWVyKCkge1xuICAgIHJldHVybiBQbGF5ZXIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gUGxheWVyO1xuXG59KShQaGFzZXIuU3ByaXRlKTtcbiIsInZhciBUZXN0O1xuXG5UZXN0ID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBUZXN0KCkge31cblxuICByZXR1cm4gVGVzdDtcblxufSkoKTtcbiIsInZhciBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuTW9icy5FbmVteS50b25ndWUgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQodG9uZ3VlLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiB0b25ndWUoKSB7XG4gICAgcmV0dXJuIHRvbmd1ZS5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiB0b25ndWU7XG5cbn0pKE1vYik7XG4iLCJcbi8qKlxuICogTGV2ZWwgMVxuICovXG52YXIgX3RpbWU7XG5cbkdhbWUuTGV2ZWwub25lID0gZnVuY3Rpb24oZ2FtZSkge307XG5cbl90aW1lID0gdm9pZCAwO1xuXG5HYW1lLkxldmVsLm9uZS5wcm90b3R5cGUgPSB7XG4gIHByZWxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCdMb2FkaW5nIExldmVsIDEgLi4uJyk7XG4gIH0sXG4gIGNyZWF0ZTogZnVuY3Rpb24oJGdhbWUpIHtcbiAgICBjb25zb2xlLmxvZygnTGV2ZWwgMTo6Y3JlYXRlJywgJGdhbWUsIHRoaXMpO1xuICAgIHRoaXMuc3RhZ2UuYmFja2dyb3VuZENvbG9yID0gR2FtZS5MZXZlbC5jb25mLm9uZS5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgdGhpcy5waHlzaWNzLnN0YXJ0U3lzdGVtKEdhbWUuUGh5c2ljcyk7XG4gICAgdGhpcy5waHlzaWNzLnAyLmFwcGx5R3Jhdml0eSA9IHRydWU7XG4gICAgdGhpcy5waHlzaWNzLnAyLnNldEltcGFjdEV2ZW50cyh0cnVlKTtcbiAgICB0aGlzLnBoeXNpY3MucDIuYXBwbHlTcHJpbmdGb3JjZXMgPSB0cnVlO1xuICAgIEdhbWUuTWFwID0gdGhpcy5hZGQudGlsZW1hcCgnbWFwJyk7XG4gICAgR2FtZS5NYXAuYWRkVGlsZXNldEltYWdlKCd0aWxlc2V0Jyk7XG4gICAgJCQkZ2FtZS5sYXllciA9IG5ldyBHYW1lLkxheWVyKCRnYW1lLCBHYW1lLk1hcCwgWydHcm91bmQnLCAnUGxhdGZvcm0nLCAnQWVzdGhldGljcycsICdQb3dlcnVwcyddKTtcbiAgICAkJCRnYW1lLmxheWVyLmNyZWF0ZUxheWVycygpO1xuICAgIEdhbWUuTWFwLnNldENvbGxpc2lvbkJldHdlZW4oMCwgMjU2LCB0cnVlLCAnR3JvdW5kJyk7XG4gICAgR2FtZS5NYXAuc2V0Q29sbGlzaW9uQmV0d2VlbigwLCAyNTYsIHRydWUsICdQbGF0Zm9ybScpO1xuICAgIF9wbGF5ZXIucmVzcGF3biA9IHRoaXMuYWRkLmdyb3VwKCk7XG4gICAgR2FtZS5NYXAuY3JlYXRlRnJvbU9iamVjdHMoJ1NwYXducG9pbnQnLCA1LCAnJywgMCwgdHJ1ZSwgZmFsc2UsIF9wbGF5ZXIucmVzcGF3bik7XG4gICAgR2FtZS5Db250cm9scyA9IChuZXcgQ29udHJvbHModGhpcywgX2NvbnRyb2xzKSkuY3JlYXRlKCk7XG4gICAgdGhpcy5waHlzaWNzLnAyLmNvbnZlcnRUaWxlbWFwKEdhbWUuTWFwLCAkJCRnYW1lLmxheWVyLmdhbWVMYXllcnNbMF0pO1xuICAgIHRoaXMucGh5c2ljcy5wMi5jb252ZXJ0VGlsZW1hcChHYW1lLk1hcCwgJCQkZ2FtZS5sYXllci5nYW1lTGF5ZXJzWzFdKTtcbiAgICAkJCRnYW1lLnBsYXllci5jcmVhdGUoMCwgMCwgdGhpcy5waHlzaWNzLnAyKTtcbiAgICB0aGlzLnBoeXNpY3MucDIucmVzdGl0dXRpb24gPSBHYW1lLlJlc3RpdHV0aW9uO1xuICAgIHRoaXMucGh5c2ljcy5wMi5ncmF2aXR5LnkgPSBHYW1lLkdyYXZpdHk7XG4gICAgdGhpcy5zcGF3bigpO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uKCR1cGRhdGUpIHtcbiAgICAkJCRnYW1lLnBsYXllci51cGRhdGUoR2FtZS5Db250cm9scyk7XG4gICAgaWYgKEdhbWUuQ29udHJvbHMudXAuaXNEb3duKSB7XG4gICAgICBpZiAoR2FtZS5Db250cm9scy5yaWdodC5pc0Rvd24pIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1VQIGFuZCBSSUdIVCcsICQkJGdhbWUucGxheWVyLmdhbWVTcHJpdGUpO1xuICAgICAgfVxuICAgICAgaWYgKEdhbWUuQ29udHJvbHMubGVmdC5pc0Rvd24pIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1VQIGFuZCBMRUZUJyk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCRnYW1lKSB7XG4gICAgJGdhbWUuZGVidWcuYm9keUluZm8oJCQkZ2FtZS5wbGF5ZXIuZ2FtZVNwcml0ZSwgMzIsIDMyKTtcbiAgfSxcbiAgbm9Nb3JlSnVtcDogZnVuY3Rpb24oKSB7XG4gICAgUGxheWVyLmp1bXBTdGF0dXMgPSBmYWxzZTtcbiAgICBjb25zb2xlLmxvZygnTm8gbW9yZSBKdW1wIScpO1xuICB9LFxuICBzcGF3bjogZnVuY3Rpb24oKSB7XG4gICAgX3BsYXllci5yZXNwYXduLmZvckVhY2goKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oc3Bhd25Qb2ludCkge1xuICAgICAgICAkJCRnYW1lLnBsYXllci5nYW1lU3ByaXRlLnJlc2V0KHNwYXduUG9pbnQueCwgc3Bhd25Qb2ludC55KTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9LFxuICBjaGVja0hpdDogZnVuY3Rpb24oc3ByaXRlQSwgc3ByaXRlQikge1xuICAgIHZhciBib3VuZHMsIGludGVyc2VjdHM7XG4gICAgYm91bmRzID0gW3Nwcml0ZUEuZ2V0Qm91bmRzKCksIHNwcml0ZUIuZ2V0Qm91bmRzKCldO1xuICAgIGludGVyc2VjdHMgPSBQaGFzZXIuUmVjdGFuZ2xlLmludGVyc2VjdHMoYm91bmRzWzBdLCBib3VuZHNbMV0pO1xuICAgIGlmIChpbnRlcnNlY3RzKSB7XG4gICAgICBjb25zb2xlLmxvZygnY2hlY2tIaXQnLCBpbnRlcnNlY3RzLCBib3VuZHMpO1xuICAgIH1cbiAgICByZXR1cm4gaW50ZXJzZWN0cztcbiAgfVxufTtcbiJdfQ==
