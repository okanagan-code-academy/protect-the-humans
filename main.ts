/*
- Create the player (cyborg) in the top down view
- Make the player move
- Create the tilemap
- Create the tilemap assets

*/

let playerSprite: Sprite = null

function createPlayer(){
    playerSprite = sprites.create(assets.image`player`, SpriteKind.Player)
    controller.moveSprite(playerSprite)
    tiles.placeOnTile(playerSprite, tiles.getTileLocation(8, 8))
    scene.cameraFollowSprite(playerSprite)
}

function setTileMap(){
    tiles.setTilemap(tilemap`test`)
}

function onStart(){
    setTileMap()
    createPlayer()
}


// The entry-point
onStart()