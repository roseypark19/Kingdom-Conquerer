// class Animator {

//     constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, reverse, loop) {
//         Object.assign(this, { spritesheet, xStart, yStart, width, height, frameCount, frameDuration, reverse, loop });
//         this.elapsedTime = 0;
//         this.totalTime = this.frameCount * this.frameDuration;
//     };

//     drawFrame(tick, ctx, x, y, scale) {
//         this.elapsedTime += tick;

//         if (this.isDone()) {
//             if (this.loop) {
//                 this.elapsedTime -= this.totalTime;
//             } else {
//                 return;
//             }
//         }

//         let frame = this.currentFrame();
//         if (this.reverse) frame = this.frameCount - frame - 1;
//         ctx.drawImage(this.spritesheet, this.xStart + frame * this.width, 
//                       this.yStart, this.width, this.height, x, y, this.width * scale, this.height * scale);
//     };

//     currentFrame() {
//         return Math.floor(this.elapsedTime / this.frameDuration);
//     };

//     isDone() {
//         return this.elapsedTime >= this.totalTime;
//     };
// };

class AnimationGroup {

    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, reverse, loop) {
        Object.assign(this, { spritesheet, xStart, yStart, width, height, frameCount, frameDuration, reverse, loop });
        this.elapsedTime = 0;
    };

    drawFrame(tick, ctx, x, y, scale, vertFace = 0, horizFace = 0) {
        if (scale === PARAMS.SCALE) {
            this.elapsedTime += tick;
        }

        if (this.isDone()) {
            if (this.loop) {
                this.reset();
            } else {
                return;
            }
        }

        let frame = this.currentFrame();
        if (this.reverse) frame = this.frameCount - frame - 1;
        ctx.drawImage(this.spritesheet, 
                      this.xStart + (frame * this.width) + (2 * vertFace * this.frameCount * this.width) + (this.frameCount * horizFace * this.width), 
                      this.yStart, this.width, this.height, x, y, this.width * scale, this.height * scale);
    };

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return this.elapsedTime >= this.frameCount * this.frameDuration;
    };

    reset() {
        this.elapsedTime = 0;
    };

    setFrameDuration(duration) {
        if (this.frameDuration !== duration) {
            this.reset();
        }
        this.frameDuration = duration;
    };
};