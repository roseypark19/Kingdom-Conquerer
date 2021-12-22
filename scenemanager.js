class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.y = 0;
        this.loadLevel();
    };

    loadLevel() {
        this.hero = new Barbarian(this.game, 550, 200);
        this.game.addEntity(this.hero);

        this.game.addEntity(new MotherSlime(this.game, 550, 550));
        this.game.addEntity(new BabySlime(this.game, 650, 550));
        this.game.addEntity(new MotherSlime(this.game, 750, 550));
        this.game.addEntity(new BabySlime(this.game, 550, 600));
        this.game.addEntity(new BabySlime(this.game, 750, 600));
        this.game.addEntity(new BabySlime(this.game, 550, 650));
        this.game.addEntity(new BabySlime(this.game, 750, 650));
        this.game.addEntity(new MotherSlime(this.game, 550, 700));
        this.game.addEntity(new BabySlime(this.game, 650, 700));
        this.game.addEntity(new MotherSlime(this.game, 750, 700));
    };

    update() {
        PARAMS.DEBUG = document.getElementById("debug").checked;
        let midpoint = { x : PARAMS.CANVAS_WIDTH / 2 - PARAMS.BLOCKWIDTH / 2, y : PARAMS.CANVAS_HEIGHT / 2 - PARAMS.BLOCKWIDTH / 2 };
        this.x = this.hero.BB.center.x - midpoint.x;
        this.y = this.hero.BB.center.y - midpoint.y;
    };

    draw(ctx) {};
}