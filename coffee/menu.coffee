class Game.Menu
    constructor: (@game)->
        @characters = {}
        @_config = {}
        @container = undefined

    spriteCharacters: ->
        @characters =
            kit: @add.sprite @world.centerX, @world.centerY, 'char_kit'

        return


    loadCharacters: ->
        @characters =
            kit: new Character @, 'char_kit', @world.centerX, @world.centerY
            pacman: new Character @, 'char_pacman', @world.centerX, @world.centerY
            wilber: new Character @, 'char_wilber', @world.centerX, @world.centerY

        return

    preload: ->
        @_config = @cache.getJSON 'config'
        @load.pack 'menu', @_config.assetPackPath, null, @
        @load.pack 'characters', @_config.assetPackPath, null, @
        @loadCharacters()


        return

    create: ->
        w = 610 * 1.5
        h = window.innerHeight - 400
        @container = new Phaser.Rectangle @world.centerX - (w/2), @world.centerY - (h/2), w, h
        @c1 = new Phaser.Rectangle @container.topLeft.x, @container.topLeft.y, (w/3), h
        @c2 = new Phaser.Rectangle @c1.topLeft.x + (w/3), @container.topLeft.y, (w/3), h
        @c3 = new Phaser.Rectangle @c2.topLeft.x + (w/3), @container.topLeft.y, (w/3), h

        char_kit = @characters.kit.create().play('idle').sprite
        char_pacman = @characters.pacman.create().play('idle').sprite
        char_wilber = @characters.wilber.create().play('idle').sprite

        char_kit.alignIn @c1, Phaser.CENTER, 0, 0
        char_pacman.alignIn @c2, Phaser.CENTER, 0, 0
        char_wilber.alignIn @c3, Phaser.CENTER, 0, 0

        return

    render: ->
        @game.debug.rectangle @container, '#ffffff', false
        @game.debug.rectangle @c1, '#ff0000', false
        @game.debug.rectangle @c2, '#00ff00', false
        @game.debug.rectangle @c3, '#0000ff', false

        return
