class Game.Layer
    constructor: (@game, @map, @layersName)->

        @gameLayers = []

    createLayers: ->
        @layersName.forEach (val, key)=>
            layer = @map.createLayer val
            layer.resizeWorld()
            @gameLayers.push layer
            console.log @gameLayers

            return

        return

