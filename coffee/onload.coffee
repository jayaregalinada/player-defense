###*
 * Trigger this when window.onload occur.
 *
 * Filename: onload.coffee
###
window.onload = ->
    game = new Phaser.Game window.screen.width, window.innerHeight, Phaser.CANVAS, 'GAME'
    # game = new Phaser.Game 960, 640, Phaser.CANVAS, ''

    game.state.add 'Boot', Game.Boot
    game.state.add 'Preload', Game.Preload
    game.state.add 'Menu', Game.Menu
    game.state.add 'Level 1', Game.Level.one

    game.state.start 'Boot'

    window.$GAME = game

    return
