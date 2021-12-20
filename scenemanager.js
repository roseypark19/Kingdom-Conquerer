class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.y = 0;
        this.loadLevel();
    };

    loadLevel() {
        this.hero = new Barbarian(this.game, 200, 200, ASSET_MANAGER.getAsset("./sprites/barbarian/barbarian.png"));
        this.game.addEntity(this.hero);
    };

    update() {
        PARAMS.DEBUG = document.getElementById("debug").checked;
        let midpoint = { x : PARAMS.CANVAS_WIDTH / 2 - PARAMS.BLOCKWIDTH / 2, y : PARAMS.CANVAS_HEIGHT / 2 - PARAMS.BLOCKWIDTH / 2 };
        // this.x = this.hero.BB.center.x - midpoint.x;
        // this.y = this.hero.BB.center.y - midpoint.y;
    };

    draw(ctx) {};
}