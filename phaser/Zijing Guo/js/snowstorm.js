function snowstorm(game, key, scale, rotation) {
	Phaser.Sprite.call(this, game, game.rnd.integerInRange(64,game.width-64), game.rnd.integerInRange(64,game.height-61), key);

	// add custom properties
	this.anchor.set(0.5);
	this.scale.x = scale;
	this.scale.y = scale;
	this.rotation = rotation;

	// put some physics on it
	game.physics.enable(this);
	this.body.angularVelocity = game.rnd.integerInRange(-180,180);
	this.body.velocity.x = game.rnd.integerInRange(10,500);
	this.body.velocity.y = game.rnd.integerInRange(10,500);
	this.alpha = 0.4;
}
// explicitly define prefab's prototype (Phaser.Sprite) and constructor (Player)

snowstorm.prototype = Object.create(Phaser.Sprite.prototype);
snowstorm.prototype.constructor = snowstorm;


// override Phaser.Sprite update (to spin the object)
snowstorm.prototype.update = function() {
	if(game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
		this.body.angularVelocity += 5;
	}
	if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
		this.body.angularVelocity -= 5;
	}

	if(this.body.x > 600){
		this.body.x = 0;
	}else if(this.body.x < 0){
		this.body.x = 600;
	}

	if(this.body.y > 800){
		this.body.y = 0;
	}else if(this.body.y <0){
		this.body.y = 800;
	}

	if(game.input.keyboard.isDown(Phaser.Keyboard.R)){
		this.body.velocity.x = -this.body.velocity.x;
	}
}
