namespace SpriteSheet {
    export const excavatorAttackAnimation: Image[][] = [
        [
            assets.image`shovelLeft0`,
            assets.image`shovelLeft1`,
            assets.image`shovelLeft2`,
            assets.image`shovelLeft3`,
        ],
        [
            assets.image`shovelUp0`,
            assets.image`shovelUp1`,
            assets.image`shovelUp2`,
            assets.image`shovelUp3`,

        ],
        [
            assets.image`shovelRight0`,
            assets.image`shovelRight1`,
            assets.image`shovelRight2`,
            assets.image`shovelRight3`,
        ],
        [
            assets.image`shovelDown0`,
            assets.image`shovelDown1`,
            assets.image`shovelDown2`,
            assets.image`shovelDown3`,
        ]
    ]
    export const roombaExplosionAnimation: Image[] = [
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
    ]
    export const slimeExplosionAnimation: Image[] = [
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
    ]
    export const zombie: Image =assets.image`zombie`
    export const zombieExplodeAnimation: Image[] = [
        img`
            ........................
            ........................
            ........................
            ........................
            ........................
            ..........ffff..........
            ........ff1111ff........
            .......fb111111bf.......
            .......f11111111f.......
            ......fd11111111df......
            ....7.fd11111111df......
            ...7..fd11111111df......
            ...7..fd11111111df......
            ...7..fddd1111dddff.....
            ...77.fbdbfddfbdbfcf....
            ...777fcdcf11fcdcfbf....
            ....77fffbdb1bdffcf.....
            ....fcb1bcffffff........
            ....f1c1c1ffffff........
            ....fdfdfdfffff.........
            .....f.f.f..............
            ........................
            ........................
            ........................
        `,
        img`
            ........................
            ............1...........
            .......f....1...........
            .....f22...11...ff......
            ...222222222222.11ff....
            ..22f11........2211bf...
            .2.fd11..........2222...
            24444441.............22.
            24...44444444444......2.
            2...5555555.111.44.1f.2.
            2..5......555....441df2.
            2.5........5.5....41df2.
            2.5..........5....41d2..
            2.5..11111...5...4.1d2..
            2.5...11.11.55...4..d2f.
            2.55....11.55...4...b2cf
            2...5555555.....4....2..
            2......11111...4....2...
            24...........444.fb.2..d
            .22444...4224111.fc22fbd
            ..f22222222221112222....
            ...f.f......2222........
            .........f...f11........
            .........fffbdb1........
        `,
        img`
            ........................
            ........................
            ........................
            ....................1...
            ...................11...
            ...................1....
            ......1.................
            ...1111.................
            ...111..................
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            ....1...............1...
            ...11...............1...
            .111................1...
            .11.................1...
            ..111...............1...
            ........................
            ........................
            ........................
        `,
    ]
    export const human: Image = assets.image`human`
    export const cyborg: Image =assets.image`cyborg`
    export const largeEnemy: Image =assets.image`largeEnemy`
    export const scooperSprite: Image =assets.image`scooper`
}