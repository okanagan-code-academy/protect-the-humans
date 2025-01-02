namespace SpriteKind {
    export const Roomba = SpriteKind.create()
    export const Target = SpriteKind.create()
    export const Excavator = SpriteKind.create()
}
namespace userconfig {
    export const ARCADE_SCREEN_WIDTH = 180
    export const ARCADE_SCREEN_HEIGHT = 120
}

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(currentControlledEntity)) {
        return
    }
    let directionX: number = Math.sign(currentControlledEntity.vx)
    let directionY: number = Math.sign(currentControlledEntity.vy)
    // - Figure out direction to dash
    // - Start the dash and not anything else
    // - Once the dash starts we can not cancel it
    // - Continue moving on once dash is done
    isDashing = true
    controller.moveSprite(currentControlledEntity, 0, 0)
    timer.after(50, function () {
        // could cause crash if Countdown timer ends before this
        if (!(currentControlledEntity)) {
            return
        }
        spriteutils.moveTo(currentControlledEntity, spriteutils.pos(currentControlledEntity.x + 50 * directionX, currentControlledEntity.y + 50 * directionY), 250)
        timer.after(250, function () {
            if (currentControlledEntity) {
                controller.moveSprite(currentControlledEntity, 50, 50)
            }
            isDashing = false
        })
    })
})

// Keyboard Input
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    let nearestEntity = spriteutils.getSpritesWithin(SpriteKind.Roomba, 40, playerSprite).concat(spriteutils.getSpritesWithin(SpriteKind.Excavator, 40, playerSprite))
    if (nearestEntity.length > 0 && !(currentControlledEntity)) {
        info.startCountdown(50)
        scene.cameraFollowSprite(nearestEntity[0])
        controller.moveSprite(playerSprite, 0, 0)
        controller.moveSprite(nearestEntity[0], 50, 50)
        currentControlledEntity = nearestEntity[0]
    }
})
function setRandomVelocity (sprite: Sprite, maxSpeed: number, directionX: number, directionY: number) {
    speed = maxSpeed
    if (Math.random() <= 0.5) {
        directionX = -1
    }
    if (Math.random() <= 0.5) {
        directionY = -1
    }
    sprite.setVelocity(directionX * speed, directionY * speed)
}
function generateTileMapSlime () {
    enemyAmount = randint(1, 10)
    for (let j = 0; j <= enemyAmount; j++) {
        createRandomEnemy(tiles.getRandomTileByType(assets.tile`floorTile`))
    }
}
info.onCountdownEnd(function () {
    resetControlAbility()
})

