const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('finalScore');
const gameOverScreen = document.getElementById('gameOver');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

//  cores man
const colors = {
    snake: {
        head: '#9b59b6',     // Roxo claro
        body: '#8e44ad',     // Roxo médio
        contour: '#6c3483',  // Roxo escuro
        glow: '#9b59b6'      // Brilho roxo
    },
    food: {
        main: '#00ff44',     // Verde neon
        glow: '#00ff00'      // Brilho verde
    },
    background: '#000033'    // Azul espacial
};

let snake = [];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let gameLoop;
let gameSpeed = 100;

function initGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    dx = 1;
    dy = 0;
    score = 0;
    scoreElement.textContent = '0';
    gameOverScreen.style.display = 'none';
}

document.addEventListener('keydown', (event) => {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const SPACE = 32;

    if (event.keyCode === SPACE) {
        restartGame();
        return;
    }

    if (event.keyCode === LEFT_KEY && dx !== 1) {
        dx = -1;
        dy = 0;
    }
    if (event.keyCode === UP_KEY && dy !== 1) {
        dx = 0;
        dy = -1;
    }
    if (event.keyCode === RIGHT_KEY && dx !== -1) {
        dx = 1;
        dy = 0;
    }
    if (event.keyCode === DOWN_KEY && dy !== -1) {
        dx = 0;
        dy = 1;
    }
});

function startGame() {
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, gameSpeed);
}

function update() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }

    draw();
}

function draw() {
    // Fundo pow
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cobrinha 
    snake.forEach((segment, index) => {
        const gradient = ctx.createRadialGradient(
            segment.x * gridSize + gridSize/2,
            segment.y * gridSize + gridSize/2,
            0,
            segment.x * gridSize + gridSize/2,
            segment.y * gridSize + gridSize/2,
            gridSize/2
        );
        
        gradient.addColorStop(0, index === 0 ? colors.snake.head : colors.snake.body);
        gradient.addColorStop(1, colors.snake.contour);
        
        ctx.fillStyle = gradient;
        ctx.shadowColor = colors.snake.glow;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(segment.x * gridSize, segment.y * gridSize, gridSize-1, gridSize-1, 5);
        ctx.fill();
    });

    // ração
    ctx.shadowColor = colors.food.glow;
    ctx.shadowBlur = 20;
    ctx.fillStyle = colors.food.main;
    ctx.beginPath();
    ctx.roundRect(food.x * gridSize, food.y * gridSize, gridSize-1, gridSize-1, 5);
    ctx.fill();
}

function generateFood() {
    do {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
    } while (
        snake.some(segment => segment.x === food.x && segment.y === food.y)
    );
}

function gameOver() {
    clearInterval(gameLoop);
    gameOverScreen.style.display = 'block';
    finalScoreElement.textContent = score;
}

function restartGame() {
    clearInterval(gameLoop);
    ctx.shadowBlur = 0;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    initGame();
    startGame();
}

initGame();
startGame();