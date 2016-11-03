class Controls
    constructor: (@game, @config)->
        @controls = {}


    ###*
     * Create a control.
     *
     * @param  {string} key
     *
     * @return {Phaser.Input}
    ###
    createControl: (key)->
        if (key.indexOf 'mouse:') == -1
            @game.input.keyboard.addKey Phaser.Keyboard[key]
        else
            @game.input.activePointer[key.replace 'mouse:', '']

    ###*
     * Create controls.
     *
     * @return {object}
    ###
    create: ->
        Object.keys(@config).forEach (val, key)=>
            @controls[Object.keys(@config)[key]] = @createControl @config[val]

            return

        @controls

