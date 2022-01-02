// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor() {
        this.entities = [];
        this.livingEntities = [];
        this.collideableEntities = [];
        this.projectileEntities = [];
        this.livingCount = 0;
        this.showOutlines = false;
        this.ctx = null;
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.surfaceWidth = null;
        this.surfaceHeight = null;

        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.specialR = false;
        this.specialF = false;
        this.clicked = false;
    };

    init(ctx) { // called after the page has loaded
        this.ctx = ctx;
        this.surfaceWidth = this.ctx.canvas.width;
        this.surfaceHeight = this.ctx.canvas.height;
        this.startInput();
        this.timer = new Timer();
    };

    start() {
        let that = this;
        (function gameLoop() {
            that.loop();
            requestAnimFrame(gameLoop, that.ctx.canvas);
        })();
    };

    startInput() {

        let that = this;

        this.ctx.canvas.addEventListener("keydown", function(e) {
            let direction = "";
            switch (e.code) {
                case "ArrowLeft": e.preventDefault();
                case "KeyA":
                    that.left = true;
                    direction = "left";
                    break;
                case "ArrowRight": e.preventDefault();
                case "KeyD":
                    that.right = true;
                    direction = "right";
                    break;
                case "ArrowUp": e.preventDefault();
                case "KeyW":
                    direction = "up";
                    that.up = true;
                    break;
                case "ArrowDown": e.preventDefault();
                case "KeyS":
                    direction = "down";
                    that.down = true;
                    break;
                case "KeyR":
                    that.specialR = true;
                    break;
                case "KeyF":
                    that.specialF = true;
                    break;
            }
        }, false);

        this.ctx.canvas.addEventListener("keyup", function(e) {
            let direction = "";
            switch (e.code) {
                case "ArrowLeft":
                case "KeyA":
                    that.left = false;
                    direction = "left";
                    break;
                case "ArrowRight":
                case "KeyD":
                    direction = "right";
                    that.right = false;
                    break;
                case "ArrowUp":
                case "KeyW":
                    direction = "up";
                    that.up = false;
                    break;
                case "ArrowDown":
                case "KeyS":
                    direction = "down";
                    that.down = false;
                    break;
                case "KeyR":
                    that.specialR = false;
                    break;
                case "KeyF":
                    that.specialF = false;
                    break;
            }
        }, false);

        let getXandY = function (e) {
            let x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
            let y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

            return { x: x, y: y };
        }

        this.ctx.canvas.addEventListener("mousemove", function (e) {
            //console.log(getXandY(e));
            that.mouse = getXandY(e);
            // console.log(that.mouse)
        }, false);

        this.ctx.canvas.addEventListener("mousedown", function (e) {
            that.clicked = true;
            //console.log(getXandY(e));
            that.click = getXandY(e);
        }, false);

        this.ctx.canvas.addEventListener("mouseup", function (e) {
            that.clicked = false;
            //console.log(getXandY(e));
            that.click = getXandY(e);
        }, false);

        this.ctx.canvas.addEventListener("wheel", function (e) {
            //console.log(getXandY(e));
            that.wheel = e;
            //       console.log(e.wheelDelta);
            e.preventDefault();
        }, false);

        this.ctx.canvas.addEventListener("contextmenu", function (e) {
            //console.log(getXandY(e));
            that.rightclick = getXandY(e);
            e.preventDefault();
        }, false);
    };

    addEntity(entity) {
        if (this.heroIndex !== undefined) {
            if (entity.hasOwnProperty("hp")) {
                this.entities.splice(this.heroIndex, 0, entity);
                this.heroIndex++;
            } else if (entity.hasOwnProperty("friendlyProjectile")) {
                this.entities.splice(this.heroIndex + 1, 0, entity);
            } else {
                this.entities.push(entity);
            }
        } else {
            this.entities.push(entity);
            if (entity instanceof Barbarian) {
                this.heroIndex = this.entities.length - 1;
            }
        }
        if (entity.hasOwnProperty("hp")) {
            this.livingEntities.push(entity);
            this.livingCount++;
        } else if (entity.collideable) {
            this.collideableEntities.push(entity);
        } else if (entity.hasOwnProperty("friendlyProjectile")) {
            this.projectileEntities.push(entity);
        }
    };

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (let i = 0; i < this.entities.length; i++) {
            if (Math.abs(this.camera.hero.BB.center.x - this.entities[i].BB.center.x) <= PARAMS.CANVAS_DIMENSION * 0.55 &&
                Math.abs(this.camera.hero.BB.center.y - this.entities[i].BB.center.y) <= PARAMS.CANVAS_DIMENSION * 0.55) {
                this.entities[i].draw(this.ctx);
            }
            
        }
        this.camera.draw(this.ctx);
    };

    update() {
        let entitiesCount = this.entities.length;
        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.entities[i];
            
            if (PARAMS.GAMEOVER && ((!(entity instanceof Barbarian) && entity.hasOwnProperty("hp")) || entity.hasOwnProperty("friendlyProjectile"))) {
                entity.removeFromWorld = true;
            }

            if (!entity.removeFromWorld) {
                entity.update();
            }
        }
        this.camera.update();

        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                let entity = this.entities[i];
                this.updateCustomEntities(entity);
                this.entities.splice(i, 1);
                if (i < this.heroIndex) {
                    this.heroIndex--;
                }
            }
        }

        if (!PARAMS.GAMEOVER && this.livingCount === 1 && this.camera.hero.hp > 0) {
            PARAMS.GAMEOVER = true;
            ASSET_MANAGER.pauseBackgroundMusic();
            ASSET_MANAGER.playAsset("./audio/victory.mp3");
        }
    };

    updateCustomEntities(deletedEntity) {
        if (deletedEntity.hasOwnProperty("hp")) {
            this.livingCount--;
            this.removeFromEntityList(this.livingEntities, deletedEntity.id);
        } else if (deletedEntity.collideable) {
            this.removeFromEntityList(this.collideableEntities, deletedEntity.id);
        } else if (deletedEntity.hasOwnProperty("friendlyProjectile")) {
            this.removeFromEntityList(this.projectileEntities, deletedEntity.id);
        }
    };

    removeFromEntityList(list, id) {
        for (let i = list.length - 1; i >= 0; --i) {
            if (list[i].id === id) {
                list.splice(i, 1);
                break;
            }
        }
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };
};