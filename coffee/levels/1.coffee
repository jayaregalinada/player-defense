###*
 * Level 1
###

Game.Level.one = (game)->

_time = undefined

Game.Level.one.prototype =
    preload: ->
        console.log 'Loading Level 1 ...'

        return
    create: ($game)->
        console.log 'Level 1::create', $game, @
        @stage.backgroundColor = Game.Level.conf.one.backgroundColor
        @physics.startSystem Game.Physics
        @physics.p2.applyGravity = true
        @physics.p2.setImpactEvents true
        @physics.p2.applySpringForces = true


        Game.Map = @add.tilemap 'map'
        Game.Map.addTilesetImage 'tileset'
        $$$game.layer = new Game.Layer $game, Game.Map, [
            'Ground'
            'Platform'
            'Aesthetics'
            'Powerups'
        ]
        $$$game.layer.createLayers()
        Game.Map.setCollisionBetween 0, 256, true, 'Ground'
        Game.Map.setCollisionBetween 0, 256, true, 'Platform'

        _player.respawn = @add.group()
        Game.Map.createFromObjects 'Spawnpoint', 5, '', 0, true, false, _player.respawn

        Game.Controls = (new Controls @, _controls).create()

        @physics.p2.convertTilemap Game.Map, $$$game.layer.gameLayers[0]
        @physics.p2.convertTilemap Game.Map, $$$game.layer.gameLayers[1]

        $$$game.player.create 0, 0, @physics.p2

        @physics.p2.restitution = Game.Restitution
        @physics.p2.gravity.y = Game.Gravity

        @spawn()

        return
    update: ($update)->
        $$$game.player.update Game.Controls
        if Game.Controls.up.isDown
            if Game.Controls.right.isDown
                console.log 'UP and RIGHT', $$$game.player.gameSprite
            if Game.Controls.left.isDown
                console.log 'UP and LEFT'


        return
    render: ($game)->
        # $$$game.player.getPhysicsBody().sprite
        # $$$game.player.debugMode 32, 32
        $game.debug.bodyInfo $$$game.player.gameSprite, 32, 32
        # $game.debug.inputInfo 32, 32

        return
    noMoreJump: ->
        Player.jumpStatus = false
        console.log 'No more Jump!'

        return

    spawn: ->
        _player.respawn.forEach (spawnPoint)=>
            $$$game.player.gameSprite.reset spawnPoint.x, spawnPoint.y

            return


        return

    checkHit: (spriteA, spriteB)->
        bounds = [
            spriteA.getBounds()
            spriteB.getBounds()
        ]
        intersects = Phaser.Rectangle.intersects bounds[0], bounds[1]
        if intersects
            console.log 'checkHit', intersects, bounds

        intersects
