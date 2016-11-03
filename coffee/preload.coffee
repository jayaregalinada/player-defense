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
        @load.image 'tileset', 'assets/map/1/tileset.png'



        # LOAD PLAYER
        # @load.spritesheet 'player', 'assets/player/kit.png', 28, 40
        # @load.spritesheet 'player', 'assets/player/kit_orig.png', 56, 80
        # @load.spritesheet 'player', 'assets/player/aliengreen_35x50.png', 35, 50
        $$$game.player = (new Player @, 'player', {
            path: 'assets/player/kit_from_firefox.png'
            x: 56
            y: 80
        })

        $$$game.player.loadSprite()


        # LOAD MOBS
        (new Mobs.Enemy.tongue @, 'mobEnemyTongue', {
            path: 'assets/mob/enemies/tongue.png'
            x: 49
            y: 40
        }).loadSprite()
        # @load.spritesheet 'mobEnemyTongue', 'assets/mob/enemies/tongue.png', 49, 40

        return
    create: ->
        @state.start 'Level 1'

        return
