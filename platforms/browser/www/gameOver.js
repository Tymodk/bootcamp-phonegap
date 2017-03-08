var highscore = 0;
var scoreText;
var highscoreText;
var currentCoinText;
var totalCoinText;

MyGame.gameOverState = function (game) {};

MyGame.gameOverState.prototype = {
  create: function() {
    this.background = game.add.tileSprite(0, 0, 600, 800, 'sky');
    this.background.tilePosition.y = backgroundPos;
    var gameOverTitle = game.add.image(game.world.centerX, 20, 'gameOverTitle');
    gameOverTitle.scale.setTo(0.7);
    gameOverTitle.anchor.set(0.5, 0);
    scoreText = game.add.text( game.world.centerX, game.world.centerY - 100, 'score: 0',{font: 'Pixel' ,fontSize: '28px', fill: '#fff'});
    scoreText.anchor.set(0.5);
    highscoreText = game.add.text( game.world.centerX, game.world.centerY - 50, 'highscore: 0',{font: 'Pixel' ,fontSize: '28px', fill: '#fff'});
    highscoreText.anchor.set(0.5);
    currentCoinText = game.add.text( game.world.centerX, game.world.centerY, 'earned coins: 0',{font: 'Pixel' ,fontSize: '28px', fill: '#fff'});
    currentCoinText.anchor.set(0.5);
    totalCoinText = game.add.text( game.world.centerX, game.world.centerY + 50, 'total coins: 0',{font: 'Pixel' ,fontSize: '28px', fill: '#fff'});
    totalCoinText.anchor.set(0.5);
    var retryButton = game.add.button(game.width / 2, game.height - 250, 'retry', this.startGame);
     retryButton.scale.setTo(1.5);
     retryButton.anchor.set(0.5);
    var exitButton = game.add.button(game.width / 2, game.height - 150, 'exit', this.exitGame);
     exitButton.scale.setTo(1);
     exitButton.anchor.set(0.5);
      

     //add current coins to total coins
     totalCoins += currentCoins;
  },
  update: function(){
    if(highscore < currentScore){
      highscore = currentScore;
    }
    scoreText.text = 'score: ' + currentScore;
    highscoreText.text = 'highscore: ' + highscore;
    currentCoinText.text = 'earned coins: ' + currentCoins;
    totalCoinText.text = 'total coins: ' + totalCoins;
    
  },
  exitGame: function(){
    game.state.start('titlescreen');
  },
    
  startGame: function(){
      yoshiPosX = game.world.centerX;
      yoshiPosY = game.world.centerY + 200;
    game.state.start('playGame');
  }
}