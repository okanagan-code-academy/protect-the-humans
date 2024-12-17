namespace SpriteKind {
    export const Roomba = SpriteKind.create()
    export const Target = SpriteKind.create()
}

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

let enemyObjects: Enemy[] = [
    new Enemy(2, [assets.image`slime`], 5, SpriteKind.Enemy)
]

let playerSprite: Sprite = null
let targetSprite: Sprite = null
let currentControlledEntity: Sprite = null
let isDashing: boolean = false


function setTileMap() {
    tiles.setTilemap(tilemap`test`)
}

function onStart() {
    setTileMap()
    generateTileMapPlayer()
    generateTileMapRoomba()
    generateTileMapSlime()
    createTargettingIndicatorSprite()
}

// The entry-point to my game
onStart()

// creating sprites on tilemap
function generateTileMapPlayer() {
    createPlayer()
    tiles.placeOnTile(playerSprite, tiles.getTileLocation(8, 8))
}
function createPlayer() {
    playerSprite = sprites.create(assets.image`player`, SpriteKind.Player)
    controller.moveSprite(playerSprite)
    scene.cameraFollowSprite(playerSprite)
    playerSprite.z = 1000
}
function createTargettingIndicatorSprite() {
    targetSprite = sprites.create(assets.image`target`, SpriteKind.Target)
}
function generateTileMapRoomba() {
    let roombaAmount: number = randint(1, 15)
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

function generateTileMapSlime(){
    let enemyAmount: number = randint(1, 10)
    for(let i = 0; i <= enemyAmount; i++){
        createRandomEnemy(tiles.getRandomTileByType(assets.tile`floorTile`))
    }
}
function createRandomEnemy(tileLocation: tiles.Location){

    let enemySprite: Sprite = enemyObjects._pickRandom().createSprite()
    tiles.placeOnTile(enemySprite, tileLocation)
}

function setRandomVelocity(sprite: Sprite, maxSpeed: number, directionX: number, directionY: number) {
    let speed: number = maxSpeed

    if (Math.random() <= 0.5) {
        directionX = -1
    }
    if (Math.random() <= 0.5) {
        directionY = -1
    }
    sprite.setVelocity(directionX * speed, directionY * speed)
}

// Keyboard Input

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    let nearestEntity: Sprite[] = spriteutils.getSpritesWithin(SpriteKind.Roomba, 40, playerSprite)
    if (nearestEntity.length > 0 && !currentControlledEntity) {
        info.startCountdown(50)
        scene.cameraFollowSprite(nearestEntity[0])
        controller.moveSprite(playerSprite, 0, 0)
        controller.moveSprite(nearestEntity[0], 50, 50)
        currentControlledEntity = nearestEntity[0]
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!currentControlledEntity) {
        return
    }
    let directionX: number = Math.sign(currentControlledEntity.vx)
    let directionY: number = Math.sign(currentControlledEntity.vy)

    /*
    - Figure out direction to dash
    - Start the dash and not anything else
        - Once the dash starts we can not cancel it
    - Continue moving on once dash is done

    */
    isDashing = true
    controller.moveSprite(currentControlledEntity, 0, 0)

    timer.after(50, function(){
        // could cause crash if Countdown timer ends before this
        if(!currentControlledEntity){
            return
        }
        spriteutils.moveTo(
            currentControlledEntity, 
            spriteutils.pos(
                currentControlledEntity.x + 50*directionX, 
                currentControlledEntity.y + 50*directionY),
            250
            )
            timer.after(250, function(){
                if(currentControlledEntity){
                    controller.moveSprite(currentControlledEntity, 50, 50)
                }
                isDashing = false
            })
    })


})
info.onCountdownEnd(function () {
    resetControlAbility()
})
function resetControlAbility(){
    info.stopCountdown()
    controller.moveSprite(playerSprite)
    scene.cameraFollowSprite(playerSprite)
    controller.moveSprite(currentControlledEntity, 0, 0)
    setRandomVelocity(currentControlledEntity, 15, randint(-1, 1), randint(-1, 1))
    currentControlledEntity = null
}


// Game-Updates
game.onUpdate(function () {
    let nearestEntity = spriteutils.getSpritesWithin(SpriteKind.Roomba, 40, playerSprite)
    targetSprite.setFlag(SpriteFlag.Invisible, true)
    if (nearestEntity.length > 0 && !currentControlledEntity) {
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

// Events
sprites.onOverlap(SpriteKind.Roomba, SpriteKind.Enemy, function(sprite: Sprite, otherSprite: Sprite){
    if(currentControlledEntity == null){
        sprite.destroy()
        return
    }

    if(!isDashing){
        if (sprite.id == currentControlledEntity.id) {
            resetControlAbility()
        }
        sprite.destroy()
        return
    }

    if(sprite.id == currentControlledEntity.id){
        otherSprite.destroy()
        return
    }
    // sprite.destroy()

    
}) 

