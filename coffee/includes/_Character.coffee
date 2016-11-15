class Character

    constructor: (@game, @name, @posX, @posY)->
        @game.load.json @name, 'data/characters/' + @name + '.json'
        @anchor =
            x: 0.5
            y: 0.5
        @width = 42
        @height = 60


    createSprite: (level)->
        @getConfig()
        @sprite = @game.add.sprite @posX, @posY, @name
        @sprite.maxHealth = @config.maxHealths[level + 1]
        @sprite.health = @config.maxHealths[level + 1]
        @sprite.data = @config
        @sprite.name = @name
        @setAnchor()

        @

    setAnchor: ->
        @sprite.anchor.setTo @anchor.x, @anchor.y

        @

    getConfig: ->
        @config = @game.cache.getJSON @name

        @

    create: (level)->
        level = if level then level else 0
        @createSprite level
        @loadAnimations()

        @

    loadAnimations: ->
        @animations.forEach (val)=>
            @sprite.animations.add val.name, val.spriteIndex, val.speed, val.loop

            return

        @

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

    getAnimations: ->
        @sprite.animations

    play: (name, frameRate, _loop, killOnComplete)->
        @sprite.animations.play name, frameRate, _loop, killOnComplete

        @
