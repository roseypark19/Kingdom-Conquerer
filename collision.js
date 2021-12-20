class Collision {
    static leftCollision(collisionBB, originalCollisionBB, boundaryBB) {
        if (collisionBB.x - originalCollisionBB.x > 0) {
            if (collisionBB.right > boundaryBB.left && originalCollisionBB.right <= boundaryBB.left) {
                return { x: -1, y: 0 };
            }
        }
        return false;
    };
    
    static rightCollision(collisionBB, originalCollisionBB, boundaryBB) {
        if (collisionBB.x - originalCollisionBB.x < 0) {
            if (collisionBB.left < boundaryBB.right && originalCollisionBB.left >= boundaryBB.right) {
                return { x: 1, y: 0 };
            }
        }
        return false;
    };
    
    static topCollision(collisionBB, originalCollisionBB, boundaryBB) {
        if (collisionBB.y - originalCollisionBB.y > 0) {
            if (collisionBB.bottom > boundaryBB.top && originalCollisionBB.bottom <= boundaryBB.top) {
                return { x: 0, y: -1 };
            }
        }
        return false;
    };
    
    static bottomCollision(collisionBB, originalCollisionBB, boundaryBB) {
        if (collisionBB.y - originalCollisionBB.y < 0) {
            if (collisionBB.top < boundaryBB.bottom && originalCollisionBB.top >= boundaryBB.bottom) {
                return { x: 0, y: 1 };
            }
        }
        return false;
    };

    static collide(collisionBB, originalCollisionBB, boundary) {
        let top = Collision.topCollision(collisionBB, originalCollisionBB, boundary.BB);
        if (top) return top;
        let bottom = Collision.bottomCollision(collisionBB, originalCollisionBB, boundary.BB);
        if (bottom) return bottom;
        let left = Collision.leftCollision(collisionBB, originalCollisionBB, boundary.BB);
        if (left) return left;
        let right = Collision.rightCollision(collisionBB, originalCollisionBB, boundary.BB);
        if (right) return right;
    };

    static resolveCollision(entity, boundary) {
        let collisionResolution = Collision.collide(entity.collisionBB, entity.originalCollisionBB, boundary);
        if (collisionResolution) {
            if (collisionResolution.x !== 0) {
                entity.velocity.x = 0;
                if (collisionResolution.x < 0) {
                    entity.x = boundary.BB.left - entity.collisionBB.width - (entity.BB.right - entity.collisionBB.right);
                } else if (collisionResolution.x > 0) {
                    entity.x = boundary.BB.right - (entity.collisionBB.left - entity.BB.left);
                }
            } else if (collisionResolution.y !== 0) {
                entity.velocity.y = 0;
                if (collisionResolution.y > 0) {
                    entity.y = boundary.BB.bottom - (entity.collisionBB.top - entity.BB.top);
                } else if (collisionResolution.y < 0) {
                    entity.y = boundary.BB.top - entity.collisionBB.height - (entity.collisionBB.top - entity.BB.top);
                }
            }
        } 
    };
};