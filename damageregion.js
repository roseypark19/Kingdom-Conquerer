class DamageRegion {

    constructor(game, x, y, width, height, friendly, damage, lifetime) {
        Object.assign(this, { game, x, y, width, height, damage, lifetime });
        this.friendlyProjectile = friendly;
        this.id = ++PARAMS.SHOT_ID;
        this.updateBB();
    };

    updateBB() {
        this.hitBB = new BoundingBox(this.x, this.y, this.width, this.height);
    };

    update() {
        this.lifetime -= this.game.clockTick;
        if (this.lifetime <= 0) {
            this.removeFromWorld = true;
        }
    };

    draw(ctx) {
        if (PARAMS.DEBUG) {
            ctx.lineWidth = PARAMS.DEBUG_WIDTH;
            ctx.strokeStyle = PARAMS.DEBUG_COLOR;
            ctx.strokeRect(this.hitBB.x - this.game.camera.x, this.hitBB.y - this.game.camera.y, this.hitBB.width, this.hitBB.height);
        }
    };
};