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
