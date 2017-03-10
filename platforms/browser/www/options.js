//state variables
var soundText;
var sfxText;
var creditsTextTop;
var creditsTextBottom;
var yesButton;
var noButton;
var yesSFXButton;
var noSFXButton;
var swipeText;
var onButton;
var offButton;
//initiating state
MyGame.optionsState = function (game) {};
MyGame.optionsState.prototype = {
  create: function() {
    //background and title
    this.background = game.add.tileSprite(0, 0, 600, 820, 'sky');
    this.background.tilePosition.y = backgroundPos;
    var title = game.add.image(game.world.centerX, 20, 'title');
    title.scale.setTo(0.7);
    title.anchor.set(0.5, 0);
    //sound enabler text
    soundText = game.add.text(game.world.centerX, game.height - 500, '',{font: 'Pixel', fontSize: '28px', fill: '#fff'});
    soundText.scale.setTo(1);
    soundText.anchor.set(0.5);
    yesButton = game.add.button(game.world.centerX, game.height - 450, 'buttonYes', this.toggleSound);
    yesButton.scale.setTo(1);
    yesButton.anchor.set(0.5);
    noButton = game.add.button(game.world.centerX, game.height - 450, 'buttonNo', this.toggleSound);
    noButton.scale.setTo(1);
    noButton.anchor.set(0.5);
    if(soundEnabled){
      yesButton.visible = true;
      noButton.visible = false;
    }
    else{
      yesButton.visible = false;
      noButton.visible = true;
    }
    //sfx enabler text
    sfxText = game.add.text(game.world.centerX, game.height - 380, '',{font: 'Pixel', fontSize: '28px', fill: '#fff'});
    sfxText.scale.setTo(1);
    sfxText.anchor.set(0.5);
    yesSFXButton = game.add.button(game.world.centerX, game.height - 330, 'buttonYes', this.toggleSFXSound);
    yesSFXButton.scale.setTo(1);
    yesSFXButton.anchor.set(0.5);
    noSFXButton = game.add.button(game.world.centerX, game.height - 330, 'buttonNo', this.toggleSFXSound);
    noSFXButton.scale.setTo(1);
    noSFXButton.anchor.set(0.5);
    if(sfxEnabled){
      yesSFXButton.visible = true;
      noSFXButton.visible = false;
    }
    else{
      yesSFXButton.visible = false;
      noSFXButton.visible = true;
    }
    //swiper enabled
    swipeText = game.add.text(game.world.centerX, game.height - 260, '',{font: 'Pixel', fontSize: '28px', fill: '#fff'});
    swipeText.scale.setTo(1);
    swipeText.anchor.set(0.5);
    onButton = game.add.button(game.world.centerX, game.height - 210, 'buttonYes', this.toggleSwipe);
    onButton.scale.setTo(1);
    onButton.anchor.set(0.5);
    offButton = game.add.button(game.world.centerX, game.height - 210, 'buttonNo', this.toggleSwipe);
    offButton.scale.setTo(1);
    offButton.anchor.set(0.5);
    if(swipeEnabled)
    {
      onButton.visible = true;
      offButton.visible = false;
    }
    else{
      onButton.visible = false;
      offButton.visible = true;
    }
    //exit button and credits
    var exitButton = game.add.button(game.width / 2, game.height - 125, 'exitOptions', this.exitGame);
    exitButton.scale.setTo(1.4);
    exitButton.anchor.set(0.5);
    creditsTextTop = game.add.text( game.world.centerX, game.height - 28, '',{font: 'Pixel' ,fontSize: '28px', fill: '#fff'});
    creditsTextTop.anchor.set(0.5, 1);
    creditsTextTop.scale.setTo(0.7);
    creditsTextBottom = game.add.text( game.world.centerX, game.height - 4, '',{font: 'Pixel', fontSize: '28px', fill: '#fff'});
    creditsTextBottom.anchor.set(0.5, 1);
    creditsTextBottom.scale.setTo(0.7);
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
  toggleSFXSound: function(){
    if(!sfxEnabled){
      yesSFXButton.visible = true;
      noSFXButton.visible = false;
      sfxEnabled = true;
    }
    else{
      noSFXButton.visible = true;
      yesSFXButton.visible = false;
      sfxEnabled = false;
    }
  },
  toggleSwipe: function(){
    if(!swipeEnabled){
      onButton.visible = true;
      offButton.visible = false;
      swipeEnabled = true;
    }
    else{
      onButton.visible = false;
      offButton.visible = true;
      swipeEnabled = false;
    }
  },
  update: function(){
    this.background.tilePosition.y += 2;
      backgroundPos = this.background.tilePosition.y;
      
    creditsTextTop.text = 'Jens Van Assche - Jordy Pereira';
    creditsTextBottom.text= 'Lennert Peeters - Tymo de Kock';
    soundText.text = 'enable sound?';
    sfxText.text = 'enable sfx sound?';
    swipeText.text = 'enable swiper?';
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