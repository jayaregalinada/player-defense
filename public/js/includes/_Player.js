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
