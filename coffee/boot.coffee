class Game.Boot
    constructor: (@game)->

    preload: ->
        @input.maxPointers = 1
        @load.json 'config', 'data/config.json'


        return

    create: ->
        config = @cache.getJSON 'config'

        @state.start 'Preload'

        return
