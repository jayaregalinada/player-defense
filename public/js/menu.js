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
