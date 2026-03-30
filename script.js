// Сanvas элемент
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Размеры игрового поля
const gridSize = 20; // размер одной клетки в пикселях
const gridWidth = canvas.width / gridSize; // 20 клеток по ширине
const gridHeight = canvas.height / gridSize; // 20 клеток по высоте

// Переменные игры
let snake = []; // массив для хранения позиций змейки
let food = {}; // объект для хранения позиции еды
let direction = 'RIGHT'; // текущее направление
let nextDirection = 'RIGHT'; // следующее направление
let gameLoop = null; // для хранения интервала игры
let score = 0; // счет
let gameRunning = false; // статус игры

// Функция для отрисовки сетки (вспомогательная)
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

// Временная функция для тестирования
function init() {
    console.log('Игра инициализирована');
    drawGrid();
}

// Запускаем инициализацию
init();