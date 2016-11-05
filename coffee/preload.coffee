###*
 * preload.coffee
###

Game.Preload = (game)->

    @preloader = null

    return

Game.Preload.prototype =
    preload: ->
        console.log 'Preload loading...'
        @preloader = @add.sprite @world.centerX, @world.centerY, 'preloaderImg'
        @time.advanceTiming = true
        @load.setPreloadSprite @preloader

        # @load.atlasJSONArray 'player', 'assets/player/platformerGraphicsDeluxe/p1_spritesheet.png', 'assets/player/platformerGraphicsDeluxe/p1_spritesheet.json'

        # LOAD ALL ASSETS

        # LOAD MAP
        @load.tilemap 'map', 'assets/map/1/map.json', null, Phaser.Tilemap.TILED_JSON
        @load.spritesheet 'button_play', 'assets/buttons/play.png', 200, 50
        @load.image 'tileset', 'assets/map/1/tileset.png'




        # LOAD PLAYER
        # @load.spritesheet 'player', 'assets/player/kit.png', 28, 40
        # @load.spritesheet 'player', 'assets/player/kit_orig.png', 56, 80
        # @load.spritesheet 'player', 'assets/player/aliengreen_35x50.png', 35, 50
        # $$$game.player = (new Player @, 'player', {
        #     path: 'assets/player/kit_from_firefox.png'
        #     x: 42
        #     y: 60
        # })

        # $$$game.player.loadSprite()
        #
        # LOAD CHARACTERS
        $$$game.characters.kit = new Player @, 'kit',
            path: 'assets/player/kit_from_firefox.png'
            x: 42
            y: 60

        $$$game.characters.kit.loadSprite()

        $$$game.characters.pacman = new Player @, 'pacman',
            path: 'assets/player/pacman_from_philippines.png'
            x: 42
            y: 60
        $$$game.characters.pacman.loadSprite()

        $$$game.characters.wilber = new Player @, 'wilber',
            path: 'assets/player/wilber_from_gimp.png'
            x: 42
            y: 60
        $$$game.characters.wilber.loadSprite()

        # @load.spritesheet 'char1', 'assets/player/kit_from_firefox.png', 42, 60
        # @load.spritesheet 'char2', 'assets/player/pacman_from_philippines.png', 42, 60
        # @load.spritesheet 'char3', 'assets/player/wilber_from_gimp.png', 42, 60


        # LOAD MOBS
        $$$game.mobs.tongue =
        (new Mobs.Enemy.tongue @, 'mobEnemyTongue', {
            path: 'assets/mob/enemies/tongue.png'
            x: 49
            y: 40
        })

        $$$game.mobs.tongue.loadSprite()
        # @load.spritesheet 'mobEnemyTongue', 'assets/mob/enemies/tongue.png', 49, 40

        return
    create: ->
        @state.start 'Menu'

        return
