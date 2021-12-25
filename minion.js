class RangedMinion {

};

class MinionProjectile {

    static rotationList = [];

    constructor(game, x, y, theta) {
        Object.assign(this, { game, x, y, theta });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/projectiles/arrow.png");
        this.friendlyProjectile = false;
        this.damage = 25;
        this.velocityConstant = 1;
        this.velocity = { x: Math.cos(theta) * this.velocityConstant,
                          y: Math.sin(theta) * this.velocityConstant };
        this.lifetime = 10;
        this.projectileType = 0; // 0 = arrow... to be added to later
        if (!(MinionProjectile.rotationList[this.projectileType])) {
            MinionProjectile.rotationList[this.projectileType] = [];
        }
        this.loadAnimations();
        this.updateBB();
    };

    loadAnimations() {
        if (!(MinionProjectile.rotationList[this.projectileType][nearestDegree(this.theta)])) {
            MinionProjectile.rotationList[this.projectileType][nearestDegree(this.theta)] = 
                rotateImage(this.spritesheet, 32, 0, 32, 32, nearestDegree(this.theta) * Math.PI / 180);
        }
        this.animation = 
            new AnimationGroup(MinionProjectile.rotationList[this.projectileType][nearestDegree(this.theta)], 0, 0, 32, 32, 1, 1, false, true);
    };

    update() {
        this.lifetime -= this.game.clockTick;
        if (this.lifetime <= 0) {
            this.removeFromWorld = true;
        } else {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.updateBB();
        }
    };

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, 32 * PARAMS.SCALE, 32 * PARAMS.SCALE);
        let hitCenter = { x: this.BB.center.x + Math.cos(nearestDegree(this.theta) * Math.PI / 180) * 16 * PARAMS.SCALE,
                          y: this.BB.center.y + Math.sin(nearestDegree(this.theta) * Math.PI / 180) * 16 * PARAMS.SCALE };
        this.hitBB = new BoundingBox(hitCenter.x - 2 * PARAMS.SCALE, hitCenter.y - 2 * PARAMS.SCALE, 4 * PARAMS.SCALE, 4 * PARAMS.SCALE);
    };

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, PARAMS.SCALE);

        if (PARAMS.DEBUG) {
            ctx.lineWidth = PARAMS.DEBUG_WIDTH;
            ctx.strokeStyle = PARAMS.DEBUG_COLOR;
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
            ctx.strokeRect(this.hitBB.x - this.game.camera.x, this.hitBB.y - this.game.camera.y, this.hitBB.width, this.hitBB.height);
        }
    };

};