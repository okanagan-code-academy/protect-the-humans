class Enemy {
    health: number
    spriteImage: Image[]
    attackPower: number
    kind: number

    constructor(health: number, spriteImage: Image[], attackPower: number, kind: number) {
        this.health = health
        this.spriteImage = spriteImage
        this.attackPower = attackPower
        this.kind = kind
    }

    addSpriteImage(image: Image) {
        this.spriteImage.push(image)
    }
    createSprite() {
        let enemySprite = sprites.create(this.spriteImage[0], this.kind)
        sprites.setDataNumber(enemySprite, "health", this.health)
        sprites.setDataNumber(enemySprite, "attackPower", this.attackPower)
        return enemySprite
    }
}

class Entity {
    speed: number
    health: number
    spriteImage: Image
    attackPower: number
    tileImage: Image
    kind: number
    spriteAnimation: Image[][] = null

    constructor(speed: number, health: number, spriteImage: Image, attackPower: number, tileImage: Image, kind: number) {
        this.speed = speed
        this.health = health
        this.spriteImage = spriteImage
        this.attackPower = attackPower
        this.tileImage = tileImage
        this.kind = kind
    }

    createSprite() {
        let entitySprite = sprites.create(this.spriteImage, this.kind)
        sprites.setDataNumber(entitySprite, "speed", this.speed)
        sprites.setDataNumber(entitySprite, "health", this.health)
        sprites.setDataNumber(entitySprite, "attackPower", this.attackPower)
        sprites.setDataImage(entitySprite, "tileImage", this.tileImage)
        setRandomVelocity(entitySprite, this.speed, randint(-1, 1), randint(-1, 1))

        // if(this.spriteAnimation){
        //     characterAnimations.loopFrames(
        //         entitySprite,
        //         this.spriteAnimation[0],
        //         1,
        //         Predicate.FacingLeft
        //     )
        //     characterAnimations.loopFrames(
        //         entitySprite,
        //         this.spriteAnimation[1],
        //         1,
        //         Predicate.FacingUp
        //     )
        //     characterAnimations.loopFrames(
        //         entitySprite,
        //         this.spriteAnimation[2],
        //         1,
        //         Predicate.FacingRight
        //     )
        //     characterAnimations.loopFrames(
        //         entitySprite,
        //         this.spriteAnimation[3],
        //         1,
        //         Predicate.FacingDown
        //     )
        // }

        return entitySprite
    }
    // animation order will be direction left, up, right, down
    addAnimation(animation: Image[][]) {
        this.spriteAnimation = animation

    }
}