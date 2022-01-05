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
        this.game.heroIndex = undefined;
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
        this.statsDisplay = new StatsDisplay(this.game, 0, 20);
        this.abilityDisplay = new AbilityDisplay(this.game, 20, PARAMS.CANVAS_DIMENSION - abilityDisplayDimension() - 20);
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
        midpoint = { x : mMapDimension() / 2, y : mMapDimension() / 2 };
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
                            this.game.mouse.x < this.hero.BB.center.x - this.x + 2.5 * 3 * PARAMS.BLOCKWIDTH &&
                            this.game.mouse.y > this.hero.BB.bottom - this.y && 
                            this.game.mouse.y < this.hero.BB.bottom - this.y + 3 * PARAMS.BLOCKWIDTH ? "Black" : "White";
            ctx.fillText("START", 
                         this.hero.BB.center.x - this.x - 2.5 * 3 * PARAMS.BLOCKWIDTH, 
                         this.hero.BB.bottom - this.y + 3 * PARAMS.BLOCKWIDTH);
        } else if (PARAMS.GAMEOVER) {
            if (this.hero.hp > 0) {
                ctx.fillStyle = rgb(102, 255, 0);
                ctx.font = 5 * PARAMS.BLOCKWIDTH + 'px "Press Start 2P"';
                ctx.fillText("YOU WON", 
                             this.hero.BB.center.x - this.x - 3.5 * 5 * PARAMS.BLOCKWIDTH, 
                             this.hero.BB.top - this.y);
                this.statsDisplay.draw(ctx);
                this.abilityDisplay.draw(ctx);
                this.mmap.draw(ctx);
            } else {
                ctx.fillStyle = "Red";
                ctx.font = 5 * PARAMS.BLOCKWIDTH + 'px "Press Start 2P"';
                ctx.fillText("GAME OVER", 
                             this.hero.BB.center.x - this.x - 4.5 * 5 * PARAMS.BLOCKWIDTH, 
                             this.hero.BB.top - this.y);
            }
        } else {
            this.statsDisplay.draw(ctx);
            this.abilityDisplay.draw(ctx);
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
        this.canvas.width = mMapDimension();
        this.canvas.height = mMapDimension();
        this.frameShadowSprite = ASSET_MANAGER.getAsset("./sprites/gui/frames_shadows.png");
        this.frameSprite = ASSET_MANAGER.getAsset("./sprites/gui/frames.png");
    };

    draw(ctx) {
        let context = this.canvas.getContext("2d");
        context.clearRect(0, 0, mMapDimension(), mMapDimension());

        context.beginPath();
        context.strokeStyle = "Black";
        context.fillStyle = "Black";
        context.arc(this.canvas.width / 2, this.canvas.height / 2, 15 * PARAMS.GUI_SCALE, 0, 2 * Math.PI);
        context.stroke();
        context.fill();

        this.game.entities.forEach(entity => {
            if (entity.drawMmap && 
                distance(entity.BB.center, this.game.camera.hero.BB.center) / PARAMS.SCALE < 14.5 * PARAMS.GUI_SCALE / PARAMS.MMAP_SCALE) {
                entity.drawMmap(context);
            }
        });

        // draw minimap shadows
        ctx.drawImage(this.frameShadowSprite, 479, 271, 17, 17, this.x, this.y, 17 * PARAMS.GUI_SCALE, 17 * PARAMS.GUI_SCALE);
        ctx.drawImage(this.frameShadowSprite, 479 + 33, 271, 17, 17, this.x + 17 * PARAMS.GUI_SCALE, this.y, 17 * PARAMS.GUI_SCALE, 17 * PARAMS.GUI_SCALE);
        ctx.drawImage(this.frameShadowSprite, 479, 271 + 33, 17, 17, this.x, this.y + 17 * PARAMS.GUI_SCALE, 17 * PARAMS.GUI_SCALE, 17 * PARAMS.GUI_SCALE);
        ctx.drawImage(this.frameShadowSprite, 479 + 33, 271 + 33, 17, 17, this.x + 17 * PARAMS.GUI_SCALE, this.y + 17 * PARAMS.GUI_SCALE, 17 * PARAMS.GUI_SCALE, 17 * PARAMS.GUI_SCALE);

        ctx.drawImage(this.canvas, this.x, this.y);

        // draw minimap frame
        ctx.drawImage(this.frameSprite, 480, 272, 16, 16, this.x + PARAMS.GUI_SCALE, this.y + PARAMS.GUI_SCALE, 16 * PARAMS.GUI_SCALE, 16 * PARAMS.GUI_SCALE);
        ctx.drawImage(this.frameSprite, 480 + 32, 272, 16, 16, this.x + 17 * PARAMS.GUI_SCALE, this.y + PARAMS.GUI_SCALE, 16 * PARAMS.GUI_SCALE, 16 * PARAMS.GUI_SCALE);
        ctx.drawImage(this.frameSprite, 480, 272 + 32, 16, 16, this.x + PARAMS.GUI_SCALE, this.y + 17 * PARAMS.GUI_SCALE, 16 * PARAMS.GUI_SCALE, 16 * PARAMS.GUI_SCALE);
        ctx.drawImage(this.frameSprite, 480 + 32, 272 + 32, 16, 16, this.x + 17 * PARAMS.GUI_SCALE, this.y + 17 * PARAMS.GUI_SCALE, 16 * PARAMS.GUI_SCALE, 16 * PARAMS.GUI_SCALE);
    };
};

