class BoundingBox {

    constructor(x, y, width, height) {
        Object.assign(this, { x, y, width, height });

        this.left = x;
        this.top = y;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
        this.center = { x : this.x + this.width / 2, y : this.y + this.height / 2 };
    };

    collide(other) {
        return this.right > other.left && this.left < other.right && this.top < other.bottom && this.bottom > other.top;
    }
};