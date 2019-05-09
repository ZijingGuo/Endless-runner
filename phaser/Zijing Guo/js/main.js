var game = new Phaser.Game(600, 800, Phaser.AUTO);

//5103642101

var MainMenu = function(game) {};
MainMenu.prototype = {
    preload: function() {
        //console.log('MainMenu: preload');
        game.load.image('sky', 'assets/img/sky.png');
        game.load.image('ground', 'assets/img/platform.png');
        game.load.image('star', 'assets/img/star.png');
        game.load.image('diamond', 'assets/img/diamond.png');
        game.load.image('snow', 'assets/img/firstaid.png');
        game.load.spritesheet('dude', 'assets/img/dude.png', 32, 48);
        game.load.spritesheet('baddie', 'assets/img/baddie.png', 32, 32);
        game.load.audio('scream', 'assets/audio/scream.mp3');//audio from https://www.freesoundeffects.com/free-sounds/screams-10094/
    },
    create: function() {
        //console.log('MainMenu: create');
        game.stage.backgroundColor = "#facade";
        var instructionText = game.add.text(30,30,'Press Space to Start! \n Do not die');
    },
    update: function() {
        // main menu logic
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            game.state.start('Play');
        }
    }
}
//Define Play state
var Play = function(game) {
    var player;
    var platforms;
    var cursors;
    var dog;
    var cat;
    var scream1;

    var stars;
    var diamond;
    this.score = 0;
    var scoreText;
};

Play.prototype = {
    preload: function() {
        //console.log('GamePlay: preload');
    },
    create: function() {
        //console.log('GamePlay: create');
        //game.stage.backgroundColor = "#ccddaa";
        //Enable the Arcade Physics system
        this.score = 0;
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Background adding
        var background = game.add.image(300,300,'sky');
        background.anchor.setTo(0.5,0.5);//set the anchor of the image to the center of the screen
        background.scale.setTo(1.5,2);//scale the background

        scream1 = game.add.audio('scream');

        //Platforms rule
        platforms = game.add.group();

        //Enable the physics of the objects that created
        platforms.enableBody = true;

        //Creat the ground
        var ground = platforms.create(0, game.world.height - 64, 'ground');

        //Scale it to the size of the game
        ground.scale.setTo(2, 2);

        //Make the ground solid
        ground.body.immovable = true;

        //Creating ledge
        var ledge = platforms.create(400, 400, 'ground');
        ledge.body.immovable = true; //Make the ledge solid
      
        ledge = platforms.create(450, 150, 'ground');
        ledge.body.immovable = true;

        ledge = platforms.create(-250, 270, 'ground');
        ledge.body.immovable = true;

        ledge = platforms.create(-150, 600, 'ground');
        ledge.body.immovable = true;

        //Player setting
        player = game.add.sprite(32, game.world.height - 150, 'dude');

        //Player physics
        game.physics.arcade.enable(player);

        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;

        //Animation for the player
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

      //Add baddie
        dog = game.add.sprite(500,100,'baddie');
        game.physics.arcade.enable(dog);   
        dog.body.gravity.y = 300; //add gravity
        dog.body.collideWorldBounds = true; //make solid
        dog.animations.add('walk',[0,1], 10, true);// add animation
        dog.animations.play('walk');
        //Add the second one 
        cat = game.add.sprite(100,400,'baddie');
        game.physics.arcade.enable(cat);   
        cat.body.gravity.y = 300;
        cat.body.collideWorldBounds = true;
        cat.animations.add('run',[2,3], 10, true);
        cat.animations.play('run');


        //Stars adding
        stars = game.add.group();

        //Physic for stars
        stars.enableBody = true;

        //Creat the star space apart
        for (var i = 0; i < 12; i++){
            var star = stars.create(i * 70, 0, 'star');

            star.body.gravity.y = 300;//gravity of the star

            star.body.bounce.y = 0.7 + Math.random() * 0.2;//give a random bonunce
        }

        //Diomand adding
        diamond = game.add.group();

        //physic for diomand
        diamond.enableBody = true;

        //creat in random position
        for (var j = 0; j < 3; j++){
            var diamonds = diamond.create(Math.random()*500,Math.random()*200,'diamond');

            diamonds.body.bounce.y = 0.7 + Math.random() * 0.2;//give a random bonunce
        }

        for(var z = 0; z < 100; z++){
            var snow = new snowstorm(game,'snow', 0.5, Math.PI);
            game.add.existing(snow);
        }

        //Score showing
        scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        //Control
        cursors = game.input.keyboard.createCursorKeys();
        },
        update: function() {
            var hitPlatform = game.physics.arcade.collide(player, platforms);
            game.physics.arcade.collide(stars, platforms);//check star
            game.physics.arcade.collide(diamond, platforms);//check diamond
            game.physics.arcade.collide(dog, platforms);//check dog
            game.physics.arcade.collide(cat, platforms);//check cat

            game.physics.arcade.overlap(player, stars, collectStar, null, this);//eat star

            game.physics.arcade.overlap(player, diamond, collectDiamond, null, this);//eat diamond

            game.physics.arcade.overlap(player, dog, poorDog, null, this);//eat dog

            game.physics.arcade.overlap(player, cat, poorCat, null, this);//eat cat

            //Reset players' velocity
            player.body.velocity.x = 0;

            if (cursors.left.isDown){
                //Move to the left
                player.body.velocity.x = -150;

                player.animations.play('left');

            }else if (cursors.right.isDown){
                //Move to the right
                player.body.velocity.x = 150;

                player.animations.play('right');
            }else{
                //Stand
                player.animations.stop();

                player.frame = 4;
            }
    
            // Allow jumping if touching the ground
            if (cursors.up.isDown && player.body.touching.down && hitPlatform){
                player.body.velocity.y = -350;
            }
            if (this.score == 240){
                game.state.start('Win',true, false, this.score);
            }
        }

}

