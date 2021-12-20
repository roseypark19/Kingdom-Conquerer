// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor() {
        this.entities = [];
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
                case "ArrowLeft":
                case "KeyA":
                    that.left = true;
                    direction = "left";
                    break;
                case "ArrowRight":
                case "KeyD":
                    that.right = true;
                    direction = "right";
                    break;
                case "ArrowUp":
                case "KeyW":
                    direction = "up";
                    that.up = true;
                    break;
                case "ArrowDown":
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
        this.entities.push(entity);
    };

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(this.ctx);
        }
        this.camera.draw(this.ctx);
    };

    update() {
        let entitiesCount = this.entities.length;
        
        for (let i = 0; i < entitiesCount; i++) {
            var entity = this.entities[i];

            if (!entity.removeFromWorld) {
                entity.update();
            }
        }
        this.camera.update();

        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1);
            }
        }
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };
};