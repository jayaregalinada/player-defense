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
