const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// === Assets ===
const backgroundImg = new Image();
backgroundImg.src = "flappybirdbg.png";

// === Game Variables (Backend Only) ===
const gravity = 0.6;
const lift = -12;
let gameOver = false;
let score = 0;

// === Bird Object ===
const bird = {
  x: 60,
  y: 150,
  width: 34,
  height: 24,
  velocity: 0,

  flap() {
    this.velocity = lift;
  },

  update() {
    this.velocity += gravity;
    this.y += this.velocity;

    // Ground Collision
    if (this.y + this.height > canvas.height) {
      this.y = canvas.height - this.height;
      gameOver = true;
    }

    // Top Boundary
    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  },
};

// === Pipe System ===
const pipeGap = 150;
const pipeWidth = 52;
const pipeSpeed = 2;
const pipes = [];

function createPipe() {
  const top = Math.floor(Math.random() * (canvas.height / 2));
  const bottom = canvas.height - top - pipeGap;
  pipes.push({
    x: canvas.width,
    top,
    bottom,
    width: pipeWidth,
  });
}

function updatePipes() {
  for (let i = pipes.length - 1; i >= 0; i--) {
    const pipe = pipes[i];
    pipe.x -= pipeSpeed;

    // Remove offscreen pipes
    if (pipe.x + pipe.width < 0) {
      pipes.splice(i, 1);
      score++;
    }

    // Collision
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      gameOver = true;
    }
  }
}

// === Controls ===
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !gameOver) {
    bird.flap();
  }
});

// === Game Loop ===
let frameCount = 0;

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background only
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    bird.update();
    updatePipes();

    if (frameCount % 90 === 0) {
      createPipe();
    }

    frameCount++;
  }

  requestAnimationFrame(gameLoop);
}

backgroundImg.onload = () => {
  gameLoop(); // Start once the background is loaded
};
