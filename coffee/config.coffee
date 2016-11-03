###*
 * Configuration
###

Game = {}
Game.Level = {}
Game.Level.conf =
    one:
        backgroundColor: '#3a5963'
Game.Map = undefined
Game.Layer = {}
Game.Physics = Phaser.Physics.P2JS
Game.Gravity = 1500
Game.Restitution = 0.1
Game.Debug = true
Game.Camera =
    type: Phaser.Camera.FOLLOW_LOCKON
    speed:
        x: 0.1
        y: 0.1

window.$GAME = undefined

_controls =
    right: 'D'
    left: 'A'
    up: 'SPACEBAR'
    down: 'S'
    fight: 'mouse:leftButton'

_player =
    speed: 300
    jump: 600
    jumpTimer: 0
    jumpStatus: false
    fightMode: false
    respawn: undefined


$$$game = {}



Mobs = {
    Enemy: {}
    Neutral: {}
}
