namespace SpriteKind {
    export const Roomba = SpriteKind.create()
    export const Target = SpriteKind.create()
    export const Excavator = SpriteKind.create()
    export const Shovel = SpriteKind.create()
}
namespace userconfig {
    export const ARCADE_SCREEN_WIDTH = 160
    export const ARCADE_SCREEN_HEIGHT = 120
}

namespace OverlapEvents {
    sprites.onOverlap(SpriteKind.Roomba, SpriteKind.Enemy, function (sprite: Sprite, otherSprite: Sprite) {
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
    
    sprites.onOverlap(SpriteKind.Shovel, SpriteKind.Enemy, function(sprite: Sprite, otherSprite: Sprite) {
        slimeExplodeAnimation(otherSprite)
        otherSprite.destroy()
    })
    sprites.onOverlap(SpriteKind.Excavator, SpriteKind.Enemy, function (sprite: Sprite, otherSprite: Sprite) {
        slimeExplodeAnimation(otherSprite)
        otherSprite.destroy()
    })
}




let targetSprite: Sprite = null
let speed = 0
let playerSprite: Sprite = null
let isDashing = false
let currentControlledEntity: Sprite = null
let currentAngle: number = 0


// set tile map
function setTileMap() {
    tiles.setTilemap(tilemap`test`)
}
// creating sprites on tilemap
function generateTileMapPlayer() {
    createPlayer()
    tiles.placeOnTile(playerSprite, tiles.getTileLocation(8, 8))
}
function generateTileMapSlime () {
    let enemyAmount = randint(1, 10)
    for (let j = 0; j <= enemyAmount; j++) {
        createRandomEnemy(tiles.getRandomTileByType(assets.tile`floorTile`))
    }
}
function generateTileMapExcavator() {
    for (let i = 0; i < 1; i++) {
        createExcavator(tiles.getRandomTileByType(assets.tile`floorTile`))
    }
}

function createExcavator(tileLocation: tiles.Location) {
    let excavatorSprite: Sprite = sprites.create(assets.image`excavator`, SpriteKind.Excavator)

    tiles.placeOnTile(excavatorSprite, tileLocation)
}

function generateTileMapRoomba() {
    let roombaAmount = randint(1, 15)
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
function createRandomEnemy(tileLocation: tiles.Location) {
    let enemySprite: Sprite = enemyObjects._pickRandom().createSprite()
    tiles.placeOnTile(enemySprite, tileLocation)
}

forever(function(){
    if(!currentControlledEntity){
        return
    }
    if (currentControlledEntity.kind() != SpriteKind.Excavator) {
        return    
    }

    controller.moveSprite(currentControlledEntity, 0, 0)
    currentControlledEntity.setImage(assets.image`excavator`)
    if(controller.left.isPressed()){
        currentAngle -= 5 * control.eventContext().deltaTime
    } else if(controller.right.isPressed()){
        currentAngle += 5 * control.eventContext().deltaTime
    }
    rotsprite.rotSprite(currentControlledEntity, currentAngle)

    if(controller.up.isPressed()){
        spriteutils.setVelocityAtAngle(currentControlledEntity, currentAngle - Math.PI/2, -50)
    } else if(controller.down.isPressed()){
        spriteutils.setVelocityAtAngle(currentControlledEntity, currentAngle - Math.PI/2, 50)
    } else {
        currentControlledEntity.setVelocity(0,0)
    }
})


controller.left.onEvent(ControllerButtonEvent.Repeated, function(){
    if(!currentControlledEntity){
        return
    }
    if(currentControlledEntity.kind() == SpriteKind.Excavator){
        transformSprites.changeRotation(currentControlledEntity, 5)
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function(){
    if (!currentControlledEntity) {
        return
    }
})

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(currentControlledEntity)) {
        return
    }
    if(currentControlledEntity.kind() == SpriteKind.Excavator){
        let frameInterval: number = 50
        let attackSprite: Sprite = sprites.readDataSprite(currentControlledEntity, "attackSprite")

        // if(characterAnimations.matchesRule(currentControlledEntity, Predicate.FacingLeft)){
        //     animation.runImageAnimation(attackSprite, SpriteSheet.excavatorAttackAnimation[0], frameInterval, false)
        // } else if (characterAnimations.matchesRule(currentControlledEntity, Predicate.FacingUp)){
        //     animation.runImageAnimation(attackSprite, SpriteSheet.excavatorAttackAnimation[1], frameInterval, false)
        // } else if (characterAnimations.matchesRule(currentControlledEntity, Predicate.FacingRight)) {
        //     animation.runImageAnimation(attackSprite, SpriteSheet.excavatorAttackAnimation[2], frameInterval, false)
        // } else if (characterAnimations.matchesRule(currentControlledEntity, Predicate.FacingDown)) {
        //     animation.runImageAnimation(attackSprite, SpriteSheet.excavatorAttackAnimation[3], frameInterval, false)
        // }

        runAnimation(attackSprite, SpriteSheet.excavatorAttackAnimation[2])

        timer.after(frameInterval*SpriteSheet.excavatorAttackAnimation[0].length + 1, function(){
            attackSprite.setImage(img`
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
                ................................
            `)
        })
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

function runAnimation(sprite: Sprite, animation: Image[]) : void{
    let frameInterval = 50

    for(let image of animation){
        sprite.setImage(image)
        rotsprite.rotSprite(sprite, currentAngle + Math.PI/2)
        pause(frameInterval)
    }
}


// Keyboard Input
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    let nearestEntity = spriteutils.getSpritesWithin(SpriteKind.Roomba, 40, playerSprite).concat(spriteutils.getSpritesWithin(SpriteKind.Excavator, 40, playerSprite))
    if (nearestEntity.length > 0 && !(currentControlledEntity)) {
        info.startCountdown(10)
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

info.onCountdownEnd(function () {
    resetControlAbility()
})


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
    setRandomVelocity(currentControlledEntity, sprites.readDataNumber(currentControlledEntity, "speed"), randint(-1, 1), randint(-1, 1))
    currentControlledEntity = null
}
// Events

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
    animation.runImageAnimation(effectsSprite, SpriteSheet.roombaExplosionAnimation, 75, false)
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
    animation.runImageAnimation(effectsSprite, SpriteSheet.slimeExplosionAnimation, 75, false)
    effectsSprite.lifespan = 226
}

// Classes


let enemyObjects: Enemy[] = [
    new Enemy(2, [assets.image`slime`], 5, SpriteKind.Enemy),
]
let entityObjects: Entity[] = [
    new Entity(20, 1, assets.image`roomba`, 1, assets.tile`floorTile`, SpriteKind.Roomba),
    new Entity(0, 5, assets.image`excavator`, 500, assets.tile`floorTile`, SpriteKind.Excavator)
]

// Excavator animations
entityObjects[1].addAnimation([
    [
        assets.image`excavatorLeft`
    ],
    [
        assets.image`excavatorUp`
    ],
    [
        assets.image`excavatorRight`
    ],
    [
        assets.image`excavatorDown`
    ]
])


function onStart() {
    setTileMap()
    generateTileMapPlayer()
    // generateTileMapRoomba()
    generateTileMapSlime()
    generateTileMapEntity()
    // generateTileMapExcavator()
    createTargettingIndicatorSprite()
}

function generateTileMapEntity() {
    let roombaAmount = randint(1, 10)
    let excavatorAmount = randint(1, 2)

    for (let i = 0; i <= roombaAmount; i++) {
        let roomba: Sprite = entityObjects[0].createSprite()
        tiles.placeOnRandomTile(roomba, entityObjects[0].tileImage)
    }
    for (let i = 0; i <= excavatorAmount; i++) {
        let excavator: Sprite = entityObjects[1].createSprite()
        createAttackSprite(excavator)
        tiles.placeOnRandomTile(excavator, entityObjects[1].tileImage)
    }
}

function createAttackSprite(sprite: Sprite){
    let attackSprite: Sprite = sprites.create(img`
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
        `, SpriteKind.Shovel)
    sprites.setDataSprite(sprite, "attackSprite", attackSprite)
    game.forever(function(){
        attackSprite.setPosition(sprite.x, sprite.y)
    })
}

// ============ Start of Program ===========


// The entry-point to my game
onStart()


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
