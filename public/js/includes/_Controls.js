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
