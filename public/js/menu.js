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
