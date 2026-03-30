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
// Функция обработки нажатий клавиш
function handleKeyPress(event) {
    if (!gameRunning) return;
    
    const key = event.key;
    
    // Запрещаем движение в противоположном направлении
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

// Функция движения змейки
function moveSnake() {
    // Обновляем направление
    direction = nextDirection;
    
    // Вычисляем новую голову
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
    
    // Добавляем новую голову
    snake.unshift(newHead);
    
    // Проверяем, съела ли змейка еду
    if (newHead.x === food.x && newHead.y === food.y) {
        // Увеличиваем счет
        score++;
        scoreElement.textContent = score;
        // Генерируем новую еду
        generateFood();
    } else {
        // Удаляем хвост, если еда не съедена
        snake.pop();
    }
}

// Функция проверки столкновений
function checkCollision() {
    const head = snake[0];
    
    // Проверка столкновения со стенами
    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
        return true;
    }
    
    // Проверка столкновения с собой
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// Основной игровой цикл
function update() {
    if (!gameRunning) return;
    
    moveSnake();
    
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    draw();
}

// Функция завершения игры
function gameOver() {
    gameRunning = false;
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
    alert(`Игра окончена! Ваш счет: ${score}`);
}

// Функция запуска игры
function startGame() {
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    
    initGame();
    draw();
    gameLoop = setInterval(update, 150);
}

// Подключаем обработчик клавиш
document.addEventListener('keydown', handleKeyPress);

// Обновляем тестовую функцию
function test() {
    startGame();
}

// Запускаем тест
test();