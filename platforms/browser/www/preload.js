var MyGame = {};

MyGame.preloadState = function(game) {};

MyGame.preloadState.prototype = {

    preload: function() {
        this.load.image('sky', 'assets/background-tile.jpg');
        this.load.image('scoreBackground','assets/scoreBackground.jpg');
        this.load.image('sky-boss', 'assets/background-tile-boss.png');
        
        this.load.image('ready', 'assets/preGame_ready.png');
        this.load.image('set', 'assets/preGame_set.png');
        this.load.image('go', 'assets/preGame_go.png');
        
        this.load.spritesheet('yoshi', 'assets/yoshi.png', 27, 50, 4);
        this.load.spritesheet('fireball', 'assets/mario_fireball.png', 27, 50, 4);
        this.load.spritesheet('fireball-mini', 'assets/fireballs2.png', 28, 29, 4);
        this.load.spritesheet('fireball-big', 'assets/bigfireballs.png', 16, 16, 2);
        this.load.spritesheet('fireball-bigger', 'assets/biggerfireballs.png', 21, 21, 2);
        this.load.spritesheet('explosion', 'assets/explosion.png', 31 ,48,9);
        this.load.spritesheet('koopa', 'assets/koopas2.png', 80, 92, 10);
        this.load.spritesheet('questionblock', 'assets/questionblock2.png', 36, 35, 4);
        this.load.spritesheet('coin', 'assets/coin2.png', 32 , 32 , 4 );
        this.load.spritesheet('goomba', 'assets/Goomba2.png', 67 ,44,3);
        this.load.image('bullet', 'assets/bullet_bill.png');

        this.load.image('title', 'assets/titlescreen_title.jpg');
        this.load.image('gameOverTitle', 'assets/gameOver.png');
        this.load.image('startGame', 'assets/button_startGame.png');
        this.load.image('store', 'assets/button_store.png');
        this.load.image('options', 'assets/button_options.png');
        this.load.image('exit', 'assets/button_exit.png');
        this.load.image('retry', 'assets/button_retry.png');
        this.load.image('buttonYes', 'assets/button_yes.png');
        this.load.image('buttonNo', 'assets/button_no.png');

        this.load.audio('water', 'assets/underwater.mp3');
        this.load.audio('coinSound', 'assets/smw_coin.wav');
        this.load.audio('blockSound', 'assets/smw_message_block.wav');
        this.load.audio('fireSmallSound', 'assets/smw_bowser_fire.wav');
        this.load.audio('deathSound', 'assets/smw_stomp.wav');
        this.load.audio('gameover', 'assets/smw_game_over.wav');


    },


    create: function() {
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        music = game.add.audio('water');
        

        this.state.start('titlescreen');
    }
}
