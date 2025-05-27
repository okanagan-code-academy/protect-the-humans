namespace SpriteKind {
    export const Roomba = SpriteKind.create()
    export const Target = SpriteKind.create()
    export const Excavator = SpriteKind.create()
    export const Shovel = SpriteKind.create()
    export const Human = SpriteKind.create()
    export const Scooper = SpriteKind.create()
    export const Cursor = SpriteKind.create()
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
            if(sprites.readDataString(otherSprite, "type") == "zombie"){
                resetControlAbility()
                scene.cameraShake(25, 200)
                roombaExplodeAnimation(sprite)
                sprite.destroy()
                return
            }
            slimeExplodeAnimation(otherSprite)
            otherSprite.destroy()
            return
        }
    })
    
    sprites.onOverlap(SpriteKind.Shovel, SpriteKind.Enemy, function(sprite: Sprite, otherSprite: Sprite) {
        otherSprite.destroy()
        if(sprites.readDataString(otherSprite, "type") == "zombie"){
            zombieExplodeAnimation(otherSprite)
        } else {
            slimeExplodeAnimation(otherSprite)
        }
        
    })
    sprites.onOverlap(SpriteKind.Excavator, SpriteKind.Enemy, function (sprite: Sprite, otherSprite: Sprite) {
        if(!currentControlledEntity){
            return
        }
        if (sprites.readDataString(otherSprite, "type") == "zombie"){
            zombieExplodeAnimation(otherSprite)
        } else {
            slimeExplodeAnimation(otherSprite)
        }
        otherSprite.destroy()
    })
    sprites.onOverlap(SpriteKind.Human, SpriteKind.Enemy, function(sprite: Sprite, otherSprite: Sprite){
        let humanHealth: number = sprites.readDataNumber(sprite, "health")
        let enemyDamage: number = sprites.readDataNumber(otherSprite, "attackPower")

        humanHealth = humanHealth - enemyDamage
        if(humanHealth <= 0){
            sprite.destroy()
            return
        }
        sprites.setDataNumber(sprite, "health", humanHealth)
        sprite.sayText(humanHealth)
        
        if(sprites.readDataString(otherSprite, "type") == "zombie") {
            sprites.setDataBoolean(sprite, "beingChased", true)
            sprites.setDataSprite(otherSprite, "target", sprite)
        }

        pause(1000)
    })
    sprites.onOverlap(SpriteKind.Human, SpriteKind.Player, function(sprite: Sprite, otherSprite: Sprite){
        sprite.destroy()
        humansRescued += 1
    })
    sprites.onOverlap(SpriteKind.Player, SpriteKind.Scooper, function(sprite: Sprite, otherSprite: Sprite){
        if(humansRescued <= 0 ){
            return
        }
        otherSprite.setFlag(SpriteFlag.Ghost, true)
        let maxHumans: number = humansRescued
        humansRescued = 0

        for(let i = 0; i < maxHumans; i++){
            let tempHuman: Sprite = sprites.create(SpriteSheet.human, SpriteKind.Food)
            tempHuman.setPosition(otherSprite.x, otherSprite.y - 30)
            tempHuman.ay = 300
            tempHuman.lifespan = 500
            pause(300)
            animation.runImageAnimation(otherSprite, SpriteSheet.scooperSpriteAnimation, 50, false)
            scene.cameraShake(8, 500)
            for(let num = 0; num < randint(10, 15); num++){
                let bitSprite: Sprite = sprites.create(SpriteSheet.humanBits._pickRandom(), SpriteKind.Food)
                bitSprite.scale = randint(0.5, 1.5)
                bitSprite.lifespan = randint(1000, 2000)
                bitSprite.setPosition(otherSprite.x, otherSprite.y)
                bitSprite.setVelocity(randint(-100, 100), randint(-100, 100))
            }
            pause(500)
        }
        otherSprite.setFlag(SpriteFlag.Ghost, false)
    })

    sprites.onOverlap(SpriteKind.Cursor, SpriteKind.Roomba, function(sprite: Sprite, otherSprite: Sprite){
        if(currentControlledEntity){
            return
        }
        if(browserEvents.MouseLeft.isPressed()){
            info.startCountdown(10)
            scene.cameraFollowSprite(otherSprite)
            controller.moveSprite(playerSprite, 0, 0)
            controller.moveSprite(otherSprite, 50, 50)
            currentControlledEntity = otherSprite
        }
    })
    sprites.onOverlap(SpriteKind.Cursor, SpriteKind.Excavator, function (sprite: Sprite, otherSprite: Sprite) {
        if (currentControlledEntity) {
            return
        }
        if (browserEvents.MouseLeft.isPressed()) {
            info.startCountdown(10)
            scene.cameraFollowSprite(otherSprite)
            controller.moveSprite(playerSprite, 0, 0)
            controller.moveSprite(otherSprite, 50, 50)
            currentControlledEntity = otherSprite
        }
    })
}



