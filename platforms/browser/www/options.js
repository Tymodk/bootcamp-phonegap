var soundText;
var creditsText;
var yesButton;
var noButton;

MyGame.optionsState = function (game) {};

MyGame.optionsState.prototype = {
  create: function() {
    this.background = game.add.tileSprite(0, 0, 600, 800, 'sky');
      this.background.tilePosition.y = backgroundPos;
      
     var title = game.add.image(game.world.centerX, 20, 'title');
     title.scale.setTo(0.7);
     title.anchor.set(0.5, 0);
     soundText = game.add.text(game.world.centerX - 60, game.height - 450, '',{font: 'Pixel', fontSize: '28px', fill: '#fff'});
     soundText.scale.setTo(0.75);
     soundText.anchor.set(0.5);
     yesButton = game.add.button(game.world.centerX + 120, game.height - 452, 'buttonYes', this.toggleSound);
     yesButton.scale.setTo(0.7);
     yesButton.anchor.set(0.5);
     noButton = game.add.button(game.world.centerX + 120, game.height - 452, 'buttonNo', this.toggleSound);
     noButton.scale.setTo(0.7);
     noButton.anchor.set(0.5);
     noButton.visible = false;
     var exitButton = game.add.button(game.width / 2, game.height - 100, 'exit', this.exitGame);
     exitButton.scale.setTo(0.7);
     exitButton.anchor.set(0.5);
     creditsText = game.add.text( 10, game.height - 10, '',{font: 'Pixel' ,fontSize: '28px', fill: '#fff'});
     creditsText.anchor.set(0, 1)
     creditsText.scale.setTo(0.7);


  },
  toggleSound: function(){
    if(!soundEnabled){
        yesButton.visible = true;
        noButton.visible = false;
        soundEnabled = true;
    }
    else{
        noButton.visible = true;
        yesButton.visible = false;
        soundEnabled = false;
    }
  },
  update: function(){
    this.background.tilePosition.y += 2;
      backgroundPos = this.background.tilePosition.y;
      
    creditsText.text = 'Jens Van Assche - Jordy Pereira \nLennert Peeters - Tymo de Kock';
    soundText.text = 'enable sound - ';
    if(soundEnabled){
          music.mute = false;
      }
      else{
          music.mute = true;
      }
  },
  exitGame: function(){
    game.state.start('titlescreen');
  },

}
