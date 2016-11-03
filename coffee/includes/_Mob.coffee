class Mob

    ###*
     * Create Mob instance.
     *
     * @param  {Game} @game
     * @param  {string} @name
     * @param  {object} @spriteObj
     *
     * @return {void}
    ###
    constructor: (@game, @name, @spriteObj)->
        console.log 'New Mob has been loaded', @name

    loadSprite: ->
        @game.load.spritesheet @name, @spriteObj.path, @spriteObj.x, @spriteObj.y

        return

