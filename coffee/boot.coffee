###*
 * boot.coffee
###

Game.Boot = (game)->

Game.Boot.prototype =
    init: ->
        @input.maxPointers = 1

        return


    preload: ->
        console.log 'Boot loading...'
        @load.image 'preloaderImg', 'assets/preloader.gif'

        return

    create: ->

        @state.start 'Preload'


