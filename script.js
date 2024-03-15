const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const ballRadius = 10;
let gameRunning = false;
let intervalId; // Variable to store the interval ID
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let score = 0;


const paddleHeight = 10;
const paddleWidth = 75;

let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks[c][r];
        if (b.status === 1) {
          if (
            x > b.x &&
            x < b.x + brickWidth &&
            y > b.y &&
            y < b.y + brickHeight
          ) {
            dy = -dy;
            b.status = 0;
            score++;
          }
        }
      }
    }
  }
  
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#882200";
  ctx.fill();
  ctx.closePath();
}
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#800000";
  ctx.fill();
  ctx.closePath();
}
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#860";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
    ctx.font = "16px Honk";
    ctx.fillStyle = "#008800";
    ctx.fillText(`Score: ${score}`, 8, 20);
  }
  

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
  
    if (!gameRunning) {
      return; // Stop the game if it's not running
    }
  
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        if ((y = y - paddleHeight)) {
          dy = -dy;
        }
      } else {
        gameRunning = false; // Stop the game after game over
        alert("GAME OVER");
        return; // Stop further execution of the draw function
      }
    }
    
    // Check for win condition
    let totalBricks = brickRowCount * brickColumnCount;
    let remainingBricks = 0;
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
          remainingBricks++;
        }
      }
    }
    if (remainingBricks === 0) {
      gameRunning = false; // Stop the game after winning
      alert("YOU WIN!");
      return; // Stop further execution of the draw function
    }
  
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= 7;
    }
  
    x += dx;
    y += dy;
  }

function resetGame() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 2;
    dy = -2;
    score = 0;
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    
  }

  function startGame() {
    if (!gameRunning) {
      gameRunning = true;
      resetGame(); // Reset the game before starting
      if (intervalId) {
        clearInterval(intervalId); // Clear the previous interval if it exists
      }
      
      intervalId = setInterval(draw, 10);
    }
  }

document.getElementById("runButton").addEventListener("click", function () {
  startGame();
  //this.disabled = true; //diables the start button
});
