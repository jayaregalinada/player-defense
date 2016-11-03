class Player extends Mob

    ###*
     * Player create.
     *
     * @param  {number} x Player position x coordinate
     * @param  {number} y Player position y coordinate
     *
     * @return {Phaser.Sprite}
    ###
    create: (x, y, @physics)->
        _sprite = @sprite x, y
        @gameSprite = _sprite
        @anchor _sprite, 0.5, 0.5
        @animations.forEach (val)->
            _sprite.animations.add val.name, val.spriteIndex, val.speed, val.loop

            return
        @camera _sprite
        @physicsEnable @physics
        @createPhysics()


        @

    ###*
     * Create sprite from the spritesheet.
     *
     * @param  {number} posX
     * @param  {number} posY
     *
     * @return {Phaser.Sprite}
    ###
    sprite: (posX, posY)->
        @game.add.sprite posX, posY, @name

    ###*
     * Player anchor location.
     *
     * @param  {Phaser.Sprite} sprite
     * @param  {number} x
     * @param  {number} y
     *
     * @return {Phaser.Sprite}
    ###
    anchor: (sprite, x, y)->
        sprite.anchor.setTo x, y

    ###*
     * Create animation.
     *
     * @param  {Phaser.Sprite} sprite
     * @param  {string} name        Name of the animation
     * @param  {array} spriteIndex  Array of index
     * @param  {number} speed       Speed of the animation
     * @param  {bool} $loop         Loop or not
     *
     * @return {Phaser.Animations}
    ###
    createAnimations: (sprite, name, spriteIndex, speed, $loop)->
        sprite.animations.add name, spriteIndex, speed, $loop

    ###*
     * Default animation.
     *
     * @type {Array}
    ###
    animations: [
        {
            name: 'idle'
            spriteIndex: [0, 1, 2, 1]
            speed: 4
            loop: true
        }
        {
            name: 'jump'
            spriteIndex: [6, 7, 18, 19, 20, 8]
            speed: 10
            loop: false
        }
        {
            name: 'run'
            spriteIndex: [3, 4, 5, 4]
            speed: 10
            loop: true
        }
        {
            name: 'fight'
            spriteIndex: [23, 22, 21]
            speed: 10
            loop: true
        }
        {
            name: 'hurt'
            spriteIndex: [9, 10, 11, 10]
            speed: 5
            loop: false
        }
        {
            name: 'falling'
            spriteIndex: [8]
            speed: 1
            loop: true
        }
    ]

    ###*
     * Camera will follow player.
     *
     * @param  {Phaser.Sprite} sprite
     *
     * @return {Phaser.Camera}
    ###
    camera: (sprite)->
        @game.camera.follow sprite, Game.Camera.type, Game.Camera.speed.x, Game.Camera.speed.y

    ###*
     * Enable physics.
     *
     * @param  {Phaser.Physics} physics
     *
     * @return {Phaser.Physics}
    ###
    physicsEnable: (physics)->
        physics.enable @gameSprite

    ###*
     * Create Physics.
     * NOTE: MUST! Enable physics first @physicsEnable().
     *
     * @return {void} [description]
    ###
    createPhysics: ->
        @physics.collideWorldBounds = true
        @getPhysicsBody().fixedRotation = true

        return

    ###*
     * Get Physics Body.
     *
     * @return {Phaser.Physics.Body}
    ###
    getPhysicsBody: ->
        @gameSprite.body

    ###*
     * Update method.
     *
     * @param  {obj} controls Game.Controls
     *
     * @return {void}
    ###
    update: (controls)->
        @controls = controls
        @getPhysicsBody().velocity.x = 0
        @changeJumpStatus()
        @controlHorizontal 'left'
        @controlHorizontal 'right'
        @controlFight()
        @controlUp()
        @animationIdle()

        return

    animationIdle: (sprite)->
        _sprite = if sprite then sprite else @gameSprite
        if (_sprite.body.velocity.x <= 0 and _sprite.body.velocity.x > -1) and (_sprite.body.velocity.y <= 0 and _sprite.body.velocity.y > -1)
            _sprite.animations.play 'idle'

        return

    ###*
     * Player controls horizontally.
     *
     * @param  {string} leftOrRight
     * @param  {obj} controls    Game.Controls
     *
     * @return {void}
    ###
    controlHorizontal: (leftOrRight, controls)->
        _controls = if controls then controls else @controls
        if _controls[leftOrRight].isDown
            # if not @getPhysicsBody().onFloor()
                # @gameSprite.animations.play 'falling'
            # else
                # @gameSprite.animations.play 'run'
            @gameSprite.animations.play 'run'

            switch leftOrRight
                when 'left'
                    @gameSprite.scale.setTo -1, 1
                    @getPhysicsBody().moveLeft _player.speed

                    return
                when 'right'
                    @gameSprite.scale.setTo 1, 1
                    @getPhysicsBody().moveRight _player.speed

                    return

        return

    ###*
     * Player Jumps when jump button is pressed.
     *
     * @param  {obj} controls Game.Controls
     *
     * @return {void}
    ###
    controlUp: (controls)->
        _controls = if controls then controls else @controls
        # Jump
        if _controls.up.isDown and @checkIfCanJump()
            @gameSprite.animations.play 'jump'
            _player.jumpStatus = true
            @getPhysicsBody().moveUp _player.jump
            _player.jumpTimer = @game.time.now

            return

        # Double Jump
        if _controls.up.isDown and not @checkIfCanJump() and _player.jumpStatus
            @gameSprite.animations.play 'jump'
            @getPhysicsBody().moveUp _player.jump/2

        return

    ###*
     * Player fights when fight button is pressed.
     *
     * @param  {obj} controls Game.Controls
     *
     * @return {void}
    ###
    controlFight: (controls)->
        _controls = if controls then controls else @controls
        if _controls.fight.isDown
            _player.fightMode = true
            @gameSprite.animations.play 'fight2', false, true
        else
            _player.fightMode = false

        return

    ###*
     * Check if player can jump.
     *
     * @return {bool}
    ###
    checkIfCanJump: ->
        yAxis = p2.vec2.fromValues(0, 1)
        result = false
        i = 0
        while i < @physics.world.narrowphase.contactEquations.length
            c = @physics.world.narrowphase.contactEquations[i]
            if c.bodyA == @getPhysicsBody().data or c.bodyB == @getPhysicsBody().data
                d = p2.vec2.dot(c.normalA, yAxis)
                # Normal dot Y-axis
                if c.bodyA == @getPhysicsBody().data
                    d *= -1
                if d > 0.5
                    result = true
            i++

        result

    changeJumpStatus: ->
        if @game.time.now - _player.jumpTimer > Phaser.Timer.HALF
            _player.jumpStatus = false

        return

    debugMode: (x, y)->
        @game.debug.bodyInfo @gameSprite, x, y

        return


