class BabySlime {

    constructor(game, x, y, spritesheet) {
        Object.assign(this, { game, x, y, spritesheet });
        this.facing = [0, 0]; // down, up, right, left
                              // 0, 1, 0, 1 
        this.state = 0; // idle, attacking, damaged, dead
                        // 0, 1, 2, 3
        this.hp = 150;
        this.minProximity = 2;
        this.attackDistance = 300;
        this.shootTimer = 0;
        this.damagedTimer = 0;
        this.deadTimer = 0;
        this.velocityConstant = 2;
        this.velocity = { x: 0, y: 0 };
        this.animations = [];
        this.updateBB();
        this.loadAnimations();
    };

    loadAnimations() {
        this.animations.push(new AnimationGroup(this.spritesheet, 0, 0, 32, 32, 8, 0.4, false, true));
        this.animations.push(new AnimationGroup(this.spritesheet, 32 * 32, 0, 32, 32, 4, 0.15, false, true));
        this.animations.push(new AnimationGroup(this.spritesheet, 48 * 32, 0, 32, 32, 4, 0.15, false, true));
        this.animations.push(new AnimationGroup(this.spritesheet, 64 * 32, 0, 32, 32, 9, 0.15, false, true));
    };

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, 32 * PARAMS.SCALE, 32 * PARAMS.SCALE);
        this.hitBB = new BoundingBox(this.x + 12 * PARAMS.SCALE, this.y + 12 * PARAMS.SCALE, 8 * PARAMS.SCALE, 8 * PARAMS.SCALE);
        this.collisionBB = new BoundingBox(this.hitBB.x + 2 * PARAMS.SCALE, this.hitBB.y + 4 * PARAMS.SCALE, 4 * PARAMS.SCALE, 4 * PARAMS.SCALE);
    };

    update() {

        let prevState = this.state;
        this.facing[0] = 0;
        this.velocity.x = 0;
        this.velocity.y = 0;

        this.shootTimer = Math.max(0, this.shootTimer - this.game.clockTick);
        this.damagedTimer = Math.max(0, this.damagedTimer - this.game.clockTick);
        this.deadTimer = Math.max(0, this.deadTimer - this.game.clockTick);

        this.game.entities.forEach(entity => {
            if (entity.friendlyProjectile === true && this.hitBB.collide(entity.hitBB)) {
                entity.removeFromWorld = true;
                if (this.damagedTimer === 0 && this.deadTimer === 0) {
                    this.damagedTimer = 0.6 - this.game.clockTick;
                    this.state = 2;
                }
                this.hp -= entity.damage;
                if (this.deadTimer === 0 && this.hp <= 0) {
                    this.deadTimer = 9 * 0.15 - this.game.clockTick;
                    this.state = 3;
                    this.facing = [0, 0];
                }
            }
        });

        if (this.state !== 3) {
            let center = this.BB.center;
            this.game.entities.forEach(entity => {
                if (entity instanceof Barbarian) {
                    let heroCenter = entity.BB.center;
                    let dist = distance(center, heroCenter);
                    if (dist <= this.attackDistance) {
                        if (dist > this.minProximity) {
                            let vector = { x : heroCenter.x - center.x, y : heroCenter.y - center.y };
                            let directionUnitVector = { x : vector.x / magnitude(vector), y : vector.y / magnitude(vector) };
                            this.velocity.x = directionUnitVector.x * this.velocityConstant;
                            this.velocity.y = directionUnitVector.y * this.velocityConstant;
                            this.facing[0] = this.velocity.y >= 0 ? 0 : 1;
                            this.facing[1] = this.velocity.x >= 0 ? 0 : 1;
                        }
                        if (this.damagedTimer === 0) {
                            this.state = 1;
                        }
                        if (this.shootTimer === 0) {
                            this.shootTimer = 0.6 - this.game.clockTick;
                            this.game.addEntity(new DamageRegion(
                                this.game, this.hitBB.x, this.hitBB.y, this.hitBB.width, this.hitBB.height, false, 20, 0.1));
                        }
                    } else if (this.damagedTimer === 0) {
                        this.state = 0;
                    }
                }
            });
        } else {
            if (this.deadTimer === 0) {
                this.removeFromWorld = true;
            }
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.updateBB();

        if (this.state !== prevState) {
            this.animations[prevState].reset();
        }
    };

    draw(ctx) {
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
};