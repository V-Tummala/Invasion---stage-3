var canvas;
var rocket1Image, rocket2Image,starImage, spaceImage, lifeImage;
var database, gameState, game, resetImg;
var form, player, playerCount;
var allPlayers, rocket1, rocket2, stars, fuels, asteroids, enemyShips;
var rockets = [];

function preload()
{
  rocket1Image = loadImage("assets/rocket1.png");
  rocket2Image = loadImage("assets/rocket2.png");
  spaceImage = loadImage("assets/space.gif");
  resetImg = loadImage("assets/reset.png");
  lifeImage = loadImage("assets/life.png");
}

function setup() 
{
  canvas = createCanvas(400, 500);

  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() 
{
  background(0);

  if (playerCount === 2) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }
}

function windowResized() 
{
  resizeCanvas(windowWidth, windowHeight);
}
