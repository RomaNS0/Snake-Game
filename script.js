const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('startBtn');

const gridSize = 20;
const gridWidth = canvas.width / gridSize;
const gridHeight = canvas.height / gridSize;

let snake = [];
let food = {};
let direction = 'RIGHT';
let nextDirection = 'RIGHT';
let gameLoop = null;
let score = 0;
let gameRunning = false;

let highScore = localStorage.getItem('snakeHighScore') || 0;
const highScoreElement = document.getElementById('highScore');
highScoreElement.textContent = highScore;

function drawGrid() {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i <= gridWidth; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

function initGame() {
    snake = [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
    ];
    
    direction = 'RIGHT';
    nextDirection = 'RIGHT';
    score = 0;
    scoreElement.textContent = score;
    gameRunning = true;
    
    generateFood();
}

function generateFood() {
    let newFood;
    let validPosition = false;
    
    while (!validPosition) {
        newFood = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
        
        validPosition = true;
        for (let segment of snake) {
            if (segment.x === newFood.x && segment.y === newFood.y) {
                validPosition = false;
                break;
            }
        }
    }
    
    food = newFood;
}

function drawSnake() {
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillStyle = '#4CAF50';
        } else {
            ctx.fillStyle = '#8BC34A';
        }
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
        
        if (index === 0) {
            ctx.fillStyle = 'white';
            const eyeSize = 3;
            const eyeOffset = 5;
            
            if (direction === 'RIGHT') {
                ctx.fillRect(segment.x * gridSize + gridSize - eyeOffset, segment.y * gridSize + 5, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + gridSize - eyeOffset, segment.y * gridSize + gridSize - 8, eyeSize, eyeSize);
            } else if (direction === 'LEFT') {
                ctx.fillRect(segment.x * gridSize + eyeOffset - eyeSize, segment.y * gridSize + 5, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + eyeOffset - eyeSize, segment.y * gridSize + gridSize - 8, eyeSize, eyeSize);
            } else if (direction === 'UP') {
                ctx.fillRect(segment.x * gridSize + 5, segment.y * gridSize + eyeOffset - eyeSize, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + gridSize - 8, segment.y * gridSize + eyeOffset - eyeSize, eyeSize, eyeSize);
            } else if (direction === 'DOWN') {
                ctx.fillRect(segment.x * gridSize + 5, segment.y * gridSize + gridSize - eyeOffset, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + gridSize - 8, segment.y * gridSize + gridSize - eyeOffset, eyeSize, eyeSize);
            }
        }
    });
}

function drawFood() {
    ctx.fillStyle = '#FF5252';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
    ctx.fillStyle = '#FF8A80';
    ctx.fillRect(food.x * gridSize + 4, food.y * gridSize + 4, 4, 4);
}

function draw() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawFood();
    drawSnake();
}

function handleKeyPress(event) {
    if (!gameRunning) return;
    
    const key = event.key;
    
    if (key === 'ArrowUp' && direction !== 'DOWN') {
        nextDirection = 'UP';
    } else if (key === 'ArrowDown' && direction !== 'UP') {
        nextDirection = 'DOWN';
    } else if (key === 'ArrowLeft' && direction !== 'RIGHT') {
        nextDirection = 'LEFT';
    } else if (key === 'ArrowRight' && direction !== 'LEFT') {
        nextDirection = 'RIGHT';
    }
}

function moveSnake() {
    direction = nextDirection;
    let newHead = {...snake[0]};
    
    switch(direction) {
        case 'UP':
            newHead.y--;
            break;
        case 'DOWN':
            newHead.y++;
            break;
        case 'LEFT':
            newHead.x--;
            break;
        case 'RIGHT':
            newHead.x++;
            break;
    }
    
    snake.unshift(newHead);
    
    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];
    
    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
        return true;
    }
    
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

function update() {
    if (!gameRunning) return;
    
    moveSnake();
    
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    draw();
}

function gameOver() {
    gameRunning = false;
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }

    if (score > highScore) {
    highScore = score;
    localStorage.setItem('snakeHighScore', highScore);
    highScoreElement.textContent = highScore;
}

    setTimeout(() => {
        alert(`Игра окончена! Ваш счет: ${score}`);
    }, 50);
}

function startGame() {
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
    
    initGame();
    draw();
    // Скорость увеличивается со счетом
    let speed = Math.max(150 - Math.floor(score / 10) * 5, 50);
    gameLoop = setInterval(update, speed);
}

// Обработчики событий
document.addEventListener('keydown', handleKeyPress);
startBtn.addEventListener('click', () => {
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
    startGame();
});

// Инициализация
startGame();