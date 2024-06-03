const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const character = {
  width: 120,
  height: 90,
  x: canvas.width / 2 - 15,
  y: canvas.height - 120,
  speed: 10,
  dx: 0,
};

const items = [];
let score = 0;
let life = 5
let gameOver = false;
let onPause = false;
let topScore = localStorage.getItem('topScore') || 0;

// Précharger les images
const bgImage = new Image();
bgImage.src = '../assets/bg.jpg';

const characterImage = new Image();
characterImage.src = '../assets/minecart.png';

const itemImage = new Image();
itemImage.src = '../assets/gold.png';

function drawBackground(){
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height)
}

function drawCharacter() {
  //ctx.fillStyle = 'transparent';
  //ctx.fillRect(character.x, character.y, character.width, character.height);
  ctx.drawImage(characterImage, character.x, character.y, character.width, character.height)
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function newItem() {
  const item = {
    width: 30,
    height: 30,
    x: Math.random() * (canvas.width - 20),
    y: 0,
    speed: 0.8 + Math.random() * 1.2,
  };
  if (!onPause && !gameOver) {
    items.push(item);
  }
  
}

function drawItems() {
  items.forEach(item => {
    ctx.drawImage(itemImage, item.x, item.y, item.width, item.height)
  });
}

function updateItems() {
  items.forEach(item => {
    item.y += item.speed;
  });
}

function moveCharacter() {
  character.x += character.dx;
  if (character.x < 0) character.x = 0;
  if (character.x + character.width > canvas.width) character.x = canvas.width - character.width;
}

function detectCollisions() {
  items.forEach((item, index) => {
    if (
      character.x < item.x + item.width &&
      character.x + character.width > item.x &&
      character.y < item.y + item.height &&
      character.height + character.y > item.y
    ) {
        items.splice(index, 1);
        score++
    }
  });
}

function loseLife() {
  items.forEach((item, index) => {
    if (item.y > canvas.height) {
      items.splice(index, 1);
      life--;
      if(life < 1) {
        if (score > topScore) {
          topScore = score;
          localStorage.setItem('topScore', topScore);
        }
        gameOver = true
      }
    }
  });
}

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '36px Arial';
  ctx.fillText(`Score: ${score}`, 8, 40);
}

function drawTopScore() {
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText(`Top: ${topScore}`, 8, 70);
}

function drawLife() {
    ctx.fillStyle = 'white';
    ctx.font = '36px Arial'
    ctx.fillText(`Vie: ${life}`, canvas.width - 100, 40)
}

function restartGame() {
  score = 0;
  life = 5;
  gameOver = false;
  onPause = false;
  items.length = 0;
  update();
}

function update() {
  if (!gameOver) {
    if (!onPause) {
      clear();
      drawBackground();
      drawCharacter();
      drawItems();
      drawScore();
      drawTopScore();
      drawLife();
      moveCharacter();
      updateItems();
      detectCollisions();
      loseLife();
      requestAnimationFrame(update);
    } else {
      ctx.fillStyle = 'white';
      ctx.font = '36px Arial';
      ctx.fillText('PAUSE', canvas.width / 2 - 60, canvas.height / 2);
    }
  } else {
    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.fillText('💀 Game Over', canvas.width / 2 - 60, canvas.height / 2);
  }
}

function keyDown(e) {
  if (e.key === 'ArrowRight' || e.key === 'Right') {
    character.dx = character.speed;
  } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
    character.dx = -character.speed;
  } else if (e.key === 'Escape') {
    pauseGame()
  } else if ((e.key === 'Enter' || e.key === ' ') && gameOver) {
    restartGame();
  }
}

function keyUp(e) {
  if (e.key === 'ArrowRight' || e.key === 'Right' || e.key === 'ArrowLeft' || e.key === 'Left') {
    character.dx = 0;
  }
}

function pauseGame() {
  onPause = !onPause;
  if (!onPause) {
    update();
  }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

setInterval(newItem, 2000);

update();
