class MapTile {
    constructor(game, x, y, spritesheet, spriteX, spriteY, collideable) {
        Object.assign(this, {game, x, y, spritesheet, spriteX, spriteY, collideable});
        
        this.animator = new Animator(ASSET_MANAGER.getAsset(this.spritesheet), 
                                     spriteX, spriteY, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, 1, 1, false, true);
        if (this.collideable) this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH * PARAMS.SCALE,
                                                        PARAMS.BLOCKWIDTH * PARAMS.SCALE);                      
    };

    update() {};

    draw(ctx) {
        this.animator.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, PARAMS.SCALE);
        if (this.BB && PARAMS.DEBUG) {
            ctx.strokeStyle = PARAMS.DEBUG_COLOR;
            ctx.strokeWidth = PARAMS.DEBUG_WIDTH;
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
        }
    };
};