function setTileMap () {
    tiles.setTilemap(tilemap`test`)
}
// creating sprites on tilemap
function generateTileMapPlayer () {
    createPlayer()
    tiles.placeOnTile(playerSprite, tiles.getTileLocation(8, 8))
}
function onStart () {
    setTileMap()
    generateTileMapPlayer()
    generateTileMapRoomba()
    generateTileMapSlime()
    generateTileMapExcavator()
    createTargettingIndicatorSprite()
}
function createTargettingIndicatorSprite () {
    targetSprite = sprites.create(assets.image`target`, SpriteKind.Target)
}
function createPlayer () {
    playerSprite = sprites.create(assets.image`player`, SpriteKind.Player)
    controller.moveSprite(playerSprite)
    scene.cameraFollowSprite(playerSprite)
    playerSprite.z = 1000
}
function resetControlAbility () {
    info.stopCountdown()
    controller.moveSprite(playerSprite)
    scene.cameraFollowSprite(playerSprite)
    controller.moveSprite(currentControlledEntity, 0, 0)
    setRandomVelocity(currentControlledEntity, 15, randint(-1, 1), randint(-1, 1))
    currentControlledEntity = null
}
// Events
sprites.onOverlap(SpriteKind.Roomba, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (currentControlledEntity == null) {
        roombaExplodeAnimation(sprite)
        sprite.destroy()
        return
    }
    if (!(isDashing)) {
        if (sprite.id == currentControlledEntity.id) {
            resetControlAbility()
            scene.cameraShake(25, 200)
        }
        roombaExplodeAnimation(sprite)
        sprite.destroy()
        return
    }
    if (sprite.id == currentControlledEntity.id) {
        slimeExplodeAnimation(otherSprite)
        otherSprite.destroy()
        return
    }
})
function roombaExplodeAnimation(sprite: Sprite){
    let effectsSprite: Sprite = sprites.create(img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `, SpriteKind.Food)
    effectsSprite.setPosition(sprite.x, sprite.y)
    animation.runImageAnimation(effectsSprite, [
        img`
                . . . . . . . . b b . . . . . .
                . . . . . . . b 9 1 b . . . . .
                . . b b . . . b 9 9 b . . . . .
                . b 9 1 b . . b b b . . b b b .
                . b 3 9 b . b b b b . b 9 9 1 b
                . b b b b b 9 9 1 1 b b 3 9 9 b
                . . . . b 9 d 9 1 1 b b b b b .
                . . . . b 5 3 9 9 9 b . . . . .
                . . b b b 5 3 3 d 9 b . . . . .
                . b 5 1 b b 5 5 9 b b b b . . .
                . b 5 5 b b b b b b 3 9 9 3 . .
                . b b b b b b b . b 9 1 1 9 b .
                . . . b 5 5 1 b . b 9 1 1 9 b .
                . . . b 5 5 5 b . b 3 9 9 3 b .
                . . . . b b b . . . b b b b . .
                . . . . . . . . . . . . . . . .
            `,
        img`
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . b b . . . . .
                . . . . . . . . b 9 1 b . . . .
                . . . b b b b b b 9 9 b . . . .
                . . b 9 9 d 9 9 1 1 d b b b b .
                . . . b d 9 9 9 1 1 9 9 d 9 1 b
                . . b 9 d 9 9 9 9 9 9 9 d 9 9 b
                . . b 9 3 3 9 9 9 9 9 d b b b .
                . b 5 d 9 3 3 3 d d b b b b . .
                b 5 5 5 b b b b b b b 9 9 1 b .
                b 5 5 b . . . . . . b 3 9 9 b .
                . b b . . . . . . . . b b b . .
            `,
        img`
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . 1 1 1 . . .
                . . . 1 1 . . . . . 1 1 1 . . .
                . . . 1 1 . . 1 1 . 1 1 1 . . .
                . . . . . . . 1 1 . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . 1 . . . .
                . . . . 1 . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
            `,
    ], 75, false)
    effectsSprite.lifespan = 226
}
function slimeExplodeAnimation(sprite: Sprite){
    let effectsSprite: Sprite = sprites.create(img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `, SpriteKind.Food)
    effectsSprite.setPosition(sprite.x, sprite.y)
    animation.runImageAnimation(effectsSprite, [
        img`
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . 3 3 3 3 3 3 . . . . .
                . . . 3 3 3 5 3 3 5 3 3 3 . . .
                . . 3 3 3 3 3 3 3 3 3 3 3 3 . .
                . . . 3 3 3 3 3 3 3 3 3 3 . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
            `,
        img`
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . 3 . .
                . . . . . f . . 3 . . . . . . .
                . . 3 3 . . . . . . 3 . . . . .
                . . . 3 . . . . . . . . . . f .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                3 3 . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . 3 . . 3 3 . 3 . . . . . . .
                . 3 3 . . . 3 . . . 3 . . . 3 .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
            `,
        img`
                . . . . . . . . . 3 . . . . . .
                . . . . . f . . . . . 3 . . . .
                . 3 3 . . . . . . . . . . . . f
                . . 3 . . . . . . . . . . 3 . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                3 . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . .
                . 3 . . . 3 3 . . . . . . . 3 .
                3 3 . . . . 3 . . 3 . 3 . . . .
                . . . . . . . . . . . . . . . .
            `,
    ], 75, false)
    effectsSprite.lifespan = 226
}

let targetSprite: Sprite = null
let enemyAmount = 0
let speed = 0
let playerSprite: Sprite = null

let roombaAmount = 0
let isDashing = false
let currentControlledEntity: Sprite = null

