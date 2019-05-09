//Work Cites:I used a lot of code that I wrote in my first assignment. Besides that, all the works had been created by myselves.



var game = new Phaser.Game(600, 800, Phaser.AUTO);

var MainMenu = function(game) {};
MainMenu.prototype = {
    preload: function() {
        //console.log('MainMenu: preload');
        game.load.image('sky', 'assets/img/sky.png');
        game.load.image('ground', 'assets/img/platform.png');
        game.load.image('snow', 'assets/img/firstaid.png');
        game.load.spritesheet('dude', 'assets/img/dude.png', 32, 48);
        game.load.audio('scream', 'assets/audio/scream.mp3');//audio from https://www.freesoundeffects.com/free-sounds/screams-10094/
        game.load.audio('bgm', 'assets/audio/bgm.mp3');//audio from https://www.bensound.com/royalty-free-music/track/summer-chill-relaxed-tropical
    },
    create: function() {
        //console.log('MainMenu: create');
        game.stage.backgroundColor = "#facade";
        var instructionText = game.add.text(30,30,'Press Space to Start! \n Keyboard to Control \n Space to Jump \n Stay on the platforms!');
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
    var scream1;
    var ledge1;
    var ledge2;
    var ledge3;
    var ledge4;
    var ledge5;
    var bgm1;
    
    this.score = 0;
    var scoreText;
};

Play.prototype = {
    preload: function() {
    },

    create: function() {
        this.score = 0;
        //Enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Background adding
        var background = game.add.image(300,300,'sky');
        background.anchor.setTo(0.5,0.5);//set the anchor of the image to the center of the screen
        background.scale.setTo(1.5,2);//scale the background

        scream1 = game.add.audio('scream');
        bgm1 = game.add.audio('bgm');
        bgm1.loop = true;
        bgm1.play();


        //Platforms rule
        platforms = game.add.group();

        //Enable the physics of the objects that created
        platforms.enableBody = true;


        //Creating ledges

        ledge1 = platforms.create(590, 150, 'ground');
        ledge1.scale.setTo(0.5,1);
        ledge1.body.velocity.y = 40;
        ledge1.body.velocity.x = 150;
        ledge1.body.immovable = true; //Make the ledge solid
      
        ledge2 = platforms.create(470, 310, 'ground');
        ledge2.scale.setTo(0.5,1);
        ledge2.body.velocity.y = 40;
        ledge2.body.velocity.x = 140;
        ledge2.body.immovable = true;

        ledge3 = platforms.create(350, 470, 'ground');
        ledge3.scale.setTo(0.5,1);
        ledge3.body.velocity.y = 40;
        ledge3.body.velocity.x = 130;
        ledge3.body.immovable = true;

        ledge4 = platforms.create(230, 630, 'ground');
        ledge4.scale.setTo(0.5,1);
        ledge4.body.velocity.y = 40;
        ledge4.body.velocity.x = 120;
        ledge4.body.immovable = true;

        ledge5 = platforms.create(110, 790, 'ground');
        ledge5.scale.setTo(0.5,1);
        ledge5.body.velocity.y = 40;
        ledge5.body.velocity.x = 110;
        ledge5.body.immovable = true;

        //Player setting
        player = game.add.sprite(300, game.world.height - 500, 'dude');

        //Player physics
        game.physics.arcade.enable(player);

        player.body.bounce.y = 0.2;
        player.body.gravity.y = 1000;

        //Animation for the player
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);


  
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
            //Reset players' velocity
            player.body.velocity.x = 0;

            if(player.body.x>game.width){
                player.body.x = 0;
            }

            if(player.body.x < 0){
                player.body.x = game.width;
            }

            if (cursors.left.isDown){
                //Move to the left
                player.body.velocity.x = -300;

                player.animations.play('left');

            }else if (cursors.right.isDown){
                //Move to the right
                player.body.velocity.x = 300;

                player.animations.play('right');
            }else{
                //Stand
                player.animations.stop();

                player.frame = 4;
            }
    
            // Allow jumping if touching the ground
            if (cursors.up.isDown && player.body.touching.down && hitPlatform){
                player.body.velocity.y = -800;
            }

            //make the ledges looping
            if (ledge1.body.y >= game.height){
                this.score += 10;
                scoreText.text = 'Score: ' + this.score;//every time it reach the bottom, at on the score
                ledge1.body.y = 0;
                ledge1.body.velocity.y += 20;//add the speed make it more changelling
            }
            if (ledge2.body.y >= game.height){
                this.score += 10;
                scoreText.text = 'Score: ' + this.score;
                ledge2.body.y = 0;
                ledge2.body.velocity.y += 20;
            }
            if (ledge3.body.y >= game.height){
                this.score += 10;
                scoreText.text = 'Score: ' + this.score;
                ledge3.body.y = 0;
                ledge3.body.velocity.y += 20;
            }
            if (ledge4.body.y >= game.height){
                this.score += 10;
                scoreText.text = 'Score: ' + this.score;
                ledge4.body.y = 0;
                ledge4.body.velocity.y += 20;
            }
            if (ledge5.body.y >= game.height){
                this.score += 10;
                scoreText.text = 'Score: ' + this.score;
                ledge5.body.y = 0;
                ledge5.body.velocity.y += 20;
            }

            //if ledges hit the bound, goes back
            if (ledge1.body.x > game.width){
                ledge1.body.velocity.x = -150;
            }else if(ledge1.body.x < 0){
                ledge1.body.velocity.x = 150;
            }

            if (ledge2.body.x > game.width){
                ledge2.body.velocity.x = -140;
            }else if(ledge2.body.x < 0){
                ledge2.body.velocity.x = 140;
            }

            if (ledge3.body.x > game.width){
                ledge3.body.velocity.x = -130;
            }else if(ledge3.body.x < 0){
                ledge3.body.velocity.x = 130;
            }

            if (ledge4.body.x > game.width){
                ledge4.body.velocity.x = -120;
            }else if(ledge4.body.x < 0){
                ledge4.body.velocity.x = 120;
            }

            if (ledge5.body.x > game.width){
                ledge5.body.velocity.x = -110;
            }else if(ledge5.body.x < 0){
                ledge5.body.velocity.x = 110;
            }
            
            if (player.body.y > game.height){
                bgm1.stop();
                scream1.play();
                game.state.start('GameOver',true, false, this.score);
            }
        }

}



var GameOver = function(game) {
    this.scoreOver;
};
GameOver.prototype = {
    init:function(score){
        this.scoreOver = score;
    },
    create: function() {
        game.stage.backgroundColor = "#facade";

        //create different result
        if(this.scoreOver <= 100 && this.scoreOver>30){
            var instructionText1 = game.add.text(30,30,'That was an accident wasnt it? \nScore:' + this.scoreOver + '\nPress Space to restart!');
        }else if(this.scoreOver<=30){
            var instructionText2 = game.add.text(30,30,'Seriously? \nScore:' + this.scoreOver + '\nPress Space to restart!');
        }else if(this.scoreOver>100 && this.scoreOver<=200){
            var instructionText3 = game.add.text(30,30,'Not bad! \nScore:' + this.scoreOver + '\nPress Space to restart!');
        }else if(this.scoreOver>200 && this.scoreOver<=300){
            var instructionText4 = game.add.text(30,30,'Well played! \nScore:' + this.scoreOver + '\nPress Space to restart!');
        }else{
            var instructionText3 = game.add.text(30,30,'You are Epic!!! \nScore:' + this.scoreOver + '\nPress Space to restart!');
        }
 
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