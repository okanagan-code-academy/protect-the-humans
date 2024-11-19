// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile10 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile11 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile4 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile12 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile8 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile3 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile13 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile1 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile7 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile14 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile9 = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "test":
            case "test1":return tiles.createTilemap(hex`100010000104040404040404040404040404040b0306060606060606060606060606060a0306060706060607060606060606060a0306060606060606060608060606060a0306060606060706060606070606060a0306060707060606080606060608060a0306060606060806060706080806060a0306060706060606060606060606060a0306060606060608060606060606060a0306060607060808060806080606060a0306060606060606060606060608060a0306060606060806060606080606060a0306060806060608060606060608060a0306060606060606060806060606060a0306060606060606060606060606060a02050505050505050505050505050509`, img`
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
2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
`, [myTiles.transparency16,myTiles.tile1,myTiles.tile4,myTiles.tile3,myTiles.tile7,myTiles.tile8,myTiles.tile9,myTiles.tile10,myTiles.tile11,myTiles.tile12,myTiles.tile13,myTiles.tile14], TileScale.Sixteen);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency16":return transparency16;
            case "myTile8":
            case "tile10":return tile10;
            case "myTile9":
            case "tile11":return tile11;
            case "myTile2":
            case "tile4":return tile4;
            case "myTile10":
            case "tile12":return tile12;
            case "myTile6":
            case "tile8":return tile8;
            case "myTile1":
            case "tile3":return tile3;
            case "myTile11":
            case "tile13":return tile13;
            case "myTile":
            case "tile1":return tile1;
            case "myTile5":
            case "tile7":return tile7;
            case "myTile12":
            case "tile14":return tile14;
            case "floorTile":
            case "tile9":return tile9;
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
