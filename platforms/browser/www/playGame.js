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
var fireDelayMin = 200;
var lastFireballFired = gameDelay - fireDelay;
var fireballSpeed = 250;
var maxFireballSpeed = 750;
var typeFire = 'normal';
var playerDamage = 1;
//Pickup Text
var pickUpNr;
var pickUpTextFD;
var pickUpTextFS;
var pickUpTextYS;
var pickUpTextTime;
//Player
var yoshiSpeed = 250;
var maxYoshiSpeed = 600;
var hasStar = false;
var starLength = 0;
var yoshiStarBonus = 1.5;
//Enemies
var enemies;
var globalHealthMultiplier = 0;
var bossSpawned = false;
var bossSpawnTimerStarted = false;
//Boss
var bosses;
var bossSpawnRound = 1;
var bossHealth = 30;
var bossIsAlive = false;
var bossSpawnWaitTime = 5;
var throwTime = 0;
var throwDelay = 500;
var bossThrowChance = 500;
//Wave Manager
var spawnDelay = 3000;
var minSpawnDelay = 1500;
var lastWaveSpawned = gameDelay * 1.2 - spawnDelay;
var permanentSpawn = 0;
//Spawn Chances
var permanentSpawnDelay = 2000; // ms delay between perm. spawn
var spawnBooChance = 150; // chance on 1000 every spawn
var bulletChance = 100; // chance on 1000 every spawn
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
var round;
var minAmount = 1;
var maxAmount = 5;
var maxMinAmount = 4;
var velYMultiplier;
//tween
var tween;
var tweenSky;
var warning;
//initiating state
MyGame.playGameState = function (game) {};
MyGame.playGameState.prototype = {
  create: function(){
    //initiating physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //Reset Variables on New Game
    game.time.now = 0;
    currentScore = 0;
    currentCoins = 0;
    typeFire = 'normal';
    fireDelay = 400;
    fireballSpeed = 250;
    yoshiSpeed = 250;
    yoshiStarBonus = 1.5;
    //Enemies reset
    globalHealthMultiplier = 0;
    bossSpawnRound = 1;
    bossIsAlive = false;
    bossSpawned = false;
    bossSpawnTimerStarted = false;
    throwTime = 0;
    throwDelay = 500
    //WaveManager Resets
    wave1 = 0;
    wave2 = 0;
    wave3 = 0;
    wave4 = 0;
    round = 1;
    minAmount = 1;
    maxAmount = 3;
    velYMultiplier = 0;
    spawnDelay = 3000;
    spacingYMultiplier = 1;
    permanentSpawnDelay = 2000;
    //Backgrounds
    this.background = game.add.tileSprite(0, 0, 600, 820, 'sky');
    this.background.tilePosition.y = backgroundPos;
    this.skyboss = this.add.tileSprite(0, 0, 600, 820, 'sky-boss');
    this.skyboss.tilePosition.y = backgroundPos;
    this.skyboss.alpha = 0;
    //Player
    this.generatePlayer(yoshiPosX, yoshiPosY);
    //Enemies
    enemies = game.add.group();
    enemies.enableBody = true;
    //Bosses
    bosses = game.add.group();
    bosses.enableBody = true;
    //Unkillable Enemies
    unkillableEnemies = game.add.group();
    unkillableEnemies.enableBody = true;
    //Fireballs
    fireballs = game.add.group();
    fireballs.enableBody = true;
    //Stars
    stars = game.add.group();
    stars.enableBody = true;
    //PickUps
    blocks = game.add.group();
    blocks.enableBody = true;
    coins = game.add.group();
    coins.enableBody = true;
    //Explosions
    explosions = game.add.group();
    explosions.enableBody = false;
    //SFX
    coinSound = game.add.audio('coinSound');
    blockSound = game.add.audio('blockSound');
    fireSmallSound = game.add.audio('fireSmallSound');
    deathSound = game.add.audio('deathSound');
    boomSound = game.add.audio('boom');
    bossMusic = game.add.audio('bossMusic');
    starMusic = game.add.audio('star');
    //muted or not
    if(soundEnabled){
      music.mute = false;
      music.loop = true;
      bossMusic.loop = true;
      bossMusic.mute = false;
    }
    else{
      music.mute = true;
      bossMusic.mute = true;
    }
    if(!sfxEnabled){
      starMusic.mute = true;
      coinSound.mute = true;
      blockSound.mute = true;
      fireSmallSound.mute = true;
      deathSound.mute = true;
      boomSound.mute = true;
    }
    else{
        starMusic.mute = false;
        coinSound.mute = false;
        blockSound.mute = false;
        fireSmallSound.mute = false;
        deathSound.mute = false;
        boomSound.mute = false;
    }
    // scoreTimer
    game.time.events.loop(Phaser.Timer.SECOND / 1000 , this.addScore);
    //pick up text
    pickUpTextFD = game.add.text(game.world.centerX, game.world.centerY, 'FIRE RATE UP', {font: 'Pixel', fontSize: '28px', fill: '#fff'});
    pickUpTextFD.anchor.set(0.5);
    pickUpTextFD.alpha = 0;
    pickUpTextFS = game.add.text(game.world.centerX, game.world.centerY-50, 'FIRE SPEED UP', {font: 'Pixel', fontSize: '28px', fill: '#fff'});
    pickUpTextFS.anchor.set(0.5);
    pickUpTextFS.alpha = 0;
    pickUpTextYS = game.add.text(game.world.centerX, game.world.centerY-100, 'YOSHI SPEED UP', {font: 'Pixel', fontSize: '28px', fill: '#fff'});
    pickUpTextYS.anchor.set(0.5);
    pickUpTextYS.alpha = 0;
    //Score
    var scoreBack = game.add.image(0, 0, 'scoreBackground');
    scoreText = game.add.text( 4, 4, 'score: 0',{font: 'Pixel' ,fontSize: '24px', fill: '#fff'});
    coinText = game.add.text( game.world.centerX + 50, 4, 'coins: 0',{font: 'Pixel' ,fontSize: '24px', fill: '#fff'});
    //bottom swipe
    if(swipeEnabled){
        var swipeBottom = game.add.image(game.width, game.height, 'bottomSwipeEmpty');
        swipeBottom.anchor.set(1);
        swipeBottom.scale.setTo(1, 0.75);
    }
    this.logRoundStats();
    this.generateStar();
  }, //END OF CREATE FUNCTION
  addScore: function () {
    currentScore += scoreTick;
  },
  update: function(){
    var starChance =  game.rnd.integerInRange(0, 10000);
    if(starChance ==  10000){this.generateStar()};
    //Move Background
    this.background.tilePosition.y += 2;
    this.skyboss.tilePosition.y += 2;

    //Score
    scoreText.text = 'score: ' + currentScore;
    coinText.text = 'coins: ' + currentCoins;
    //Fire
    this.fireSequence();
    //this.goomba.animations.play('goomba-fly', 7, true, false);
    //Interactions
    
    if(hasStar){
      game.physics.arcade.overlap(this.yoshi, enemies, this.starDestroyEnemy, null, this);
      game.physics.arcade.overlap(this.yoshi, unkillableEnemies, this.starDestroyUnkillableEnemy, null, this);
    }
    else{ //Yoshi dies
      game.physics.arcade.overlap(this.yoshi, enemies, this.gameOverScreen, null, this);
      game.physics.arcade.overlap(this.yoshi, bosses, this.gameOverScreen, null, this);
      game.physics.arcade.overlap(this.yoshi, unkillableEnemies, this.gameOverScreen, null, this);
    }
    game.physics.arcade.overlap(fireballs, enemies, this.destroyEnemy, null, this);
    game.physics.arcade.overlap(fireballs, bosses, this.destroyBoss, null, this);
    game.physics.arcade.overlap(fireballs, unkillableEnemies, this.destroyUnkillableEnemy, null, this);
    game.physics.arcade.overlap(this.yoshi, stars, this.getStar, null, this);
    game.physics.arcade.overlap(this.yoshi, coins, this.getCoin, null, this);
    game.physics.arcade.overlap(this.yoshi, blocks, this.getBlock, null, this);
    //movement
    if (Phaser.Rectangle.contains(this.yoshi.body, game.input.x, game.input.y))
      {
        this.yoshi.body.velocity.setTo(0, 0);
      }
    else{
    	if(this.yoshi.y < 720){
    		game.physics.arcade.moveToPointer(this.yoshi, yoshiSpeed);
    	}
    	else if(game.input.mousePointer.y < 720){
    		game.physics.arcade.moveToPointer(this.yoshi, yoshiSpeed);
    	}
      }
    // vertical borders
    if(this.yoshi.y <= 52){
      this.yoshi.y = 52;
    }
    if(this.yoshi.y < 52){
      this.yoshi.body.velocity.y = 0;
    }
    if(this.yoshi.y >= game.height - 120){
      this.yoshi.y = game.height - 120;
    }
    if(this.yoshi.y > game.height - 120){
      this.yoshi.body.velocity.y = 0;
    }
    // horizontal borders
    if(this.yoshi.x <= 20){
    	this.yoshi.x = 20;
    }
    if (this.yoshi.x < 20) {
    	this.yoshi.body.velocity.x = 0;
    }
    if(this.yoshi.x >= game.width - 20){
    	this.yoshi.x = game.width - 20;
    }
    if(this.yoshi.x > game.width - 20){
    	this.yoshi.body.velocity.x = 0;
    }
    //Waves
    this.waveManager();
      
  }, //END OF UPDATE FUNCTION
  generatePlayer: function(x, y) {
    this.yoshi = this.add.sprite(x, y, 'yoshi');
    this.yoshi.animations.add('ani', [0,1,2,3]);
    this.yoshi.animations.add('star', [4,5,6,7]);
    this.yoshi.anchor.setTo(0.5, 0.5);
    this.yoshi.scale.setTo(1.75,1.75);
    game.physics.enable(this.yoshi, Phaser.Physics.ARCADE);
    this.yoshi.body.width = 25;
    this.yoshi.body.height = 45;
    this.yoshi.animations.play('ani', 6, true, false);
  },
  fireSequence: function(){
    if(game.time.now > (lastFireballFired + fireDelay)){
          this.generateFireball();
      }
  },
  generateStar: function() {
    var star = stars.create(0,0,'star');
    game.physics.enable(star, Phaser.Physics.ARCADE);
    star.animations.add('flicker', [0,1,2,1,0]);
    star.animations.play('flicker', 4, true, false);
    star.scale.setTo(2,2);
    star.checkWorldBounds = true;
    star.body.collideWorldBounds = true;
    star.body.velocity.setTo(200,100);
    star.body.bounce.set(1);
      
    game.time.events.add(Phaser.Timer.SECOND * 7.85, function(){star.kill()}, this);
  },
  generateFireball: function() {
    if(typeFire == 'big'){
      // if (fireballs.countDead()) {
      //   var fireball = fireballs.getFirstDead();
      //   console.log('revived a dead');
      // }else {
        var fireball = fireballs.create(this.yoshi.position.x-15, this.yoshi.position.y-30, 'fireball-big');
      // }
        game.physics.enable(fireball, Phaser.Physics.ARCADE);
        playerDamage = 2;
        fireball.animations.add('spin', [0,1]);
        fireball.animations.play('spin', 4, true, false);
        fireball.scale.setTo(2,2);
        fireball.body.width = 30;
        fireball.body.height = 30;
        fireball.angle -= 90;
        fireball.events.onOutOfBounds.add( function(){ fireball.kill(); } );
        fireball.checkWorldBounds = true;
        fireball.body.velocity.y = - fireballSpeed;
        lastFireballFired = game.time.now;
        fireSmallSound.play();
        fireball.lifespan = 1000;
    }
    else if(typeFire == 'big-double'){
        var fireball = fireballs.create(this.yoshi.position.x-15, this.yoshi.position.y-30, 'fireball-big');
        game.physics.enable(fireball, Phaser.Physics.ARCADE);
        playerDamage = 2;
        fireball.animations.add('spin', [0,1]);
        fireball.animations.play('spin', 4, true, false);
        fireball.scale.setTo(2,2);
        fireball.body.width = 30;
        fireball.body.height = 30;
        fireball.angle -= 90;
        fireball.events.onOutOfBounds.add( function(){ fireball.kill(); } );
        fireball.checkWorldBounds = true;
        fireball.body.velocity.y = - fireballSpeed;
        lastFireballFired = game.time.now;
        fireSmallSound.play();
        var fireball2 = fireballs.create(this.yoshi.position.x-10, this.yoshi.position.y-30, 'fireball-big');
        game.physics.enable(fireball2, Phaser.Physics.ARCADE);
        fireball2.scale.setTo(2,2);
        fireball2.angle -= 90;
        fireball2.animations.add('spin', [0,1,2,3]);
        fireball2.animations.play('spin', 8, true, false);
        fireball.body.velocity.x = 45;
        fireball2.body.velocity.x = -45;
        fireball2.body.velocity.y = - fireballSpeed;
        fireball2.body.width = 25;
        fireball2.body.height = 25;
        fireball2.events.onOutOfBounds.add( function(){ fireball.kill(); } );
        fireball2.checkWorldBounds = true;
    }
    else if(typeFire == 'big-triple'){
        var fireball = fireballs.create(this.yoshi.position.x-15, this.yoshi.position.y-30, 'fireball-big');
        game.physics.enable(fireball, Phaser.Physics.ARCADE);
        playerDamage = 2;
        fireball.animations.add('spin', [0,1]);
        fireball.animations.play('spin', 4, true, false);
        fireball.body.velocity.x = 70;
        fireball.scale.setTo(2,2);
        fireball.body.width = 30;
        fireball.body.height = 30;
        fireball.angle -= 90;
        fireball.events.onOutOfBounds.add( function(){ fireball.kill(); } );
        fireball.checkWorldBounds = true;
        fireball.body.velocity.y = - fireballSpeed;
        lastFireballFired = game.time.now;
        fireSmallSound.play();
        var fireball2 = fireballs.create(this.yoshi.position.x-10, this.yoshi.position.y-30, 'fireball-big');
        game.physics.enable(fireball2, Phaser.Physics.ARCADE);
        fireball2.scale.setTo(2,2);
        fireball2.angle -= 90;
        fireball2.animations.add('spin', [0,1,2,3]);
        fireball2.animations.play('spin', 8, true, false);
        fireball2.body.velocity.x = -70;
        fireball2.body.velocity.y = - fireballSpeed;
        fireball2.body.width = 25;
        fireball2.body.height = 25;
        fireball2.events.onOutOfBounds.add( function(){ fireball.kill(); } );
        fireball2.checkWorldBounds = true;
        var fireball3 = fireballs.create(this.yoshi.position.x-10, this.yoshi.position.y-30, 'fireball-big');
        game.physics.enable(fireball2, Phaser.Physics.ARCADE);
        fireball3.scale.setTo(2,2);
        fireball3.angle -= 90;
        fireball3.animations.add('spin', [0,1,2,3]);
        fireball3.animations.play('spin', 8, true, false);
        fireball3.body.velocity.x = 0;
        fireball3.body.velocity.y = - fireballSpeed -65;
        fireball3.body.width = 25;
        fireball3.body.height = 25;
        fireball3.events.onOutOfBounds.add( function(){ fireball.kill(); } );
        fireball3.checkWorldBounds = true;
      }
      else{
        var fireball = fireballs.create(this.yoshi.position.x-10, this.yoshi.position.y-30, 'fireball-mini');
        game.physics.enable(fireball, Phaser.Physics.ARCADE);
        if(typeFire == 'double'){
          var fireball2 = fireballs.create(this.yoshi.position.x-10, this.yoshi.position.y-30, 'fireball-mini');
          game.physics.enable(fireball2, Phaser.Physics.ARCADE);
          fireball2.animations.add('spin', [0,1,2,3]);
          fireball2.animations.play('spin', 8, true, false);
          fireball.body.velocity.x = 25;
          fireball2.body.velocity.x = -25;
          fireball2.body.velocity.y = - fireballSpeed;
          fireball2.body.width = 25;
          fireball2.body.height = 25;
          fireball2.events.onOutOfBounds.add( function(){ fireball.kill(); } );
          fireball2.checkWorldBounds = true;
        }
        fireball.animations.add('spin', [0,1,2,3]);
        fireball.animations.play('spin', 8, true, false);
        fireball.body.width = 25;
        fireball.body.height = 25;
        fireball.events.onOutOfBounds.add( function(){ fireball.kill(); } );
        fireball.checkWorldBounds = true;
        fireball.body.velocity.y = - fireballSpeed;
        lastFireballFired = game.time.now;
        fireSmallSound.play();
    }
  },
  getStar: function(yoshi, star) {
    hasStar = true;
    star.kill();
    music.mute = true;
    if(soundEnabled){
    starMusic.play();
    starMusic.loop = true;}
    yoshiSpeed *= 1.5;
    this.yoshi.animations.play('star', 10, true, false);
      
      game.time.events.add(Phaser.Timer.SECOND * 8, this.looseStar, this);
  },
    
    looseStar: function() {
        hasStar = false;
        if(soundEnabled){
            music.mute = false;}
            starMusic.stop();
        
        yoshiSpeed /= 1.5;
        this.yoshi.animations.play('ani', 6, true, false);
    },
  generateEnemy: function(posX, posY, velX, velY, enemyName, health){
    if (health == null) {
      health = 1;  // IF standard VALUE possible -> Change function
    }
    var enemy = enemies.create(posX, posY, enemyName); //position, sprite
    enemy.health = health;
    enemy.animations.add(enemyName + '-ani', [0,1,2,3,4,5,6,7,8,9]); //Animation frames still hardcoded
    enemy.animations.play(enemyName + '-ani', 10, true, false);
    game.physics.enable(enemy, Phaser.Physics.ARCADE);
    enemy.anchor.setTo(0.5, 0.5);
    enemy.events.onOutOfBounds.add( function(){ enemy.kill(); } );
    enemy.body.velocity.y = velY;
    enemy.body.velocity.x = velX;
    enemy.body.width = 60;
    enemy.body.height = 60;
  },
  generateBoss: function(){
    var baseHealth = bossHealth;
    var health = baseHealth + ((baseHealth / 2.5) * globalHealthMultiplier);
    var posX = game.width / 2;
    var posY = 50;
    this.boss = bosses.create(posX, posY, 'bowser');
    this.boss.health = health;
    this.boss.animations.add('bowser-idle', [0,1,2,3]);
    this.boss.animations.add('bowser-throw', [0,1,6,7]); // 8frames/s
    this.boss.animations.play('bowser-throw', 12, true, false);
    game.physics.enable(this.boss, Phaser.Physics.ARCADE);
    this.boss.anchor.setTo(0.5, 0.5);
    this.boss.body.velocity.y = 20;
    this.boss.body.velocity.x = 150;
    this.boss.body.collideWorldBounds = true;
    this.boss.body.bounce.set(1);
    this.boss.scale.setTo(2);
    bossSpawned = true;
    tweenSky.stop();
    this.skyboss.alpha = 1;
  },
  bossMovement: function(){
    if (bossSpawned) {
      if (this.boss.world.y < (game.height / 4)) {
        this.boss.body.velocity.y = 20;
      }else {
        this.boss.body.velocity.y = -20;
      }
    }
  },
  bowserThrow: function(alive){
    if (alive && throwTime < game.time.now) {
      var throwObject = this.getRndInteger(1,1000);
      if (throwObject < bossThrowChance) {
        this.generateThrow();
      }
      throwTime = game.time.now + throwDelay;
    }
  },
  generateThrow: function(){
    var posX = this.boss.world.x;
    var posY = this.boss.world.y;
    var object = unkillableEnemies.create(posX, posY, 'spiny'); //position, sprite
    object.animations.add('spiny-ani', [0,1]); // 8frames/s
    object.animations.play('spiny-ani', 8, true, false);
    var velX = this.getRndInteger(25, 150);
    game.physics.enable(object, Phaser.Physics.ARCADE);
    object.body.collideWorldBounds = false;
    object.allowGravity = true;
    object.body.gravity.y = 800;
    if(object.centerX < 240){
      object.body.velocity.x = velX;
    }
    else{
      object.body.velocity.x = -velX;
    }
    object.body.velocity.y = -400;
    object.events.onOutOfBounds.add( function(){ object.kill(); } );
    object.scale.setTo(3);
  },
  generateKoopa: function(posX, posY, velX, velY){
      var baseHealth = 2;
      var health = baseHealth + ((baseHealth / 2) * globalHealthMultiplier);
      this.generateEnemy(posX, posY, velX, velY, 'koopa', health)
  },
  generateBoo: function(posX, posY, velX, velY){
    var baseHealth = 3;
    var health = baseHealth + ((baseHealth / 2) * globalHealthMultiplier);
    var enemy = enemies.create(posX, posY, 'boo');
    enemy.health = health;
    enemy.animations.add('boo-ani', [0,1]);
    enemy.animations.play('boo-ani', 3, true, false);
    game.physics.enable(enemy, Phaser.Physics.ARCADE);
    enemy.anchor.setTo(0.5, 0.5);
    enemy.body.velocity.y = velY;
    enemy.body.velocity.x = velX;
    enemy.body.collideWorldBounds = true;
    enemy.body.bounce.set(1);
    enemy.scale.setTo(0.15);
  },
  generateBulletEnemy: function(posX){
    var posY = 0;
    var velY = 1000;
    var enemy = unkillableEnemies.create(posX, posY, 'bullet'); //position, sprite
    game.physics.enable(enemy, Phaser.Physics.ARCADE);
    enemy.anchor.setTo(0.5, 0.5);
    enemy.events.onOutOfBounds.add( function(){ enemy.kill(); } );
    enemy.body.velocity.y = velY;
    // enemy.body.velocity.x =  velX;
    enemy.scale.setTo(0.5);
  },
  generateWarning: function(posX){
        this.warning = this.add.sprite(posX, 35, 'warning');
        this.warning.scale.setTo(0.4);
        this.warning.animations.add('warning-ani', [0,1]);
        this.warning.animations.play('warning-ani', 10, true, false);
        game.time.events.add(Phaser.Timer.SECOND * 0.8, this.warningKill, this);
  },
  warningKill: function(){
    this.warning.kill();
  },
  spawnBulletEnemy: function(){
    var shootBullet = this.getRndInteger(1,1000);
    if(shootBullet < bulletChance){
      var posX = this.getRndInteger(1, game.width);
      this.generateWarning(posX);
      game.time.events.add(Phaser.Timer.SECOND * 0.8, this.generateBulletEnemy, this, posX);
    }
  },
  generateExplosion: function(x, y, sound) {
    var explosion = explosions.create(x, y, 'explosion');
    explosion.animations.add('explosion-boom', [0,1,2,3,4,5,6,7,8]);
    explosion.animations.play('explosion-boom', 9, false, true);
    explosion.anchor.setTo(0.5, 0.5);
    explosion.scale.setTo(1.5,1.5);
    //game.time.events.add(Phaser.Timer.SECOND * 2, this.destroyExplosion(explosion), this);
    if(sound){
        deathSound.play();}
      else{
          boomSound.play();
      }
  },
  /*destroyExplosion: function(explosion){
    explosion.kill();
  },*/
  //PICKUP FUNCTION RANDOMIZE
  generatePickUp: function(x,y){
    var random =  game.rnd.integerInRange(0,100);
    if(random < 15){
      var block = blocks.create(x,y,'questionblock');
      block.animations.add('block-spin', [0,1,2,3]);
      block.animations.play('block-spin', 5, true, false);
      game.physics.enable(block, Phaser.Physics.ARCADE);
      block.body.velocity.y = 100;
      block.events.onOutOfBounds.add( function(){ block.destroy(); } );
    }
    else{
      var coin = coins.create(x,y,'coin');
      coin.animations.add('coin-spin', [0,1,2,3]);
      coin.animations.play('coin-spin', 5, true, false);
      game.physics.enable(coin, Phaser.Physics.ARCADE);
      coin.body.velocity.y = 100;
      coin.events.onOutOfBounds.add( function(){ coin.destroy(); } );
    }
  },
  destroyEnemy: function(fireball, enemy) { //fireballs, koopa
    fireball.kill();
    enemy.health -= playerDamage;
    if(enemy.health <= 0){
      currentScore += 1000;
      game.physics.enable(enemy, Phaser.Physics.ARCADE);
      enemy.body.collideWorldBounds = false;
      this.generateExplosion(enemy.centerX, enemy.centerY, true);
      this.generatePickUp(enemy.centerX, enemy.centerY);
      enemy.allowGravity = true;
      enemy.body.gravity.y = 400;
      if(enemy.centerX < 240){
        enemy.body.velocity.x = -200;
      }
      else{
        enemy.body.velocity.x = 200;
      }
      enemy.body.velocity.y = 25;
      enemy.body.checkCollision.up = false;
      enemy.body.checkCollision.down = false;
      enemy.body.checkCollision.left = false;
      enemy.body.checkCollision.right = false;
      enemy.events.onOutOfBounds.add( function(){ enemy.kill(); } );
      enemy.angle += 180;
      }
      else{this.generateExplosion(enemy.centerX, enemy.centerY, false);  }
  },
  destroyBoss: function(fireball, boss){
    this.destroyEnemy(fireball, boss);
    if (boss.health <= 0) {
      boss.animations.add('bowser-kill', [4,5]);
      boss.animations.play('bowser-kill', 8, true, false);
      bossSpawned = false;
      this.bowserThrow(bossSpawned);
      game.time.events.add(Phaser.Timer.SECOND * bossSpawnWaitTime, this.resetBoss, this);
      tweenSky = this.add.tween(this.skyboss).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true,  0, 0, false);
      tweenSky.loop = false;
      music.resume();
      bossMusic.stop();

      //Loot
      for (var i = 0; i < 5; i++) {
        var lootPos = 40;
        var posX = this.getRndInteger(boss.world.x - lootPos, boss.world.x + lootPos);
        var posY = this.getRndInteger(boss.world.y -lootPos , boss.world.y + lootPos);
        this.generatePickUp(posX, posY);
      }
    }
  },
  resetBoss: function(){
    bossSpawnTimerStarted = false;
    bossIsAlive = false;
  },
  starDestroyEnemy: function(yoshi, enemy) { //fireballs, koopa
    currentScore += 1000;
    enemy.health -= 90000;
    if(enemy.health <= 0){
      game.physics.enable(enemy, Phaser.Physics.ARCADE);
      enemy.body.collideWorldBounds = false;
      this.generateExplosion(enemy.centerX, enemy.centerY);
      this.generatePickUp(enemy.centerX, enemy.centerY);
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
      enemy.events.onOutOfBounds.add( function(){ enemy.kill(); } );
    }
  },
  destroyUnkillableEnemy: function(fireball, enemy) { //fireballs, Bullet
    fireball.kill();
    game.physics.enable(enemy, Phaser.Physics.ARCADE);
    enemy.events.onOutOfBounds.add( function(){ enemy.kill(); } );
  },
  starDestroyUnkillableEnemy: function(yoshi, enemy) { //fireballs, Bullet
    game.physics.enable(enemy, Phaser.Physics.ARCADE);
    enemy.events.onOutOfBounds.add( function(){ enemy.kill(); } );
    currentScore += 1000;
      enemy.body.collideWorldBounds = false;
      this.generateExplosion(enemy.centerX, enemy.centerY, true);
      this.generatePickUp(enemy.centerX, enemy.centerY);
      enemy.allowGravity = true;
      enemy.body.gravity.y = 400;
      if(enemy.centerX < 240){
        enemy.body.velocity.x = -200;
      }
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
    coin.destroy();
    currentCoins += 1;
    coinSound.play();
  },
  getBlock: function(yoshi, block) {
    block.destroy();
    var random =  game.rnd.integerInRange(0,4);
      if(random < 3 && fireDelay > fireDelayMin){
        fireDelay -= 50;
        pickUpNr = 0;
        tween = this.add.tween(pickUpTextFD).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true,  0, 0, false);
        tween.onComplete.add(function(){ this.add.tween(pickUpTextFD).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true,  0, 0, false);}, this);
      }
      else if(fireDelay <= fireDelayMin && typeFire == 'normal'){
        typeFire = 'double';
        fireDelay = 700;
      }
      else if(fireDelay <= fireDelayMin && typeFire == 'double'){
        typeFire = 'big';
        fireDelay = 350;
        playerDamage = 2;
      }
      else if(fireDelay <= fireDelayMin && typeFire == 'big'){
        typeFire = 'big-double';
        fireDelay = 500;
        playerDamage = 2;
      }
      else if(fireDelay <= fireDelayMin && typeFire == 'big-double'){
        typeFire = 'big-triple';
        fireDelay = 650;
        playerDamage = 2;
      }
      if(random==3 && fireballSpeed < maxFireballSpeed){
        fireballSpeed += 25;
        pickUpNr = 1;
        tween = this.add.tween(pickUpTextFS).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true,  0, 0, false);
        tween.onComplete.add(function(){ this.add.tween(pickUpTextFS).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true,  0, 0, false);}, this);
      }
      if(random==4 && yoshiSpeed < maxYoshiSpeed){
        yoshiSpeed += 50;
        pickUpNr = 2;
        tween = this.add.tween(pickUpTextYS).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true,  0, 0, false);
        tween.onComplete.add(function(){ this.add.tween(pickUpTextYS).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true,  0, 0, false);}, this);
      }
      blockSound.play();
    },
    //WAVEMANAGER
    waveManager: function(){
    //Amount of Enemies spawned, spacingX between Enemies spawned, startXposition, startYposition, velX, velY, enemyName
    var amount = this.getRndInteger(minAmount, maxAmount); //1 to 5
    var startX = this.getRndInteger(0, 250);
    var velX = 30;
    var spacingX = 85;
    var spacingXGoomba = 70;
    var spacingY = 0;
    velY = this.getRndInteger((100 + velYMultiplier), (300 + velYMultiplier));
    //Permanent Wave
    if (game.time.now > permanentSpawn && !bossIsAlive) {
      this.spawnBooWave();
      this.spawnBulletEnemy();
      permanentSpawn = game.time.now + permanentSpawnDelay;
    }
    //Wave 1
    if(game.time.now > (lastWaveSpawned + spawnDelay) && wave1 < wave1Max){
      this.spawnKoopaWave(amount / 1.2 , 50, 30, 30, 150); //Amount, startX, startY, velX, velY
      amount = this.getRndInteger(minAmount, maxAmount);
      this.spawnWave(amount, spacingXGoomba, spacingY + spacingYMultiplier, 300, 30, -50, 200, 'goomba', 1);
      wave1++;
      lastWaveSpawned = game.time.now;
    }
    //Wave 2
    if(wave1 == wave1Max && game.time.now > (lastWaveSpawned + spawnDelay) && wave2 < wave2Max){
      amount = this.getRndInteger(minAmount, maxAmount);
      this.spawnWave(amount, spacingXGoomba, spacingY + spacingYMultiplier, 50, 30, velX, velY, 'goomba', 1);
      amount = this.getRndInteger(minAmount, maxAmount);
      startX = this.getRndInteger(150, 300);
      velY = this.getRndInteger((150 + velYMultiplier), (350 + velYMultiplier));
      this.spawnKoopaWave(amount / 1.2, startX, 30, -50, velY);
      lastWaveSpawned = game.time.now;
      wave2++;
    }
    //Wave 3
    // if(wave2 == wave2Max && game.time.now > (lastWaveSpawned + spawnDelay) && wave3 < wave3Max){
    //   amount = this.getRndInteger(minAmount - 2, maxAmount - 2);
    //   this.spawnWave(amount, spacingXGoomba, spacingY + spacingYMultiplier, 20, 30, velX, velY, 'goomba', 1);
    //   amount = this.getRndInteger(minAmount - 2, maxAmount - 2);
    //   this.spawnWave(amount, spacingXGoomba, spacingY + spacingYMultiplier + 10, 40, 30, velX, velY, 'goomba', 1);
    //   amount = this.getRndInteger(minAmount, maxAmount);
    //   startX = this.getRndInteger(150, 300);
    //   velY = this.getRndInteger((150 + velYMultiplier), (350 + velYMultiplier));
    //   this.spawnWave(amount, spacingX, spacingY, startX, 30, -50, velY, 'koopa', 2);
    //   lastWaveSpawned = game.time.now;
    //   wave3++;
    // }
    //BossFight
    if (bossIsAlive) {
      if (!bossSpawned && !bossSpawnTimerStarted) {
        game.time.events.add(Phaser.Timer.SECOND * bossSpawnWaitTime, this.generateBoss, this);
        bossSpawnTimerStarted = true;
        console.log("Boss Spawns in " + bossSpawnWaitTime + "s");
        tweenSky = this.add.tween(this.skyboss).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true,  0, 1000, true);
        music.pause();
        bossMusic.play();
      }
      this.bowserThrow(bossSpawned);
      this.bossMovement();
    }
    //When both waves are completed, repeat but more difficult
    //Scaling
    if (wave2 == wave2Max && !bossIsAlive) {
      //Increases
      spacingYMultiplier += 5;
      velYMultiplier += 50;
      velX += 50;
      globalHealthMultiplier += 0.5;
      if (spawnDelay > minSpawnDelay) { //Increase spawn rate till limit
        spawnDelay -= 125;
      }
      if( minAmount <= maxMinAmount) { //Increase Amounts till limit
        minAmount += 0.2; maxAmount += 0.1;
      }
      //Spawn Boss
      if (bossSpawnRound == 2) {
        this.spawnBoss();
        throwDelay = 500 - (round * 1.5);
      }else{
        bossSpawnRound++;
        this.nextRound();
      }
      this.logRoundStats();
    }
  },
  getRndInteger: function(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  },
  nextRound: function(){
    wave1 = 0;
    wave2 = 0;
    wave3 = 0;
    round++;
  },
  logRoundStats: function(){
    if (!bossIsAlive) {
      console.log('\n');
      console.log('round: ' + round);
      console.log('spawn delay: ' + spawnDelay);
      console.log('spacing Y multiplier: ' + spacingYMultiplier);
      console.log('velocity Y multiplier: ' + velYMultiplier);
      console.log('health multiplier: ' + globalHealthMultiplier);
      console.log('min amount: ' + minAmount);
      console.log('max amount: ' + maxAmount);
      console.log('boss throw delay: ' + throwDelay);
      console.log('fire Delay: ' + fireDelay);
      console.log('fire ball speed: ' + fireballSpeed);
      console.log('yoshi Speed: ' + yoshiSpeed);
      console.log('\n');
    }
    else {

    }
  },
  spawnWave: function(amount, spacingX, spacingY, startX, startY, velX, velY, enemyName, health, enemyScore){
    for (var i = 0; i < amount ; i ++) {
      this.generateEnemy(startX + (spacingX * i), startY - (spacingY * i), velX, velY, enemyName, health); //posX, posY, velX, velY, enemyName
    }
  },
  spawnBoss: function(){
    bossIsAlive = true;
    bossSpawnRound = 0;
  },
  spawnGoombaWave: function(amount, startX, startY, velX, velY){
    spacingX = 70;
    spacingY = 0;
    var baseHealth = 1;
    var health = baseHealth + ((baseHealth / 1.5) * globalHealthMultiplier);
    for (var i = 0; i < amount ; i ++) {
      this.generateEnemy(startX + (spacingX * i), startY - (spacingY * i), velX, velY, 'goomba', health);
    }
  },
  spawnKoopaWave: function(amount, startX, startY, velX, velY){
    spacingX = 85;
    spacingY = 0;
    for (var i = 0; i < amount ; i ++) {
      this.generateKoopa(startX + (spacingX * i), startY - (spacingY * i), velX, velY);
    }
  },
  spawnBooWave: function(){
    spawnPoint = this.getRndInteger(1, 3);
    spawnBoo = this.getRndInteger(1, 1000);
    var velX = 450;
    var velY = 150;
    if (spawnBoo < spawnBooChance) {
      if(spawnPoint == 1){
        this.generateBoo(20, 50, velX, velY); //Spawn Left
      }
      else {
        this.generateBoo(game.width - 50, 50, -velX, velY); //Spawn Right
      }
    }
  },
  gameOverScreen: function(){
    bossMusic.stop();
    backgroundPos = this.background.tilePosition.y;
    yoshiPosX = this.yoshi.world.x;
    yoshiPosY = this.yoshi.world.y;
    this.state.start('death', true, false, currentScore, currentCoins);
  }
}













