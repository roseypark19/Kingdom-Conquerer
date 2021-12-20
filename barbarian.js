class Barbarian {
    constructor(game, x, y, spritesheet) {
        Object.assign(this, { game, x, y, spritesheet });
        this.facing = [0, 0]; // down, up, right, left
                              // 0, 1, 0, 1 
        this.state = 0; // idle, walking, shooting, damaged, dead, battle cry, thunder strike
                        // 0, 1, 2, 3, 4, 5, 6
        this.damagedTimer = 0;
        this.deadTimer = 0;

        this.battleCryTimer = 0;
        this.battleCryCooldown = 0;

        this.thunderStrikeTimer = 0;
        this.thunderStrikeCooldown = 0;

        this.velocityConstant = 4;
        this.velocity = { x : 0, y : 0 };
        this.animations = [];
        this.updateBB();
        this.loadAnimations();
    };

    loadAnimations() {
        // for (let i = 0; i < 7; i++) { // 7 states
        //     this.animations.push([]);
            // for (let j = 0; j < 2; j++) { // 2 vertical facings
            //     this.animations[i].push([]);
            //     for (let k = 0; k < 2; k++) { // 2 horizontal facings
            //         this.animations[i][j].push([]);
            //     }
            // }  
        // }
        this.animations.push(new AnimationGroup(this.spritesheet, 0, 0, 32, 32, 16, 0.12, false, true));
        this.animations.push(new AnimationGroup(this.spritesheet, 64 * 32, 0, 32, 32, 4, 0.15, false, true));
        this.animations.push(new AnimationGroup(this.spritesheet, 80 * 32, 0, 32, 32, 6, 0.09, false, true));
        this.animations.push(new AnimationGroup(this.spritesheet, 104 * 32, 0, 32, 32, 4, 0.15, false, true));
        this.animations.push(new AnimationGroup(this.spritesheet, 120 * 32, 0, 32, 32, 20, 0.09, false, true));
        this.animations.push(new AnimationGroup(this.spritesheet, 140 * 32, 0, 32, 32, 11, 0.1, false, true));
        this.animations.push(new AnimationGroup(this.spritesheet, 184 * 32, 0, 32, 32, 17, 0.11, false, true));

        // // idle animations
        // this.animations[0][0][0] = new Animator(this.spritesheet, 0, 0, 32, 32, 16, 0.12, false, true);
        // this.animations[0][0][1] = new Animator(this.spritesheet, 16 * 32, 0, 32, 32, 16, 0.12, false, true);
        // this.animations[0][1][0] = new Animator(this.spritesheet, 32 * 32, 0, 32, 32, 16, 0.12, false, true);
        // this.animations[0][1][1] = new Animator(this.spritesheet, 48 * 32, 0, 32, 32, 16, 0.12, false, true);

        // // walking animations
        // this.animations[1][0][0] = new Animator(this.spritesheet, 64 * 32, 0, 32, 32, 4, 0.15, false, true);
        // this.animations[1][0][1] = new Animator(this.spritesheet, 68 * 32, 0, 32, 32, 4, 0.15, false, true);
        // this.animations[1][1][0] = new Animator(this.spritesheet, 72 * 32, 0, 32, 32, 4, 0.15, false, true);
        // this.animations[1][1][1] = new Animator(this.spritesheet, 76 * 32, 0, 32, 32, 4, 0.15, false, true);

        // // shooting animations
        // this.animations[2][0][0] = new Animator(this.spritesheet, 80 * 32, 0, 32, 32, 6, 0.09, false, true);
        // this.animations[2][0][1] = new Animator(this.spritesheet, 86 * 32, 0, 32, 32, 6, 0.09, false, true);
        // this.animations[2][1][0] = new Animator(this.spritesheet, 92 * 32, 0, 32, 32, 6, 0.09, false, true);
        // this.animations[2][1][1] = new Animator(this.spritesheet, 98 * 32, 0, 32, 32, 6, 0.09, false, true);

        // // damaged animations
        // this.animations[3][0][0] = new Animator(this.spritesheet, 104 * 32, 0, 32, 32, 4, 0.15, false, true);
        // this.animations[3][0][1] = new Animator(this.spritesheet, 108 * 32, 0, 32, 32, 4, 0.15, false, true);
        // this.animations[3][1][0] = new Animator(this.spritesheet, 112 * 32, 0, 32, 32, 4, 0.15, false, true);
        // this.animations[3][1][1] = new Animator(this.spritesheet, 116 * 32, 0, 32, 32, 4, 0.15, false, true);

        // // dead animation
        // this.animations[4][0][0] = new Animator(this.spritesheet, 120 * 32, 0, 32, 32, 20, 0.09, false, true);

        // // battle cry animations
        // this.animations[5][0][0] = new Animator(this.spritesheet, 140 * 32, 0, 32, 32, 11, 0.09, false, true);
        // this.animations[5][0][1] = new Animator(this.spritesheet, 151 * 32, 0, 32, 32, 11, 0.09, false, true);
        // this.animations[5][1][0] = new Animator(this.spritesheet, 162 * 32, 0, 32, 32, 11, 0.09, false, true);
        // this.animations[5][1][1] = new Animator(this.spritesheet, 173 * 32, 0, 32, 32, 11, 0.09, false, true);

        // // thunder strike cry animations
        // this.animations[6][0][0] = new Animator(this.spritesheet, 184 * 32, 0, 32, 32, 17, 0.09, false, true);
        // this.animations[6][0][1] = new Animator(this.spritesheet, 201 * 32, 0, 32, 32, 17, 0.09, false, true);
        // this.animations[6][1][0] = new Animator(this.spritesheet, 218 * 32, 0, 32, 32, 17, 0.09, false, true);
        // this.animations[6][1][1] = new Animator(this.spritesheet, 235 * 32, 0, 32, 32, 17, 0.09, false, true);
    };
    
    update() {

        let prevState = this.state;

        this.facing[0] = 0;

        let newVelX = 0;
        let newVelY = 0;
        
        if (this.game.right) {
            newVelX += this.velocityConstant;
            this.facing[1] = 0;
        }
        if (this.game.left) {
            newVelX -= this.velocityConstant;
            this.facing[1] = 1;
        }
        if (this.game.up) {
            newVelY -= this.velocityConstant;
            this.facing[0] = 1;
        }
        if (this.game.down) {
            newVelY += this.velocityConstant;
            this.facing[0] = 0;
        }

        if (newVelX !== 0 && newVelY !== 0) var diagonalVel = Math.sqrt(Math.pow(this.velocityConstant, 2) / 2);

        if (diagonalVel) {
            newVelX = newVelX > 0 ? diagonalVel : -diagonalVel;
            newVelY = newVelY > 0 ? diagonalVel : -diagonalVel;
        } 
        
        this.battleCryCooldown = Math.max(0, this.battleCryCooldown - this.game.clockTick);
        this.battleCryTimer = Math.max(0, this.battleCryTimer - this.game.clockTick);

        this.thunderStrikeCooldown = Math.max(0, this.thunderStrikeCooldown - this.game.clockTick);
        this.thunderStrikeTimer = Math.max(0, this.thunderStrikeTimer - this.game.clockTick);

        if (this.battleCryTimer === 0 && this.thunderStrikeTimer === 0) {
            this.state = this.velocity.x === 0 && this.velocity.y === 0 ? 0 : 1;
        }

        if (this.game.clicked) {
            let mousePoint = this.game.mouse ? this.game.mouse : this.game.click;
            this.facing[0] = mousePoint.y < this.BB.center.y - this.game.camera.y ? 1 : 0;
            this.facing[1] = mousePoint.x < this.BB.center.x - this.game.camera.x ? 1 : 0; 
            if (this.battleCryTimer === 0 && this.thunderStrikeTimer === 0) {
                this.state = 2;
            }
        }

        if (this.game.specialR && this.battleCryCooldown === 0 && this.battleCryTimer === 0 && this.thunderStrikeTimer === 0) {
            this.state = 5;
            this.battleCryTimer = 1.1;
            this.battleCryCooldown = 10;
        }

        if (this.game.specialF && this.thunderStrikeCooldown === 0 && this.thunderStrikeTimer === 0 && this.battleCryTimer === 0) {
            this.state = 6;
            this.thunderStrikeTimer = 1.87;
            this.thunderStrikeCooldown = 10;
        }

        if (this.state !== prevState) {
            this.animations[prevState].reset();
        }

        this.velocity.x = newVelX;
        this.velocity.y = newVelY;
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // collision detection and resolve
        this.originalCollisionBB = this.collisionBB;
        this.updateBB();
        let collisionList = [];

        let that = this;
        this.game.entities.forEach(function(entity) {
            if (entity.collideable && that.collisionBB.collide(entity.BB)) { 
                collisionList.push(entity);
            }
        });

        if (collisionList.length > 0) {
            collisionList.sort((boundary1, boundary2) => distance(this.collisionBB.center, boundary1.BB.center) -
                                                         distance(this.collisionBB.center, boundary2.BB.center));
            for (let i = 0; i < collisionList.length; i++) {
                if (this.collisionBB.collide(collisionList[i].BB)) {
                    Collision.resolveCollision(this, collisionList[i]);
                    this.updateBB();
                }
            }
        }
    };

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, 32 * PARAMS.SCALE, 32 * PARAMS.SCALE);
        this.hitBB = new BoundingBox(this.x + 12 * PARAMS.SCALE, this.y + 12 * PARAMS.SCALE, 8 * PARAMS.SCALE, 8 * PARAMS.SCALE);
        this.collisionBB = new BoundingBox(this.hitBB.x + 2 * PARAMS.SCALE, this.hitBB.y + 4 * PARAMS.SCALE, 4 * PARAMS.SCALE, 4 * PARAMS.SCALE);
    };
    
    draw(ctx) {
        // this.animations[this.state][this.facing[0]][this.facing[1]]
        //     .drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, PARAMS.SCALE);
        this.animations[this.state].drawFrame(
            this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, PARAMS.SCALE, this.facing[0], this.facing[1]);

        if (PARAMS.DEBUG) {
            ctx.lineWidth = PARAMS.DEBUG_WIDTH;
            ctx.strokeStyle = PARAMS.DEBUG_COLOR;
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
            ctx.strokeRect(this.hitBB.x - this.game.camera.x, this.hitBB.y - this.game.camera.y, this.hitBB.width, this.hitBB.height);
            ctx.strokeRect(this.collisionBB.x - this.game.camera.x, this.collisionBB.y - this.game.camera.y, this.collisionBB.width, this.collisionBB.height);
        }
    };

    // checkAnimationChange(originalAnim) {
    //     let diff = [originalAnim[0] - this.state, originalAnim[1] - this.facing[0], originalAnim[2] - this.facing[1]];
    //     if (diff[0] !== 0 || diff[1] !== 0 || diff[2] !== 0) {
    //         this.animations[originalAnim[0]][originalAnim[1]][originalAnim[2]].reset();
    //     }
    // };
};

