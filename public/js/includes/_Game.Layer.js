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
