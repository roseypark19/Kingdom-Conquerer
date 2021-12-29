class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.y = 0;
        this.loadLevel();
    };

    loadLevel() {
        this.loadLayer(level.cliffs);
        this.loadLayer(level.floor);
        this.loadLayer(level.shadows);
        this.loadLayer(level.wall_base);
        this.hero = new Barbarian(this.game, PARAMS.SCALE * (level.heroSpawn.x * PARAMS.BLOCKWIDTH - 16), 
                                             PARAMS.SCALE * (level.heroSpawn.y * PARAMS.BLOCKWIDTH - 16));
        this.game.addEntity(this.hero);
        for (let i = 0; i < level.enemySpawns.length; i++) {
            this.randomSpawn(level.enemySpawns[i], randomInt(3));
        }
        this.loadLayer(level.wall_toppers);
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
                if (spriteCode !== -1) {
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

    randomSpawn(gridCenter, groupType) {
        let leaderPts = [];
        let minionPts = [];
        let rand1 = randomInt(2);
        if (rand1 === 0) { // horizontal leaders
            leaderPts.push({ x: gridCenter.x - 1.25, y: gridCenter.y });
            leaderPts.push({ x: gridCenter.x + 1.25, y: gridCenter.y });
        } else { // vertical leaders
            leaderPts.push({ x: gridCenter.x, y: gridCenter.y - 1.25 });
            leaderPts.push({ x: gridCenter.x, y: gridCenter.y + 1.25 });
        }

        if (rand1 === 0) {
            for (let i = -2.5; i <= 2.5; i += 2.5) {
                for (let j = -3.75; j <= 3.75; j += 2.5) {
                    if (i !== 0 || j === -3.75 || j === 3.75) {
                        minionPts.push({ x: gridCenter.x + j, y: gridCenter.y + i });
                    }
                }
            }
        } else {
            for (let i = -3.75; i <= 3.75; i += 2.5) {
                for (let j = -2.5; j <= 2.5; j += 2.5) {
                    if ((i !== 1.25 && i !== -1.25) || j !== 0) {
                        minionPts.push({ x: gridCenter.x + j, y: gridCenter.y + i });
                    }
                }
            }
        }

        let leaderFunc = null;
        let minionFunc = null;

        switch(groupType) {
            case 0: // slimes
                leaderFunc = point => this.game.addEntity(new MotherSlime(this.game, point.x, point.y, randomInt(2) === 0));
                minionFunc = point => this.game.addEntity(new BabySlime(this.game, point.x, point.y, randomInt(2) === 0));
                break;
            case 1: // skeletons and minotaurs
                leaderFunc = point => this.game.addEntity(new Minotaur(this.game, point.x, point.y));
                minionFunc = point => this.game.addEntity(new Skeleton(this.game, point.x, point.y));
                break;
            case 2: // ogres and arrow/sword minions
                leaderFunc = point => this.game.addEntity(new Ogre(this.game, point.x, point.y));
                minionFunc = point => this.game.addEntity(randomInt(2) === 0 ? new RangedMinion(this.game, point.x, point.y) : 
                                                                               new SwordedMinion(this.game, point.x, point.y));
                break;
        }
        this.addEnemySpawn(this.computePoints(leaderPts), this.computePoints(minionPts), leaderFunc, minionFunc);
    };

    addEnemySpawn(leaderPts, minionPts, leaderFunc, minionFunc) {
        for (let i = 0; i < leaderPts.length; i++) {
            leaderFunc(leaderPts[i]);
        }
        for (let i = 0; i < minionPts.length; i++) {
            minionFunc(minionPts[i]);
        }
    };

    computePoints(gridPoints) {
        let pts = [];
        for (let i = 0; i < gridPoints.length; i++) {
            pts.push({ x: PARAMS.SCALE * (gridPoints[i].x * PARAMS.BLOCKWIDTH - 16), 
                       y: PARAMS.SCALE * (gridPoints[i].y * PARAMS.BLOCKWIDTH - 16) });
        }
        return pts;
    };
}