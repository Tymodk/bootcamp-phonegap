//Variables
var currentScore = 0;
var scoreTick = 1;
var scoreText;
var gameDelay = 4000;
var coinText;
var currentCoins = 0;

//Fire
var fireballs;
var fireDelay = 400;
var fireDelayMin = 100;
var lastFireballFired = gameDelay - fireDelay;
var fireballSpeed = 250;

//Pickup Text
var pickUpNr;
var pickUpTextFD;
var pickUpTextFS;
var pickUpTextYS;
var pickUpTextTime;

//Player
var yoshiSpeed = 250;
var enemies;


//Wave Manager
var spawnDelay = 3000;
var minSpawnDelay = 1000;
var lastWaveSpawned = gameDelay * 1.2 - spawnDelay;
var velYMultiplier = 0;
var spacingYMultiplier = 1;

var wave1;
var wave2;
var wave3;
var wave4;

var wave1Max = 5;
var wave2Max = 5;
var wave3Max = 5;
var wave4Max = 5;
var stage;
var minAmount = 1;
var maxAmount = 5;
var maxMinAmount = 4;
var velYMultiplier;



MyGame.playGameState = function (game) {};

MyGame.playGameState.prototype = {

  create: function()
  {      
      game.physics.startSystem(Phaser.Physics.ARCADE);

      //Reset Variables on New Game
      game.time.now = 0;
      currentScore = 0;
      currentCoins = 0;
      fireDelay = 400;
      fireballSpeed = 250;
      yoshiSpeed = 250;

      //WaveManager Resets
      wave1 = 0;
      wave2 = 0;
      wave3 = 0;
      wave4 = 0;
      stage = 1;
      minAmount = 1;
      maxAmount = 3;
      velYMultiplier = 0;
      spawnDelay = 3000;
      spacingYMultiplier = 1;




      //Backgrounds
      // this.hidden = this.add.tileSprite(0, 0, 600, 800, 'sky-boss');
      this.background = game.add.tileSprite(0, 0, 600, 800, 'sky');
      this.background.tilePosition.y = backgroundPos;

      // this.skyboss = this.add.tileSprite(0, 0, 600, 800, 'sky-boss');
      // this.skyboss.alpha = 0;
      // this.add.tween(this.skyboss).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true,  9000, 1000, true);


//      this.goomba = this.add.sprite(100, 50, 'goomba');
//      this.goomba.animations.add('goomba-fly', [0,1,2,1,0]);

      //Player
      this.generatePlayer(yoshiPosX, yoshiPosY);
      //Enemies
      enemies = game.add.group();
      enemies.enableBody = true;

      //Score
      var scoreBack = game.add.image(0, 0, 'scoreBackground');
      scoreText = game.add.text( 4, 4, 'score: 0',{font: 'Pixel' ,fontSize: '24px', fill: '#fff'});
      coinText = game.add.text( game.world.centerX + 50, 4, 'coins: 0',{font: 'Pixel' ,fontSize: '24px', fill: '#fff'});

      //Fireballs
      fireballs = game.add.group();
      fireballs.enableBody = true;

      //PickUps
      blocks = game.add.group();
      blocks.enableBody = true;
      coins = game.add.group();
      coins.enableBody = true;

      //SFX
      coinSound = game.add.audio('coinSound');
      blockSound = game.add.audio('blockSound');
      fireSmallSound = game.add.audio('fireSmallSound');
      deathSound = game.add.audio('deathSound');
      if(soundEnabled){
          music.mute = false;
      }
      else{
          music.mute = true;
      }

      //Fireball
      //      this.fireballbig = this.add.sprite(this.yoshi.position.x, this.yoshi.position.y +100, 'fireball-big');
      //      this.fireballbig.animations.add('woosh', [0,1]);
      //      this.fireballbigger = this.add.sprite(this.yoshi.position.x, this.yoshi.position.y +200, 'fireball-bigger');
      //      this.fireballbigger.animations.add('woosh2', [0,1]);

      // scoreTimer
      game.time.events.loop(Phaser.Timer.SECOND / 1000 , this.addScore);

      //pick up text
      pickUpTextFD = game.add.text(game.world.centerX, game.world.centerY, 'FIRE DELAY DOWN', {font: 'Pixel', fontSize: '28px', fill: '#fff'});
      pickUpTextFD.anchor.set(0.5);
      pickUpTextFD.visible = false;
      pickUpTextFS = game.add.text(game.world.centerX, game.world.centerY, 'FIRE SPEED UP', {font: 'Pixel', fontSize: '28px', fill: '#fff'});
      pickUpTextFS.anchor.set(0.5);
      pickUpTextFS.visible = false;
      pickUpTextYS = game.add.text(game.world.centerX, game.world.centerY, 'YOSHI SPEED UP', {font: 'Pixel', fontSize: '28px', fill: '#fff'});
      pickUpTextYS.anchor.set(0.5);
      pickUpTextYS.visible = false;
  },

  addScore: function () {
    currentScore += scoreTick;
  },

  update: function()
  {
    //Move Background
    this.background.tilePosition.y += 2;
    // this.skyboss.tilePosition.y += 2;
    // this.hidden.tilePosition.y += 2;

    //Score
    scoreText.text = 'score: ' + currentScore;
    coinText.text = 'coins: ' + currentCoins;

    //Fire
    this.fireSequence();


  //    this.goomba.animations.play('goomba-fly', 7, true, false);
      game.physics.arcade.overlap(fireballs, enemies, this.destroyEnemy, null, this);
      game.physics.arcade.overlap(this.yoshi, enemies, this.gameOverScreen, null, this);
      game.physics.arcade.overlap(this.yoshi, coins, this.getCoin, null, this);
      game.physics.arcade.overlap(this.yoshi, blocks, this.getBlock, null, this);



  // if(game.time.now > 21000)
  //     {
  //         this.background.alpha = 0;
  //     }

    if (Phaser.Rectangle.contains(this.yoshi.body, game.input.x, game.input.y))
      {
        this.yoshi.body.velocity.setTo(0, 0);
      }
    else{
    	if(this.yoshi.y < game.height - 100){
    		game.physics.arcade.moveToPointer(this.yoshi, yoshiSpeed);
    	}
    	else{
    		this.yoshi.body.velocity.y = 0;
    		if (Phaser.Rectangle.contains(this.yoshi.body, game.input.x, game.input.y)){
        		this.yoshi.body.velocity.setTo(0, 0);
      		}
      		else if(game.input.mousePointer.y < game.height - 100){
                game.physics.arcade.moveToPointer(this.yoshi, yoshiSpeed);
            }
    		else if(this.yoshi.x > 20 && game.input.mousePointer.x < game.width - 20){
    			if(game.input.mousePointer.x < this.yoshi.x){
    				this.yoshi.body.velocity.x = -yoshiSpeed;
    			}
    			else{
    				this.yoshi.body.velocity.x = yoshiSpeed;
    			}
    		}
    	}
    }
    if(this.yoshi.x < 20){
    	this.yoshi.x = 20;
    	this.yoshi.body.velocity.x = 0;
    }

    if(this.yoshi.x > game.width - 20){
    	this.yoshi.x = game.width - 20;
    	this.yoshi.body.velocity.x = 0;
    }
    
     //Waves
     this.waveManager();

     //PickUpText
     if(pickUpTextTime + 2000 > game.time.now ){
    		pickUpTextFD.visible = false;
    		pickUpTextFS.visible = false;
    		pickUpTextYS.visible = false;
    	}
  },

  generatePlayer: function(x, y) {
    this.yoshi = this.add.sprite(x, y, 'yoshi');

    this.yoshi.animations.add('ani', [0,1,2,3]);
    this.yoshi.anchor.setTo(0.5, 0.5);
    this.yoshi.scale.setTo(1.75,1.75);
    
    game.physics.enable(this.yoshi, Phaser.Physics.ARCADE);
    this.yoshi.body.width = 25;
    this.yoshi.body.height = 45;
    this.yoshi.animations.play('ani', 6, true, false);
    },

  fireSequence: function(){
    if(game.time.now > (lastFireballFired + fireDelay))
      {
          this.generateFireball();
      }
  },

generateFireball: function() {
    var fireball = fireballs.create(this.yoshi.position.x-10, this.yoshi.position.y-30, 'fireball-mini');

    fireball.animations.add('spin', [0,1,2,3]);
    fireball.animations.play('spin', 8, true, false);
    game.physics.enable(fireball, Phaser.Physics.ARCADE);
    fireball.body.width = 25;
    fireball.body.height = 25;
    fireball.events.onOutOfBounds.add( function(){ fireball.kill(); } );
    fireball.checkWorldBounds = true;
    fireball.body.velocity.y = - fireballSpeed;
    lastFireballFired = game.time.now;
    fireSmallSound.play();

  },

generateEnemy: function(posX, posY, velX, velY, enemyName, health)
{
    var enemy = enemies.create(posX, posY, enemyName); //position, sprite
    var enemyHealth = health;
    enemy.animations.add(enemyName + '-ani', [0,1,2,3,4,5,6,7,8,9]); //Animation frames still hardcoded
    enemy.animations.play(enemyName + '-ani', 10, true, false);
    game.physics.enable(enemy, Phaser.Physics.ARCADE);
    enemy.anchor.setTo(0.5, 0.5);
    enemy.events.onOutOfBounds.add( function(){ enemy.kill(); } );
    enemy.body.velocity.y = velY;
    enemy.body.velocity.x =  velX;
  },

  generateExplosion: function(x, y) {
    this.explosion = this.add.sprite(x, y, 'explosion');
    this.explosion.animations.add('explosion-boom', [0,1,2,3,4,5,6,7,8]);
    this.explosion.animations.play('explosion-boom', 9, false, true);
    this.explosion.anchor.setTo(0.5, 0.5);
    this.explosion.scale.setTo(1.5,1.5);
    deathSound.play();

    },

    //PICKUP FUNCTION RANDOMIZE
    generatePickUp: function(x,y){
        var random =  game.rnd.integerInRange(0,100);
        if(random < 5){
            var block = blocks.create(x,y,'questionblock');
            block.animations.add('block-spin', [0,1,2,3]);
            block.animations.play('block-spin', 5, true, false);
            game.physics.enable(block, Phaser.Physics.ARCADE);
            block.body.velocity.y = 100;
        }
        else{
            var coin = coins.create(x,y,'coin');
            coin.animations.add('coin-spin', [0,1,2,3]);
            coin.animations.play('coin-spin', 5, true, false);
            game.physics.enable(coin, Phaser.Physics.ARCADE);
            coin.body.velocity.y = 100;
        }
    },
  damageEnemy: function(fireball, enemy) { //fireballs, koopa
      fireball.kill();
      enemy.kill();
      //damage enemy, if enemy health = 0 -> call destroyEnemy
    },
  destroyEnemy: function(fireball, enemy) { //fireballs, koopa
      currentScore += 1000;
      fireball.kill();
      game.physics.enable(enemy, Phaser.Physics.ARCADE);


      this.generateExplosion(enemy.centerX, enemy.centerY);
      this.generatePickUp(enemy.centerX, enemy.centerY);
      enemy.events.onOutOfBounds.add( function(){ enemy.kill(); } );
      enemy.allowGravity = true;
      enemy.body.gravity.y = 400;
      if(enemy.centerX < 240){
      enemy.body.velocity.x = -200;}
      else{
          enemy.body.velocity.x = 200;
      }
      enemy.body.velocity.y = 25;

      enemy.body.checkCollision.up = false;
      enemy.body.checkCollision.down = false;
      enemy.body.checkCollision.left = false;
      enemy.body.checkCollision.right = false;

      enemy.angle += 180;


    },

    getCoin: function(yoshi, coin) {
      coin.kill();
      currentCoins += 1;
      coinSound.play();
    },

    getBlock: function(yoshi, block) {
      block.kill();
      var random =  game.rnd.integerInRange(0,2);
        if(random == 0 && fireDelay > fireDelayMin){
            fireDelay /= 1.1;
            pickUpNr = 0;
        }
        if(random==1){
            fireballSpeed += 25;
            pickUpNr = 1;
        }
        if(random==2){
            yoshiSpeed += 50;
            pickUpNr = 2;
        }
        this.pickUpNotification();
        blockSound.play();
    },
    pickUpNotification: function(){
    	pickUpTextTime = game.time.now;
    	if(pickUpNr == 0){
    		pickUpTextFS.visible = false;
    		pickUpTextYS.visible = false;
    		pickUpTextFD.visible = true;
    	}
    	if(pickUpNr == 1){
    		pickUpTextFD.visible = false;
    		pickUpTextYS.visible = false;
    		pickUpTextFS.visible = true;
    	}
    	if(pickUpNr == 2){
    		pickUpTextFD.visible = false;
    		pickUpTextFS.visible = false;
    		pickUpTextYS.visible = true;
    	}
    },


//WAVEMANAGER
  waveManager: function()
  {
  //Amount of Enemies spawned, spacingX between Enemies spawned, startXposition, startYposition, velX, velY, enemyName
  var amount = this.getRndInteger(minAmount, maxAmount); //1 to 5
  var startX = this.getRndInteger(0, 250);
  var velX = 30;
  var spacingX = 85;
  var spacingY = 0;
  velY = this.getRndInteger((100 + velYMultiplier), (300 + velYMultiplier));


  //Wave 1
    if(game.time.now > (lastWaveSpawned + spawnDelay) && wave1 < wave1Max)
      {
        this.spawnWave(amount, spacingX, spacingY, 50, 30, 30, 150, 'koopa');
        amount = this.getRndInteger(minAmount, maxAmount);
        this.spawnWave(amount, spacingX - 15, spacingY + spacingYMultiplier, 300, 30, -50, 200, 'goomba');

        wave1++;
      }
  //Wave 2
  if(wave1 == wave1Max && game.time.now > (lastWaveSpawned + spawnDelay) && wave2 < wave2Max)
    {
      amount = this.getRndInteger(minAmount, maxAmount);

      this.spawnWave(amount, spacingX - 15, spacingY + spacingYMultiplier, 50, 30, velX, velY, 'goomba');

      amount = this.getRndInteger(minAmount, maxAmount);
      startX = this.getRndInteger(150, 300);
      velY = this.getRndInteger((150 + velYMultiplier), (350 + velYMultiplier));

      this.spawnWave(amount, spacingX, spacingY, startX, 30, -50, velY, 'koopa');

      wave2++;
    }
    //When both waves are completed, repeat but more difficult
    if (wave1 == wave1Max && wave2 == wave2Max) {
      wave1 = 0;
      wave2 = 0;
      spacingYMultiplier += 5;
      velYMultiplier += 50;
      velX += 50;
      if (spawnDelay > minSpawnDelay) { //Increase spawn rate till limit
        spawnDelay /= 1.2;
      }
      if( minAmount <= maxMinAmount) { //Increase Amounts till limit
        minAmount += 0.5; maxAmount += 0.25;
      }
      stage++;

      console.log('round: ' + stage);
      console.log('spawn delay: ' + spawnDelay);
      console.log('spacing Y multiplier: ' + spacingYMultiplier);
      console.log('velocity Y multiplier: ' + velYMultiplier);
      console.log('min amount: ' + minAmount);
      console.log('max amount: ' + maxAmount);
      console.log('fire Delay: ' + fireDelay);
      console.log('fire ball speed: ' + fireballSpeed);
      console.log('yoshi Speed: ' + yoshiSpeed);
      console.log('\n');

    }
  },

  getRndInteger: function(min, max) {
      return Math.floor(Math.random() * (max - min) ) + min;
  },

  spawnWave: function(amount, spacingX, spacingY, startX, startY, velX, velY, enemyName){
    for (var i = 0; i < amount ; i ++) {
      this.generateEnemy(startX + (spacingX * i), startY - (spacingY * i), velX, velY, enemyName); //posX, posY, velX, velY, enemyName
    }
    lastWaveSpawned = game.time.now;
  },



  gameOverScreen: function(){
     backgroundPos = this.background.tilePosition.y;
     yoshiPosX = this.yoshi.world.x;
    yoshiPosY = this.yoshi.world.y;

    this.state.start('death', true, false, currentScore, currentCoins);
  }


}