function collectStar (player, star) {
    
    // Removes the star 
    star.kill();
    scream1.play();
    //  Add and update the score
    this.score += 10;
    scoreText.text = 'Score: ' + this.score;

}

function collectDiamond (player, diamond) {
    
    // Removes diamond
    diamond.kill();

    //  Add and update the score
    this.score += 50;
    scoreText.text = 'Score: ' + this.score;

}

function poorDog (player, dog) {

    // Removes poor Dog
    dog.kill();
    // Decrease the score
    this.score -= 25;
    scoreText.text = 'Score: ' + this.score;
    game.state.start('GameOver',true, false, this.score);
}

function poorCat (player, cat) {

    // Removes poor Cat
    cat.kill();
    // Decrease the score
    this.score -= 25;
    scoreText.text = 'Score: ' + this.score;
    game.state.start('GameOver',true, false, this.score);
}

var GameOver = function(game) {
    this.scoreOver;
};
GameOver.prototype = {
    init:function(score){
        this.scoreOver = score;
    },
    create: function() {
        //console.log('MainMenu: create');
        game.stage.backgroundColor = "#facade";
        var instructionText = game.add.text(30,30,'How could you die on this silly game? \nScore:' + this.scoreOver + '\nPress Space to restart!');
    },
    update: function() {
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            game.state.start('Play');
        }
    }
}

var Win = function(game) {
    this.scoreOver;
};
Win.prototype = {
    init:function(score){
        this.scoreOver = score;
    },
    create: function() {
        //console.log('MainMenu: create');
        game.stage.backgroundColor = "#facade";
        var instructionText = game.add.text(30,30,'You won this! \nScore:' + this.scoreOver + '\nPress Space to restart!');
    },
    update: function() {
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            game.state.start('Play');
        }
    }
}


//game states
game.state.add('MainMenu', MainMenu);
game.state.add('Play', Play);
game.state.add('GameOver', GameOver);
game.state.add('Win',Win);
game.state.start('MainMenu');