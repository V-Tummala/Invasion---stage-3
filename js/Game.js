class Game {
  constructor() 
  {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");

    this.playerMoving = false;

    this.lasersGroup = new Group();
    this.laserImage = loadImage("assets/laser.png");

    this.asteroidsGroup = new Group();
    this.asteroidImage = loadImage("assets/asteroid.png"); 

    this.starsGroup = new Group();
    this.starImage = loadImage("assets/star.png");

    this.backgroundY = 0;

    this.speed = 3;
  }

  getState() 
  {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) 
  {
    database.ref("/").update({
      gameState: state
    });
  }

  start() 
  {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    rocket1 = createSprite(width / 2 - 50, height-50);
    rocket1.addImage("rocket1", rocket1Image);
    rocket1.scale = 0.2;
    console.log(rocket1.x)
    console.log(rocket1.y)

    rocket2 = createSprite(width / 2 + 100, height-50);
    rocket2.addImage("rocket2", rocket2Image);
    rocket2.scale = 0.2;
    console.log(rocket2.x)
    console.log(rocket2.y)

    rockets = [rocket1, rocket2];
  }

  handleElements() 
  {
    form.hide();
    form.titleImg.position(20, 10);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetButton.class("resetButton");
    this.resetButton.position(380, 10);
  }
  
  handleResetButton() 
  {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {}
      });
      window.location.reload();
    });
  }

  handlePlayerControls()
  {
    if (keyIsDown(LEFT_ARROW) && player.positionX > width / 4 - 50) 
    {
      player.positionX -= 5;
      player.update();
    }

    if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 150) 
    {
      player.positionX += 5;
      player.update();
    }

    if (keyIsDown(32))
    {
      this.spawnLaser(player.positionX, player.positionY);
    }
  }

  spawnLaser(x, y) 
  {
    var laser = createSprite(x, y); 
    laser.depth = rocket1.depth + 1;
    laser.addImage("laser", this.laserImage);
    laser.scale = 0.1;
    laser.velocityY = -2;
  
    this.lasersGroup.add(laser);
  }

  showLife() 
  {
    push();
    image(lifeImage, 25, 470, 20, 20);
    fill("white");
    rect(30, 470, 185, 20);
    fill("#f50057");
    rect(30, 470, player.life, 20);
    noStroke();
    pop();
  }

  handleStars(index) 
  {
    rockets[index - 1].overlap(this.starsGroup, function(collector, collected) {
      player.score += 20;
      player.update();
      collected.remove();
    });
  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    This tag is used for displaying four spaces.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  play() 
  {
    this.handleElements();
    this.handleResetButton();
    
    Player.getPlayersInfo();

    if (allPlayers !== undefined) 
    {
      this.showLife();
      this.showLeaderboard();

      this.backgroundY += this.speed; 

      if (this.backgroundY > height) 
      {
        this.backgroundY = 0;
      }

      image(spaceImage, 0, this.backgroundY, 400, 500);
      image(spaceImage, 0, this.backgroundY - height, 400, 500);

      if (frameCount % 100 === 0) 
      {
        var asteroid = createSprite(Math.round(random(50, width - 50)), -50);
        asteroid.depth = rocket1.depth + 1;
        asteroid.addImage("asteroid", this.asteroidImage);
        asteroid.scale = 0.15;
        asteroid.velocity.y = this.speed + 1.5; 
        this.asteroidsGroup.add(asteroid);

        var star = createSprite(Math.round(random(50, width - 50)), -50);
        star.depth = rocket1.depth + 1;
        star.addImage("star", this.starImage);
        star.scale = 0.07;
        star.velocity.y = this.speed; 
        this.starsGroup.add(star);
      }

      for (var i = 0; i < this.asteroidsGroup.length; i++) 
      {
        var asteroid = this.asteroidsGroup[i];

        if (asteroid.position.y > height) 
        {
          asteroid.remove();
        }
      }

      for (var i = 0; i < this.asteroidsGroup.length; i++) 
      {
        var star = this.starsGroup[i];

        if (star.position.y > height) 
        {
          star.remove();
        }
      }

      var index = 0;
        for (var plr in allPlayers) 
        {
          index = index + 1;

          var x = allPlayers[plr].positionX;
          var y = height - allPlayers[plr].positionY;

          rockets[index - 1].position.x = x;
          rockets[index - 1].position.y = y;

          if (index === player.index) 
          {
            stroke(10);
            fill("purple");
            ellipse(x, y, 60, 60);

            if (keyIsDown(32)) 
            {
              var a = rockets[index - 1].position.x;
              var b = rockets[index - 1].position.y 
              this.spawnLaser(a,b); 
            }

            this.handleStars(index);
            this.handlePlayerControls();
            
          }
      }

      for (var i = 0; i < this.lasersGroup.length; i++) 
      {
        var laser = this.lasersGroup[i];
        if (laser.y < 0) 
        {
          laser.remove();
        }
      }

      drawSprites()
    }

    
   }

}
