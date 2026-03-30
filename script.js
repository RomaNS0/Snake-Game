const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

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

// Функция для инициализации игры
function initGame() {
    // Создаем змейку из 3 сегментов
    snake = [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
    ];
    
    direction = 'RIGHT';
    nextDirection = 'RIGHT';
    score = 0;
    scoreElement.textContent = score;
    
    // Создаем первую еду
    generateFood();
    
    gameRunning = true;
}

// Функция генерации еды в случайном месте
function generateFood() {
    let newFood;
    let validPosition = false;
    
    while (!validPosition) {
        newFood = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
        
        // Проверяем, не появляется ли еда на змейке
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

// Функция отрисовки змейки
function drawSnake() {
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillStyle = '#4CAF50'; // голова - зеленый
        } else {
            ctx.fillStyle = '#8BC34A'; // тело - светлый зеленый
        }
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
        
        // Добавляем глаза для головы
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

// Функция отрисовки еды
function drawFood() {
    ctx.fillStyle = '#FF5252';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
    
    // Добавляем блик на еде
    ctx.fillStyle = '#FF8A80';
    ctx.fillRect(food.x * gridSize + 4, food.y * gridSize + 4, 4, 4);
}

// Функция отрисовки всего
function draw() {
    // Очищаем canvas
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawGrid();
    drawFood();
    drawSnake();
}

// Временная функция для тестирования
function test() {
    initGame();
    draw();
    console.log('Змейка создана:', snake);
    console.log('Еда создана:', food);
}

// Запускаем тест
test();