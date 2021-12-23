class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.y = 0;
        this.loadLevel();
    };

    loadLevel() {
        this.hero = new Barbarian(this.game, 700, 150);
        this.game.addEntity(this.hero);

        this.game.addEntity(new MotherSlime(this.game, 550, 550, true));
        this.game.addEntity(new BabySlime(this.game, 650, 550, true));
        this.game.addEntity(new MotherSlime(this.game, 750, 550, true));
        this.game.addEntity(new BabySlime(this.game, 550, 600, true));
        this.game.addEntity(new BabySlime(this.game, 750, 600, true));
        this.game.addEntity(new BabySlime(this.game, 550, 650, true));
        this.game.addEntity(new BabySlime(this.game, 750, 650, true));
        this.game.addEntity(new MotherSlime(this.game, 550, 700, true));
        this.game.addEntity(new BabySlime(this.game, 650, 700, true));
        this.game.addEntity(new MotherSlime(this.game, 750, 700, true));

        this.game.addEntity(new MotherSlime(this.game, 150, 150, false));
        this.game.addEntity(new BabySlime(this.game, 250, 150, false));
        this.game.addEntity(new MotherSlime(this.game, 350, 150, false));
        this.game.addEntity(new BabySlime(this.game, 150, 200, false));
        this.game.addEntity(new BabySlime(this.game, 350, 200, false));
        this.game.addEntity(new BabySlime(this.game, 150, 250, false));
        this.game.addEntity(new BabySlime(this.game, 350, 250, false));
        this.game.addEntity(new MotherSlime(this.game, 150, 300, false));
        this.game.addEntity(new BabySlime(this.game, 250, 300, false));
        this.game.addEntity(new MotherSlime(this.game, 350, 300, false));

        this.game.addEntity(new Minotaur(this.game, 300, 50));
    };

    update() {
        PARAMS.DEBUG = document.getElementById("debug").checked;
        let midpoint = { x : PARAMS.CANVAS_WIDTH / 2 - PARAMS.BLOCKWIDTH / 2, y : PARAMS.CANVAS_HEIGHT / 2 - PARAMS.BLOCKWIDTH / 2 };
        this.x = this.hero.BB.center.x - midpoint.x;
        this.y = this.hero.BB.center.y - midpoint.y;
    };

    draw(ctx) {};
}