class Enemy {
    health: number
    spriteImage: Image[]
    attackPower: number
    kind: number

    constructor(health: number, spriteImage: Image[], attackPower: number, kind: number){
        this.health = health
        this.spriteImage = spriteImage
        this.attackPower = attackPower
        this.kind = kind
    }

    addSpriteImage(image: Image){
        this.spriteImage.push(image)
    }
    createSprite(){
        return sprites.create(this.spriteImage[0], this.kind)
    }

}
let enemyObjects = [new Enemy(2, [assets.image`slime`], 5, SpriteKind.Enemy)]
// The entry-point to my game
onStart()

function generateTileMapExcavator(){
    for(let i = 0; i < 1; i++){
        createExcavator(tiles.getRandomTileByType(assets.tile`floorTile`))
    }
}

function createExcavator(tileLocation: tiles.Location) {
    let excavatorSprite: Sprite = sprites.create(img`
        ................................
        ................................
        ................................
        .......ada............ada.......
        .......bba..99999999..abb.......
        .......ada.8999999998.ada.......
        .......ad98999999999989da.......
        .......bb99999999999999bb.......
        .......ad99999899899999da.......
        .......ad99999988999999da.......
        .......bb99999899899999bb.......
        .......ad99999999999999da.......
        .......ad99999999999999da.......
        .......bb99999999339999bb.......
        .......ad999cccc9339999da.......
        .......ad989cccc9999989da.......
        .......bb988cccc9999889bb.......
        .......ada99cccc999999ada.......
        .......ada..cccc......ada.......
        .......bbb...cc.......bbb.......
        .......ada...cc.......ada.......
        .......ada...cc.......ada.......
        .............cc.................
        .............cc.................
        .............cc.................
        .............cc.................
        ..........2.2cc2.2..............
        ..........222cc222..............
        ..........222cc222..............
        ..........22222222..............
        ................................
        ................................
    `, SpriteKind.Excavator)
    tiles.placeOnTile(excavatorSprite, tileLocation)
}

function generateTileMapRoomba() {
    roombaAmount = randint(1, 15)
    for (let i = 0; i <= roombaAmount; i++) {
        createRoomba(tiles.getRandomTileByType(assets.tile`floorTile`))
    }
}
function createRoomba(tileLocation: tiles.Location) {
    let roombaSprite: Sprite = sprites.create(assets.image`roomba`, SpriteKind.Roomba)
    tiles.placeOnTile(roombaSprite, tileLocation)
    setRandomVelocity(roombaSprite, 15, randint(-1, 1), randint(-1, 1))
    roombaSprite.z = 15
}
function createRandomEnemy(tileLocation: tiles.Location){

    let enemySprite: Sprite = enemyObjects._pickRandom().createSprite()
    tiles.placeOnTile(enemySprite, tileLocation)
}
// Game-Updates
game.onUpdate(function () {
    let nearestEntity = spriteutils.getSpritesWithin(SpriteKind.Roomba, 40, playerSprite)
        .concat(spriteutils.getSpritesWithin(SpriteKind.Excavator, 40, playerSprite))
    targetSprite.setFlag(SpriteFlag.Invisible, true)
    if (nearestEntity.length > 0 && !(currentControlledEntity)) {
        targetSprite.setFlag(SpriteFlag.Invisible, false)
        targetSprite.setPosition(nearestEntity[0].x, nearestEntity[0].y - 10)
        targetSprite.z = 100
    }
    for (let roomba of sprites.allOfKind(SpriteKind.Roomba)) {
        if (roomba.isHittingTile(CollisionDirection.Left)) {
            setRandomVelocity(roomba, 15, 1, randint(-1, 1))
        }
        if (roomba.isHittingTile(CollisionDirection.Right)) {
            setRandomVelocity(roomba, 15, -1, randint(-1, 1))
        }
        if (roomba.isHittingTile(CollisionDirection.Top)) {
            setRandomVelocity(roomba, 15, randint(-1, 1), 1)
        }
        if (roomba.isHittingTile(CollisionDirection.Bottom)) {
            setRandomVelocity(roomba, 15, randint(-1, 1), -1)
        }
    }
})
