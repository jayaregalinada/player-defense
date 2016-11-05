class Helper
    constructor: (@game)->


    loadImages: (images)->
        images.forEach (val, key, arr)=>
            img = val.split '|'
            @game.load.image img[0], img[1]

            return

        @

    loadSpritesheets: (images)->
        images.forEach (val, key, arr)=>
            img = val.split '|'
            @game.load.spritesheet img[0], img[1], parseInt img[2], parseInt img[3]

            return

        @

