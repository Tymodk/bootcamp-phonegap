//state variables
var highscore = 0;
var scoreText;
var highscoreText;
var currentCoinText;
var totalCoinText;
var scoreNumbers;
var highscoreNumbers;
var currentCoinNumbers;
var totalCoinNumbers;
//initiating state
MyGame.gameOverState = function (game) {};
MyGame.gameOverState.prototype = {
  create: function() {
    //background
    this.background = game.add.tileSprite(0, 0, 600, 820, 'sky');
    this.background.tilePosition.y = backgroundPos;
    //title
    var gameOverTitle = game.add.image(game.world.centerX, 20, 'gameOverTitle');
    gameOverTitle.scale.setTo(0.7);
    gameOverTitle.anchor.set(0.5, 0);
    //game statistics text
    scoreText = game.add.text( game.world.centerX + 35, game.world.centerY - 100, 'score',{font: 'Pixel' ,fontSize: '28px', fill: '#fff'});
    scoreText.anchor.set(1, 0.5);
    highscoreText = game.add.text( game.world.centerX + 35, game.world.centerY - 30, 'highscore',{font: 'Pixel' ,fontSize: '28px', fill: '#fff'});
    highscoreText.anchor.set(1, 0.5);
    currentCoinText = game.add.text( game.world.centerX + 35, game.world.centerY + 40, 'earned coins',{font: 'Pixel' ,fontSize: '28px', fill: '#fff'});
    currentCoinText.anchor.set(1, 0.5);
    totalCoinText = game.add.text( game.world.centerX + 35, game.world.centerY + 110, 'total coins',{font: 'Pixel' ,fontSize: '28px', fill: '#fff'});
    totalCoinText.anchor.set(1, 0.5);
    //game statistics
    scoreNumbers = game.add.text( game.world.centerX + 45, game.world.centerY - 100, '',{font: 'Pixel' ,fontSize: '28px', fill: '#fff'});
    scoreNumbers.anchor.set(0, 0.5);
    highscoreNumbers = game.add.text( game.world.centerX + 45, game.world.centerY - 30, '',{font: 'Pixel' ,fontSize: '28px', fill: '#fff'});
    highscoreNumbers.anchor.set(0, 0.5);
    currentCoinNumbers = game.add.text( game.world.centerX + 45, game.world.centerY + 40, '',{font: 'Pixel' ,fontSize: '28px', fill: '#fff'});
    currentCoinNumbers.anchor.set(0, 0.5);
    totalCoinNumbers = game.add.text( game.world.centerX + 45, game.world.centerY + 110, '',{font: 'Pixel' ,fontSize: '28px', fill: '#fff'});
    totalCoinNumbers.anchor.set(0, 0.5);
    //buttons
    var retryButton = game.add.button(game.width / 2, game.height - 200, 'retry', this.startGame);
    retryButton.scale.setTo(1.5);
    retryButton.anchor.set(0.5);
    var exitButton = game.add.button(game.width / 2, game.height - 100, 'exitOptions', this.exitGame);
    exitButton.scale.setTo(1.5);
    exitButton.anchor.set(0.5);
    //add current coins to total coins
    totalCoins += currentCoins;
  },
  update: function(){
    if(highscore < currentScore){
      highscore = currentScore;
    }
    scoreNumbers.text = ': ' + currentScore;
    highscoreNumbers.text = ': ' + highscore;
    currentCoinNumbers.text = ': ' + currentCoins;
    totalCoinNumbers.text = ': ' + totalCoins;
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