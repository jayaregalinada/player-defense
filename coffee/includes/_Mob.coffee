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

        return

    loadSprite: ->
        @game.load.spritesheet @name, @spriteObj.path, @spriteObj.x, @spriteObj.y

        return