class StatsDisplay {

    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.flickerTimer = 0;
        this.flickerFlag = false;
        this.hpMpSprite = ASSET_MANAGER.getAsset("./sprites/gui/icons.png");
        this.barSprite = ASSET_MANAGER.getAsset("./sprites/gui/bars.png");
        this.barShadowSprite = ASSET_MANAGER.getAsset("./sprites/gui/bars_shadows.png");
        this.frameSprite = ASSET_MANAGER.getAsset("./sprites/gui/frames.png");
        this.frameShadowSprite = ASSET_MANAGER.getAsset("./sprites/gui/frames_shadows.png");
    };

    draw(ctx) {

        this.flickerTimer = Math.max(0, this.flickerTimer - this.game.clockTick);
        const dimension = statsDisplayDimension();
        const hero = this.game.camera.hero;

        // frame shadow
        ctx.drawImage(this.frameShadowSprite, 47 + 25 + 8, 159, 17, 12.5, this.x, this.y, 17 * PARAMS.GUI_SCALE, dimension / 2);
        ctx.drawImage(this.frameShadowSprite, 47 + 25 + 8, 159 + 25 + 12.5, 17, 12.5, this.x, this.y + dimension / 2, 17 * PARAMS.GUI_SCALE, dimension / 2);

        // hp bar shadow
        ctx.drawImage(this.barShadowSprite, 87, 36, 17, 7, this.x + 10 * PARAMS.GUI_SCALE, this.y + 5 * PARAMS.GUI_SCALE, 17 * PARAMS.GUI_SCALE, 7 * PARAMS.GUI_SCALE);
        ctx.drawImage(this.barShadowSprite, 87 + 9, 36, 16, 7, this.x + (10 + 17) * PARAMS.GUI_SCALE, this.y + 5 * PARAMS.GUI_SCALE, 16 * PARAMS.GUI_SCALE, 7 * PARAMS.GUI_SCALE);
        ctx.drawImage(this.barShadowSprite, 87 + 9, 36, 16, 7, this.x + (10 + 33) * PARAMS.GUI_SCALE, this.y + 5 * PARAMS.GUI_SCALE, 16 * PARAMS.GUI_SCALE, 7 * PARAMS.GUI_SCALE);
        ctx.drawImage(this.barShadowSprite, 87 + 17, 36, 17, 7, this.x + (10 + 49) * PARAMS.GUI_SCALE, this.y + 5 * PARAMS.GUI_SCALE, 17 * PARAMS.GUI_SCALE, 7 * PARAMS.GUI_SCALE);

        // mp bar shadow
        ctx.drawImage(this.barShadowSprite, 87, 36, 17, 7, this.x + 10 * PARAMS.GUI_SCALE, this.y + 13 * PARAMS.GUI_SCALE, 17 * PARAMS.GUI_SCALE, 7 * PARAMS.GUI_SCALE);
        ctx.drawImage(this.barShadowSprite, 87 + 9, 36, 16, 7, this.x + (10 + 17) * PARAMS.GUI_SCALE, this.y + 13 * PARAMS.GUI_SCALE, 16 * PARAMS.GUI_SCALE, 7 * PARAMS.GUI_SCALE);
        ctx.drawImage(this.barShadowSprite, 87 + 9, 36, 16, 7, this.x + (10 + 33) * PARAMS.GUI_SCALE, this.y + 13 * PARAMS.GUI_SCALE, 16 * PARAMS.GUI_SCALE, 7 * PARAMS.GUI_SCALE);
        ctx.drawImage(this.barShadowSprite, 87 + 17, 36, 17, 7, this.x + (10 + 49) * PARAMS.GUI_SCALE, this.y + 13 * PARAMS.GUI_SCALE, 17 * PARAMS.GUI_SCALE, 7 * PARAMS.GUI_SCALE);

        // frame and icons
        ctx.drawImage(this.frameSprite, 48 + 32, 160, 16, 12, this.x, this.y + PARAMS.GUI_SCALE, dimension - 9 * PARAMS.GUI_SCALE, (dimension - 2 * PARAMS.GUI_SCALE) / 2);
        ctx.drawImage(this.frameSprite, 48 + 32, 160 + 36, 16, 12, this.x, this.y + dimension / 2, dimension - 9 * PARAMS.GUI_SCALE, (dimension - 2 * PARAMS.GUI_SCALE) / 2);
        ctx.drawImage(this.hpMpSprite, 41, 57, 7, 7, this.x + 3 * PARAMS.GUI_SCALE,
                                                     this.y + 5 * PARAMS.GUI_SCALE,
                                                     7 * PARAMS.GUI_SCALE, 7 * PARAMS.GUI_SCALE);
        ctx.drawImage(this.hpMpSprite, 41, 65, 7, 7, this.x + 3 * PARAMS.GUI_SCALE,
                                                     this.y + 13 * PARAMS.GUI_SCALE,
                                                     7 * PARAMS.GUI_SCALE, 7 * PARAMS.GUI_SCALE);
                    
        // hp bar
        if (hero.hp / hero.maxHp * 100 > 25) {
            this.flickerFlag = false;
        }
        if (hero.hp / hero.maxHp * 100 <= 25 && this.flickerTimer === 0) {
            this.flickerTimer = 0.25;
            this.flickerFlag = !this.flickerFlag;
        }

        ctx.fillStyle = this.flickerFlag ? rgb(228, 84, 110) : rgb(198, 27, 58);
        ctx.fillRect(this.x + 13 * PARAMS.GUI_SCALE, this.y + 7 * PARAMS.GUI_SCALE, 60 * hero.hp / hero.maxHp * PARAMS.GUI_SCALE, 3 * PARAMS.GUI_SCALE);

        ctx.drawImage(this.barSprite, 88, 37, 16, 5, this.x + 11 * PARAMS.GUI_SCALE, this.y + 6 * PARAMS.GUI_SCALE, 16 * PARAMS.GUI_SCALE, 5 * PARAMS.GUI_SCALE);
        ctx.drawImage(this.barSprite, 88 + 8, 37, 16, 5, this.x + (11 + 16) * PARAMS.GUI_SCALE, this.y + 6 * PARAMS.GUI_SCALE, 16 * PARAMS.GUI_SCALE, 5 * PARAMS.GUI_SCALE);
        ctx.drawImage(this.barSprite, 88 + 8, 37, 16, 5, this.x + (11 + 32) * PARAMS.GUI_SCALE, this.y + 6 * PARAMS.GUI_SCALE, 16 * PARAMS.GUI_SCALE, 5 * PARAMS.GUI_SCALE);
        ctx.drawImage(this.barSprite, 88 + 16, 37, 16, 5, this.x + (11 + 48) * PARAMS.GUI_SCALE, this.y + 6 * PARAMS.GUI_SCALE, 16 * PARAMS.GUI_SCALE, 5 * PARAMS.GUI_SCALE);

        // mp bar
        ctx.fillStyle = rgb(101, 219, 241);
        ctx.fillRect(this.x + 13 * PARAMS.GUI_SCALE, this.y + 15 * PARAMS.GUI_SCALE, 60 * hero.mp / hero.maxMp * PARAMS.GUI_SCALE, 3 * PARAMS.GUI_SCALE);

        ctx.drawImage(this.barSprite, 88, 37, 16, 5, this.x + 11 * PARAMS.GUI_SCALE, this.y + 14 * PARAMS.GUI_SCALE, 16 * PARAMS.GUI_SCALE, 5 * PARAMS.GUI_SCALE);
        ctx.drawImage(this.barSprite, 88 + 8, 37, 16, 5, this.x + (11 + 16) * PARAMS.GUI_SCALE, this.y + 14 * PARAMS.GUI_SCALE, 16 * PARAMS.GUI_SCALE, 5 * PARAMS.GUI_SCALE);
        ctx.drawImage(this.barSprite, 88 + 8, 37, 16, 5, this.x + (11 + 32) * PARAMS.GUI_SCALE, this.y + 14 * PARAMS.GUI_SCALE, 16 * PARAMS.GUI_SCALE, 5 * PARAMS.GUI_SCALE);
        ctx.drawImage(this.barSprite, 88 + 16, 37, 16, 5, this.x + (11 + 48) * PARAMS.GUI_SCALE, this.y + 14 * PARAMS.GUI_SCALE, 16 * PARAMS.GUI_SCALE, 5 * PARAMS.GUI_SCALE);      
    };
};

