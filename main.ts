namespace SpriteKind {
    export const Roomba = SpriteKind.create()
}
/*
- Create the player (cyborg) in the top down view
- Make the player move
- Create the tilemap
- Create the tilemap assets

*/

let playerSprite: Sprite = null


function setTileMap(){
    tiles.setTilemap(tilemap`test`)
}

function onStart(){
    setTileMap()
    generateTileMapPlayer()
    generateTileMapRoomba()
}

// The entry-point to my game
onStart()

// creating sprites on tilemap
function generateTileMapPlayer(){
    createPlayer()
    tiles.placeOnTile(playerSprite, tiles.getTileLocation(8, 8))
}
function createPlayer() {
    playerSprite = sprites.create(assets.image`player`, SpriteKind.Player)
    controller.moveSprite(playerSprite)

    scene.cameraFollowSprite(playerSprite)
}
function generateTileMapRoomba(){
    let roombaAmount: number = randint(1, 4)
    for(let i = 0; i <= roombaAmount; i++) {
        createRoomba(tiles.getRandomTileByType(assets.tile`floorTile`))
    }
}
function createRoomba(tileLocation: tiles.Location){
    let roombaSprite: Sprite = sprites.create(assets.image`roomba`, SpriteKind.Roomba)
    tiles.placeOnTile(roombaSprite, tileLocation)
    setRandomVelocity(roombaSprite, 15, randint(-1, 1), randint(-1, 1))
}
function setRandomVelocity(sprite: Sprite, maxSpeed: number, directionX: number, directionY: number){
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

controller.A.onEvent(ControllerButtonEvent.Pressed, function(){
    let nearestEntity: Sprite[] = spriteutils.getSpritesWithin(SpriteKind.Roomba, 40, playerSprite)
    if(nearestEntity.length > 0){
        info.startCountdown(5)
        scene.cameraFollowSprite(nearestEntity[0])
        controller.moveSprite(playerSprite, 0, 0)
        controller.moveSprite(nearestEntity[0])
    }
})

info.onCountdownEnd(function(){
    controller.moveSprite(playerSprite)
    scene.cameraFollowSprite(playerSprite)
})


// Game-Updates
game.onUpdate(function(){
    for(let roomba of sprites.allOfKind(SpriteKind.Roomba)){
        if(roomba.isHittingTile(CollisionDirection.Left)){
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
