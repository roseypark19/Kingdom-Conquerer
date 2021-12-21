let gameEngine = new GameEngine();

let ASSET_MANAGER = new AssetManager();

// sprites
ASSET_MANAGER.queueDownload("./sprites/barbarian/barbarian.png");
ASSET_MANAGER.queueDownload("./sprites/barbarian/beams.png");
ASSET_MANAGER.queueDownload("./sprites/slime_green/slime_green.png");

ASSET_MANAGER.downloadAll(function () {
	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;
	gameEngine.init(ctx);

	new SceneManager(gameEngine);

	gameEngine.start();	

});