class AbilityDisplay {

    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.frameSprite = ASSET_MANAGER.getAsset("./sprites/gui/frames.png");
        this.frameShadowSprite = ASSET_MANAGER.getAsset("./sprites/gui/frames_shadows.png");
        this.characterSprite = ASSET_MANAGER.getAsset("./sprites/barbarian/barbarian.png");
    };

    draw(ctx) {

        const dimension = abilityDisplayDimension();
        const hero = this.game.camera.hero;
        const spacing = 10;

        // frame shadow
        ctx.drawImage(this.frameShadowSprite, 47, 239, 5, 18, this.x, this.y, 5 * PARAMS.GUI_SCALE, dimension);
        let x = this.x + 5 * PARAMS.GUI_SCALE;
        for (let i = 0; i < hero.abilityData.length; i++) {
            ctx.drawImage(this.frameShadowSprite, 50, 239, spacing, 18, x, this.y, spacing * PARAMS.GUI_SCALE, dimension);
            x += spacing * PARAMS.GUI_SCALE;
        }
        ctx.drawImage(this.frameShadowSprite, 92, 239, 5, 18, x, this.y, 5 * PARAMS.GUI_SCALE, dimension);

        // frame
        ctx.drawImage(this.frameSprite, 48, 128, 4, 16, this.x + PARAMS.GUI_SCALE, this.y + PARAMS.GUI_SCALE, 4 * PARAMS.GUI_SCALE, 16 * PARAMS.GUI_SCALE);
        x = this.x + 5 * PARAMS.GUI_SCALE;
        for (let i = 0; i < hero.abilityData.length; i++) {
            ctx.drawImage(this.frameSprite, 52, 128, spacing, 16, x, this.y + PARAMS.GUI_SCALE, spacing * PARAMS.GUI_SCALE, 16 * PARAMS.GUI_SCALE);
            x += spacing * PARAMS.GUI_SCALE;
        }
        ctx.drawImage(this.frameSprite, 92, 128, 4, 16, x, this.y + PARAMS.GUI_SCALE, 4 * PARAMS.GUI_SCALE, 16 * PARAMS.GUI_SCALE);

        // ability icons and buttons
        const drawScale = PARAMS.GUI_SCALE - 4;
        x = this.x + (5 + spacing / 2) * PARAMS.GUI_SCALE;
        let y = this.y + dimension / 2;
        ctx.fillStyle = ctx.strokeStyle = "Black";
        ctx.font = 10 + 'px "Press Start 2P"';
        for (let i = 0; i < hero.abilityData.length; i++) {
            let data = hero.abilityData[i];
            ctx.drawImage(hero.abilitySpritesheet, data.x, data.y, 32, 32, 
                          x - 16 * drawScale, y - hero.spriteCenter * drawScale, 32 * drawScale, 32 * drawScale);
            ctx.fillText(data.button, x + 6 * drawScale, y + 10 * drawScale);
            ctx.strokeText(data.button, x + 6 * drawScale, y + 10 * drawScale);
            x += spacing * PARAMS.GUI_SCALE;
        }
    };
};