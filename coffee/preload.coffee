class Game.Preload
    constructor: (@game)->

    preload: ->
        @_config = @game.cache.getJSON 'config'
        @stage.backgroundColor = @_config.background.color
        @load.pack 'preload', @_config.assetPack.directory + @_config.assetPack.filename, null, @

        return
    create: ->
        @stage.backgroundColor = @_config.background.color
        @add.sprite @world.centerX - (64 / 2), @world.centerY - (64 / 2), 'preloaderImg'
        @state.start 'Menu'

        return
