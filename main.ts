namespace SpriteKind {
    export const Roomba = SpriteKind.create()
    export const Target = SpriteKind.create()
}
/*
- Create the player (cyborg) in the top down view
- Make the player move
- Create the tilemap
- Create the tilemap assets

*/

let playerSprite: Sprite = null
let targetSprite: Sprite = null
let currentControlledEntity: Sprite = null



function setTileMap() {
    tiles.setTilemap(tilemap`test`)
}

function onStart() {
    setTileMap()
    generateTileMapPlayer()
    generateTileMapRoomba()
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
}
function createTargettingIndicatorSprite() {
    targetSprite = sprites.create(assets.image`target`, SpriteKind.Target)
}
function generateTileMapRoomba() {
    let roombaAmount: number = randint(1, 4)
    for (let i = 0; i <= roombaAmount; i++) {
        createRoomba(tiles.getRandomTileByType(assets.tile`floorTile`))
    }
}
function createRoomba(tileLocation: tiles.Location) {
    let roombaSprite: Sprite = sprites.create(assets.image`roomba`, SpriteKind.Roomba)
    tiles.placeOnTile(roombaSprite, tileLocation)
    setRandomVelocity(roombaSprite, 15, randint(-1, 1), randint(-1, 1))
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
        info.startCountdown(5)
        scene.cameraFollowSprite(nearestEntity[0])
        controller.moveSprite(playerSprite, 0, 0)
        controller.moveSprite(nearestEntity[0])
        currentControlledEntity = nearestEntity[0]
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!currentControlledEntity) {
        return
    }
    let directionX: number = Math.sign(currentControlledEntity.vx)
    let directionY: number = Math.sign(currentControlledEntity.vy)

    currentControlledEntity.sayText(directionX.toString() + directionY.toString(), 500)


})
info.onCountdownEnd(function () {
    controller.moveSprite(playerSprite)
    scene.cameraFollowSprite(playerSprite)
    controller.moveSprite(currentControlledEntity, 0, 0)
    setRandomVelocity(currentControlledEntity, 15, randint(-1, 1), randint(-1, 1))
    currentControlledEntity = null
})


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