let targetSprite: Sprite = null
let cursorSprite: Sprite = null
let playerSprite: Sprite = null
let humansRescued: number = null
let isDashing = false
let currentControlledEntity: Sprite = null
let currentAngle: number = 0
let allTileMaps: tiles.TileMapData[] = [
    tilemap`test`,
    tilemap`level1`,
    tilemap`level2`,
    ]


// set tile map
function setTileMap() {
    scene.setBackgroundColor(15)
    tiles.setTilemap(allTileMaps[1])
    for(let location of tiles.getTilesByType(assets.tile`scooperSpawn`)){
        let scooperSprite: Sprite = sprites.create(SpriteSheet.scooperSprite, SpriteKind.Scooper)
        tiles.placeOnTile(scooperSprite, location)
        tiles.setTileAt(location, assets.tile`floorTile`)
    }
}
// creating sprites on tilemap
function generateTileMapPlayer() {
    createPlayer()
    tiles.placeOnTile(playerSprite, tiles.getTileLocation(8, 8))
}
function generateTileMapEnemy () {
    let enemyAmount = randint(1, 10)
    for (let j = 0; j <= enemyAmount; j++) {
        createRandomEnemy(tiles.getRandomTileByType(assets.tile`floorTile`))
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


controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(currentControlledEntity)) {
        return
    }
    if(currentControlledEntity.kind() == SpriteKind.Excavator){
        let frameInterval: number = 50
        let attackSprite: Sprite = sprites.readDataSprite(currentControlledEntity, "attackSprite")
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
    if(currentControlledEntity){
        resetControlAbility()
        info.stopCountdown()
        return
    }
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
    let speed: number = maxSpeed
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
    playerSprite = sprites.create(SpriteSheet.cyborg, SpriteKind.Player)
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
    animation.runImageAnimation(
        effectsSprite, 
        SpriteSheet.roombaExplosionAnimation, 
        75, 
        false
        )
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
function zombieExplodeAnimation(sprite: Sprite){
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
    animation.runImageAnimation(effectsSprite, SpriteSheet.zombieExplodeAnimation, 75, false)
    effectsSprite.lifespan = 226
}
// Classes


let enemyObjects: Enemy[] = [
    new Enemy(2, [assets.image`slime`], 5, SpriteKind.Enemy),
    new Enemy(50, [SpriteSheet.zombie], 10, SpriteKind.Enemy),
    new Enemy(500, [SpriteSheet.largeEnemy], 5000, SpriteKind.Enemy)
]

enemyObjects[0].setSpriteType("slime")
enemyObjects[1].setSpriteType("zombie")

let entityObjects: Entity[] = [
    new Entity(20, 1, assets.image`roomba`, 1, assets.tile`floorTile`, SpriteKind.Roomba),
    new Entity(0, 5, assets.image`excavator`, 500, assets.tile`floorTile`, SpriteKind.Excavator)
]
let humanObject: Human[] = [
    new Human(10, 100, SpriteKind.Human, SpriteSheet.human)
]

function onStart() {
    setTileMap()
    generateTileMapPlayer()
    generateTileMapEnemy()
    generateTileMapEntity()
    generateTileMapHuman()
    createTargettingIndicatorSprite()
    createCursorEntity()
    
}
function createCursorEntity(){
    cursorSprite = sprites.create(assets.image`cursor`, SpriteKind.Cursor)
    game.onUpdate(function(){
        cursorSprite.setPosition(browserEvents.mouseX() + scene.cameraProperty(CameraProperty.Left), browserEvents.mouseY() + scene.cameraProperty(CameraProperty.Top))
    })
}

function generateTileMapHuman(){
    let humanAmount = randint(1, 5)

    for(let i = 0; i <= humanAmount; i++){
        let humanSprite: Sprite = humanObject[0].createSprite()
        tiles.placeOnRandomTile(humanSprite, entityObjects[0].tileImage)
    }
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
    // let nearestEntity = spriteutils.getSpritesWithin(SpriteKind.Roomba, 40, playerSprite)
    //     .concat(spriteutils.getSpritesWithin(SpriteKind.Excavator, 40, playerSprite))
    // targetSprite.setFlag(SpriteFlag.Invisible, true)
    // if (nearestEntity.length > 0 && !(currentControlledEntity)) {
    //     targetSprite.setFlag(SpriteFlag.Invisible, false)
    //     targetSprite.setPosition(nearestEntity[0].x, nearestEntity[0].y - 10)
    //     targetSprite.z = 100
    // }
    
    targetSprite.setFlag(SpriteFlag.Invisible, true)
    for(let sprite of sprites.allOfKind(SpriteKind.Roomba).concat(sprites.allOfKind(SpriteKind.Excavator))){
        if(cursorSprite.overlapsWith(sprite)){
            targetSprite.setFlag(SpriteFlag.Invisible, false)
            targetSprite.setPosition(sprite.x, sprite.y - 10)
            targetSprite.z = 100
        }
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

// game.forever(function(){
//     for(let enemy of sprites.allOfKind(SpriteKind.Enemy)){
//         if (sprites.readDataString(enemy, "type") == "slime" || sprites.readDataString(enemy, "type") == "zombie"){
//             let randomDirection: spriteutils.Position = spriteutils.pos(Math.randomRange(-50, 50), Math.randomRange(-50, 50))
//             spriteutils.moveTo(enemy, spriteutils.pos(enemy.x + randomDirection.x, enemy.y + randomDirection.y), Math.randomRange(1000, 2000), true)
//         }
//     }
// })
// Slime Enemy Update Event
spriteutils.onSpriteKindUpdateInterval(SpriteKind.Enemy, 3000, function(sprite: Sprite){
    if (sprites.readDataString(sprite, "type") == "slime") {
        let randomDirection: spriteutils.Position = spriteutils.pos(Math.randomRange(-50, 50), Math.randomRange(-50, 50))
        spriteutils.moveTo(sprite, spriteutils.pos(sprite.x + randomDirection.x, sprite.y + randomDirection.y), Math.randomRange(1000, 2000), false)
    }
})
// Zombie Enemy Update Event
spriteutils.onSpriteKindUpdateInterval(SpriteKind.Enemy, 3000, function (sprite: Sprite) {
    if (sprites.readDataString(sprite, "type") == "zombie") {
        let nearbyHumans: Sprite[] = spriteutils.getSpritesWithin(SpriteKind.Human, 50, sprite)
        if(nearbyHumans.length > 0){
            sprite.follow(nearbyHumans[0], 75)
            sprites.setDataBoolean(nearbyHumans[0], "beingChased", true)
            sprites.setDataSprite(sprite, "target", nearbyHumans[0])
            return
        }
        let humanSprite: Sprite = sprites.readDataSprite(sprite, "target")
        if(humanSprite != null){
            sprites.setDataBoolean(humanSprite, "beingChased", false)
            humanSprite.sayText("false")
            sprites.setDataSprite(sprite, "target", null)
        }
        let randomDirection: spriteutils.Position = spriteutils.pos(Math.randomRange(-50, 50), Math.randomRange(-50, 50))
        spriteutils.moveTo(sprite, spriteutils.pos(sprite.x + randomDirection.x, sprite.y + randomDirection.y), Math.randomRange(1000, 2000), false)
    }
})
