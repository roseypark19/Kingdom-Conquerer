let gameEngine = new GameEngine();

let ASSET_MANAGER = new AssetManager();

// sprites
ASSET_MANAGER.queueDownload("./sprites/barbarian/barbarian.png");
ASSET_MANAGER.queueDownload("./sprites/barbarian/beams.png");
ASSET_MANAGER.queueDownload("./sprites/slime/slime_green.png");
ASSET_MANAGER.queueDownload("./sprites/slime/slime_mother_green.png");
ASSET_MANAGER.queueDownload("./sprites/slime/slime_blue.png");
ASSET_MANAGER.queueDownload("./sprites/slime/slime_mother_blue.png");
ASSET_MANAGER.queueDownload("./sprites/minotaur/minotaur.png");
ASSET_MANAGER.queueDownload("./sprites/skeleton/skeleton.png");
ASSET_MANAGER.queueDownload("./sprites/projectiles/arrow.png");
ASSET_MANAGER.queueDownload("./sprites/orc/orc_bow.png");
ASSET_MANAGER.queueDownload("./sprites/trasgo/trasgo.png");
ASSET_MANAGER.queueDownload("./sprites/ogre/ogre.png");
ASSET_MANAGER.queueDownload("./sprites/level/cliff.png");
ASSET_MANAGER.queueDownload("./sprites/level/floor.png");
ASSET_MANAGER.queueDownload("./sprites/level/shadows.png");
ASSET_MANAGER.queueDownload("./sprites/level/walls.png");
ASSET_MANAGER.queueDownload("./sprites/gui/panels_slots.png");

// audio
ASSET_MANAGER.queueDownload("./audio/dungeon.mp3");
ASSET_MANAGER.queueDownload("./audio/hero_death.mp3");
ASSET_MANAGER.queueDownload("./audio/minotaur_ogre_hit.mp3");
ASSET_MANAGER.queueDownload("./audio/minotaur_ogre_death.mp3");
ASSET_MANAGER.queueDownload("./audio/orc_hit.mp3");
ASSET_MANAGER.queueDownload("./audio/orc_death.mp3");
ASSET_MANAGER.queueDownload("./audio/skeleton_hit.mp3");
ASSET_MANAGER.queueDownload("./audio/skeleton_death.mp3");
ASSET_MANAGER.queueDownload("./audio/slime_hit.mp3");
ASSET_MANAGER.queueDownload("./audio/slime_death.mp3");
ASSET_MANAGER.queueDownload("./audio/sword.mp3");
ASSET_MANAGER.queueDownload("./audio/trasgo_hit.mp3");
ASSET_MANAGER.queueDownload("./audio/trasgo_death.mp3");
ASSET_MANAGER.queueDownload("./audio/hero_hit.mp3");
ASSET_MANAGER.queueDownload("./audio/lightning.mp3");
ASSET_MANAGER.queueDownload("./audio/victory.mp3");

ASSET_MANAGER.downloadAll(function () {
	let canvas = document.getElementById('gameWorld');
	let ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;
	ASSET_MANAGER.autoRepeat("./audio/dungeon.mp3");
	gameEngine.init(ctx);

	new SceneManager(gameEngine);

	gameEngine.start();	

});
