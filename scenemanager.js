class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.y = 0;
        this.loadLevel();
    };

    loadLevel() {
        // this.hero = new Barbarian(this.game, 750, 175);
        // this.game.addEntity(this.hero);

        // this.loadLayer(level.cliffs);
        // this.loadLayer(level.floor);
        // this.loadLayer(level.shadows);
        // this.loadLayer(level.wall_base);
        // this.loadLayer(level.doors);
        this.hero = new Barbarian(this.game, 750, 175);
        this.game.addEntity(this.hero);
        // this.loadLayer(level.wall_toppers);

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

        this.game.addEntity(new Minotaur(this.game, 500, -225));
        this.game.addEntity(new Minotaur(this.game, 500, -150));

        this.game.addEntity(new Skeleton(this.game, 400, -200));
        this.game.addEntity(new Skeleton(this.game, 600, -200));
        this.game.addEntity(new Skeleton(this.game, 400, -250));
        this.game.addEntity(new Skeleton(this.game, 600, -250));

        this.game.addEntity(new RangedMinion(this.game, 900, -250));
        this.game.addEntity(new RangedMinion(this.game, 1000, -250));
        this.game.addEntity(new RangedMinion(this.game, 1100, -250));

        this.game.addEntity(new Ogre(this.game, 950, -250));
        this.game.addEntity(new Ogre(this.game, 1050, -250));

        this.game.addEntity(new RangedMinion(this.game, 900, -200));
        this.game.addEntity(new RangedMinion(this.game, 950, -200));
        this.game.addEntity(new RangedMinion(this.game, 1000, -200));
        this.game.addEntity(new RangedMinion(this.game, 1050, -200));
        this.game.addEntity(new RangedMinion(this.game, 1100, -200));

        this.game.addEntity(new SwordedMinion(this.game, 900, 550));
        this.game.addEntity(new SwordedMinion(this.game, 950, 550));
        this.game.addEntity(new SwordedMinion(this.game, 1000, 550));
        this.game.addEntity(new SwordedMinion(this.game, 1050, 550));
        this.game.addEntity(new SwordedMinion(this.game, 1100, 550));

        this.game.addEntity(new Ogre(this.game, 950, 600));
        this.game.addEntity(new Ogre(this.game, 1050, 600));

        this.game.addEntity(new SwordedMinion(this.game, 900, 600));
        this.game.addEntity(new SwordedMinion(this.game, 1000, 600));
        this.game.addEntity(new SwordedMinion(this.game, 1100, 600));



        // for (let i = 0; i < 100; i++) {
        //     this.game.addEntity(new MinionProjectile(this.game, 750, 0, randomInt(361) * Math.PI / 180));
        // }
        
    };

    update() {
        PARAMS.DEBUG = document.getElementById("debug").checked;
        let midpoint = { x : PARAMS.CANVAS_WIDTH / 2 - PARAMS.BLOCKWIDTH / 2, y : PARAMS.CANVAS_HEIGHT / 2 - PARAMS.BLOCKWIDTH / 2 };
        this.x = this.hero.BB.center.x - midpoint.x;
        this.y = this.hero.BB.center.y - midpoint.y;
    };

    draw(ctx) {};

    loadLayer(property) {
        for (let i = 0; i < level.height; i++) {
            for  (let j = 0; j < level.width; j++) {
                let cell = level.width * i + j;
                let spriteCode = property.data[cell];
                if (spriteCode != -1) {
                    this.game.addEntity(new MapTile(this.game, 
                                                    j * PARAMS.BLOCKWIDTH * PARAMS.SCALE,
                                                    i * PARAMS.BLOCKWIDTH * PARAMS.SCALE,
                                                    property.spritesheet,
                                                    PARAMS.BLOCKWIDTH * (spriteCode % property.imageWidth),
                                                    PARAMS.BLOCKWIDTH * (Math.floor(spriteCode / property.imageWidth)),
                                                    property.collideable));
                }
            }
        }
    };
}