//───────────────────────────────
//───────────────████─███────────
//──────────────██▒▒▒█▒▒▒█───────
//─────────────██▒────────█──────
//─────────██████──██─██──█──────
//────────██████───██─██──█──────
//────────██▒▒▒█──────────███────
//────────██▒▒▒▒▒▒───▒──██████───
//───────██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒███─
//──────██▒▒▒▒─────▒▒▒▒▒▒▒▒▒▒▒▒█─
//──────██▒▒▒───────▒▒▒▒▒▒▒█▒█▒██
//───────██▒▒───────▒▒▒▒▒▒▒▒▒▒▒▒█
//────────██▒▒─────█▒▒▒▒▒▒▒▒▒▒▒▒█
//────────███▒▒───██▒▒▒▒▒▒▒▒▒▒▒▒█
//─────────███▒▒───█▒▒▒▒▒▒▒▒▒▒▒█─
//────────██▀█▒▒────█▒▒▒▒▒▒▒▒██──
//──────██▀██▒▒▒────█████████────
//────██▀███▒▒▒▒────█▒▒██────────
//█████████▒▒▒▒▒█───██──██───────
//█▒▒▒▒▒▒█▒▒▒▒▒█────████▒▒█──────
//█▒▒▒▒▒▒█▒▒▒▒▒▒█───███▒▒▒█──────
//█▒▒▒▒▒▒█▒▒▒▒▒█────█▒▒▒▒▒█──────
//██▒▒▒▒▒█▒▒▒▒▒▒█───█▒▒▒███──────
//─██▒▒▒▒███████───██████────────
//──██▒▒▒▒▒██─────██─────────────
//───██▒▒▒██─────██──────────────
//────█████─────███──────────────
//────█████▄───█████▄────────────
//──▄█▓▓▓▓▓█▄─█▓▓▓▓▓█▄───────────
//──█▓▓▓▓▓▓▓▓██▓▓▓▓▓▓▓█──────────
//──█▓▓▓▓▓▓▓▓██▓▓▓▓▓▓▓█──────────
//──▀████████▀▀███████▀──────────
