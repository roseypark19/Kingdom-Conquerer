class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.y = 0;
        this.elapsed = 0;
        this.loadLevel(levelOne, true);
    };

    clearEntities() {
        this.game.entities.forEach(entity => entity.removeFromWorld = true);
    };

    loadLevel(level, title) {
        this.title = title;
        this.clearEntities();
        this.loadLayer(level.cliffs, level);
        this.loadLayer(level.floor, level);
        this.loadLayer(level.shadows, level);
        this.loadLayer(level.wall_base, level);
        this.hero = new Barbarian(this.game, PARAMS.SCALE * (level.heroSpawn.x * PARAMS.BLOCKWIDTH - 16), 
                                             PARAMS.SCALE * (level.heroSpawn.y * PARAMS.BLOCKWIDTH - 16));
        this.game.addEntity(this.hero);
        for (let i = 0; i < level.enemySpawns.length; i++) {
            this.randomSpawn(level.enemySpawns[i], randomInt(3));
        }
        this.loadLayer(level.wall_toppers, level);
        this.mmap = new Minimap(this.game, PARAMS.CANVAS_DIMENSION - mMapDimension() - 20, 20);
        if (level.music && !this.title) {
            ASSET_MANAGER.pauseBackgroundMusic();
            ASSET_MANAGER.playAsset(level.music);
        }
    };

    update() {
        if (PARAMS.GAMEOVER) {
            this.elapsed = Math.min(4, this.elapsed + this.game.clockTick);
        }
        PARAMS.DEBUG = document.getElementById("debug").checked;
        this.updateAudio();

        if (this.title && this.game.click) {
            if (this.game.click.x > this.hero.BB.center.x - this.x - 2.5 * 3 * PARAMS.BLOCKWIDTH && 
                this.game.click.x < this.hero.BB.center.x - this.x + 5 * 3 * PARAMS.BLOCKWIDTH &&
                this.game.click.y > this.hero.BB.bottom - this.y && 
                this.game.click.y < this.hero.BB.bottom - this.y + 3 * PARAMS.BLOCKWIDTH) {
                this.loadLevel(levelOne, false);
            }
        }

        let midpoint = { x : PARAMS.CANVAS_DIMENSION / 2, y : PARAMS.CANVAS_DIMENSION / 2 };
        this.x = this.hero.BB.center.x - midpoint.x;
        this.y = this.hero.BB.center.y - midpoint.y;
        midpoint = { x : mMapCanvasDimension() / 2, y : mMapCanvasDimension() / 2 };
        this.mmX = this.hero.BB.center.x / (PARAMS.SCALE / PARAMS.MMAP_SCALE) - midpoint.x;
        this.mmY = this.hero.BB.center.y / (PARAMS.SCALE / PARAMS.MMAP_SCALE) - midpoint.y;

        if (PARAMS.GAMEOVER && this.elapsed === 4) {
            PARAMS.GAMEOVER = false;
            this.game.click = null;
            this.elapsed = 0;
            this.loadLevel(levelOne, true);
        }
    };

    updateAudio() {
        let mute = document.getElementById("mute").checked;
        let volume = document.getElementById("volume").value;
        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);
    };

    draw(ctx) { 
        if (this.title) {
            ctx.font = 5 * PARAMS.BLOCKWIDTH + 'px "Press Start 2P"';
            ctx.fillStyle = "White";
            ctx.fillText("SOLITARY SLAMMER", 
                         this.hero.BB.center.x - this.x - 8 * 5 * PARAMS.BLOCKWIDTH, 
                         this.hero.BB.top - this.y);
            ctx.font = 3 * PARAMS.BLOCKWIDTH + 'px "Press Start 2P"';
            ctx.fillStyle = this.game.mouse && 
                            this.game.mouse.x > this.hero.BB.center.x - this.x - 2.5 * 3 * PARAMS.BLOCKWIDTH && 
                            this.game.mouse.x < this.hero.BB.center.x - this.x + 5 * 3 * PARAMS.BLOCKWIDTH &&
                            this.game.mouse.y > this.hero.BB.bottom - this.y && 
                            this.game.mouse.y < this.hero.BB.bottom - this.y + 3 * PARAMS.BLOCKWIDTH ? "Black" : "White";
            ctx.fillText("START", 
                         this.hero.BB.center.x - this.x - 2.5 * 3 * PARAMS.BLOCKWIDTH, 
                         this.hero.BB.bottom - this.y + 3 * PARAMS.BLOCKWIDTH);
        } else if (PARAMS.GAMEOVER) {
            ctx.fillStyle = "Red";
            ctx.font = 5 * PARAMS.BLOCKWIDTH + 'px "Press Start 2P"';
            ctx.fillText("GAME OVER", 
                         this.hero.BB.center.x - this.x - 4.5 * 5 * PARAMS.BLOCKWIDTH, 
                         this.hero.BB.top - this.y);
        } else {
            this.mmap.draw(ctx);
        } 
    };

    loadLayer(property, level) {
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
};

class Minimap {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.canvas = document.createElement("canvas");
        this.canvas.width = mMapCanvasDimension();
        this.canvas.height = mMapCanvasDimension();
        this.frameSprite = ASSET_MANAGER.getAsset("./sprites/gui/panels_slots.png");
    };

    draw(ctx) {
        let context = this.canvas.getContext("2d");
        context.fillStyle = "Black";
        context.fillRect(0, 0, mMapCanvasDimension(), mMapCanvasDimension());
        this.game.entities.forEach(entity => {
            if (entity.drawMmap && 
                (Math.abs(this.game.camera.hero.BB.center.x - entity.BB.center.x) <= PARAMS.CANVAS_DIMENSION * 0.5 / PARAMS.MMAP_SCALE &&
                 Math.abs(this.game.camera.hero.BB.center.y - entity.BB.center.y) <= PARAMS.CANVAS_DIMENSION * 0.5 / PARAMS.MMAP_SCALE)) {
                entity.drawMmap(context);
            }
        });
        ctx.drawImage(this.canvas, this.x + (mMapDimension() - mMapCanvasDimension()) / 2, 
                                   this.y + (mMapDimension() - mMapCanvasDimension()) / 2);
        ctx.drawImage(this.frameSprite, 479, 159, 50, 50, this.x, this.y, mMapDimension(), mMapDimension());
    };
};