// const canvas = document.getElementById("gameCanvas");
// const ctx = canvas.getContext("2d");

// canvas.width = 400;
// canvas.height = 600;

// // === Assets ===
// const backgroundImg = new Image();
// backgroundImg.src = "flappybirdbg2.jpg";

// // === Game Variables (Backend Only) ===
// const gravity = 0.6;
// const lift = -12;
// let gameOver = false;
// let score = 0;

// // === Bird Object ===
// const bird = {
//   x: 60,
//   y: 150,
//   width: 34,
//   height: 24,
//   velocity: 0,

//   flap() {
//     this.velocity = lift;
//   },

//   update() {
//     this.velocity += gravity;
//     this.y += this.velocity;

//     // Ground Collision
//     if (this.y + this.height > canvas.height) {
//       this.y = canvas.height - this.height;
//       gameOver = true;
//     }

//     // Top Boundary
//     if (this.y < 0) {
//       this.y = 0;
//       this.velocity = 0;
//     }
//   },
// };

// // === Pipe System ===
// const pipeGap = 150;
// const pipeWidth = 52;
// const pipeSpeed = 2;
// const pipes = [];

// function createPipe() {
//   const top = Math.floor(Math.random() * (canvas.height / 2));
//   const bottom = canvas.height - top - pipeGap;
//   pipes.push({
//     x: canvas.width,
//     top,
//     bottom,
//     width: pipeWidth,
//   });
// }

// function updatePipes() {
//   for (let i = pipes.length - 1; i >= 0; i--) {
//     const pipe = pipes[i];
//     pipe.x -= pipeSpeed;

//     // Remove offscreen pipes
//     if (pipe.x + pipe.width < 0) {
//       pipes.splice(i, 1);
//       score++;
//     }

//     // Collision
//     if (
//       bird.x < pipe.x + pipe.width &&
//       bird.x + bird.width > pipe.x &&
//       (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
//     ) {
//       gameOver = true;
//     }
//   }
// }

// // === Controls ===
// document.addEventListener("keydown", (e) => {
//   if (e.code === "Space" && !gameOver) {
//     bird.flap();
//   }
// });

// // === Game Loop ===
// let frameCount = 0;

// function gameLoop() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   // Draw background only
//   ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

//   if (!gameOver) {
//     bird.update();
//     updatePipes();

//     if (frameCount % 90 === 0) {
//       createPipe();
//     }

//     frameCount++;
//   }

//   requestAnimationFrame(gameLoop);
// }

// backgroundImg.onload = () => {
//   gameLoop(); // Start once the background is loaded
// };

// 


const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load Images
const bgImage = loadImage("flappyBirdMobileBg.png");
const birdImage = loadImage("flappybird.png");
const topPipe = loadImage("theTopPipe.png");
const bottomPipe = loadImage("theBottomPipe.png");
const playButton = loadImage("flappyBirdPlayButton.png");
const gameLogo = loadImage("flappyBirdGameLogo.png");
const gameOverImage = loadImage("gameOverLogo.png");

let gameStarted = false;
let gameOver = false;
let score = 0;
let frameCount = 0;
const pipes = [];

// Bird Object
const bird = {
  x: 60,
  y: 200,
  width: 34,
  height: 24,
  velocity: 0,
  gravity: 0.6,
  lift: -10,

  flap() {
    this.velocity = this.lift;
  },

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    if (this.y + this.height >= canvas.height) {
      this.y = canvas.height - this.height;
      gameOver = true;
    }

    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  },

  draw() {
    ctx.drawImage(birdImage, this.x, this.y, this.width, this.height);
  },
};

function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

// Pipe Logic
function createPipe() {
  const gap = 150;
  const top = Math.random() * (canvas.height / 2);
  pipes.push({
    x: canvas.width,
    top: top,
    bottom: canvas.height - top - gap,
    passed: false,
    width: 52,
    speed: 2,
  });
}

function updatePipes() {
  pipes.forEach((pipe) => {
    pipe.x -= pipe.speed;

    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      score++;
      pipe.passed = true;
    }

    // Collision
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      gameOver = true;
    }
  });

  // Remove off-screen pipes
  while (pipes.length && pipes[0].x + pipes[0].width < 0) {
    pipes.shift();
  }
}

function drawPipes() {
  pipes.forEach((pipe) => {
    ctx.drawImage(topPipe, pipe.x, 0, pipe.width, pipe.top);
    ctx.drawImage(
      bottomPipe,
      pipe.x,
      canvas.height - pipe.bottom,
      pipe.width,
      pipe.bottom
    );
  });
}

// UI Screens
function drawStartScreen() {
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(gameLogo, canvas.width / 2 - 130, 100, 260, 80);
  ctx.drawImage(playButton, canvas.width / 2 - 50, 300, 100, 60);
}

function drawGameOverScreen() {
  ctx.drawImage(gameOverImage, canvas.width / 2 - 130, 150, 260, 80);
  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.fillText("Press R to Restart", canvas.width / 2 - 80, 260);
}

// Score Display
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "28px Arial";
  ctx.fillText("Score: " + score, 10, 40);
}

// Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  if (!gameStarted) {
    drawStartScreen();
    return;
  }

  if (!gameOver) {
    bird.update();
    bird.draw();

    if (frameCount % 90 === 0) {
      createPipe();
    }

    updatePipes();
    drawPipes();
    drawScore();
    frameCount++;
    requestAnimationFrame(gameLoop);
  } else {
    bird.draw();
    drawPipes();
    drawScore();
    drawGameOverScreen();
  }
}

// Start & Restart
canvas.addEventListener("click", (e) => {
  if (!gameStarted && isOverPlayButton(e.offsetX, e.offsetY)) {
    startGame();
  }
});

function isOverPlayButton(x, y) {
  const btnX = canvas.width / 2 - 50;
  const btnY = 300;
  return x >= btnX && x <= btnX + 100 && y >= btnY && y <= btnY + 60;
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && gameStarted && !gameOver) {
    bird.flap();
  } else if (e.code === "KeyR" && gameOver) {
    restartGame();
  }
});

function startGame() {
  gameStarted = true;
  frameCount = 0;
  pipes.length = 0;
  score = 0;
  bird.y = 200;
  bird.velocity = 0;
  gameLoop();
}

function restartGame() {
  gameOver = false;
  frameCount = 0;
  pipes.length = 0;
  score = 0;
  bird.y = 200;
  bird.velocity = 0;
  gameLoop();
}

// Initial render
window.onload = () => {
  drawStartScreen();
};