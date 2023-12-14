    const canvas = document.getElementById('gameCanvas');
    const scoreboard = document.getElementById('scoreboard');
    const ctx = canvas.getContext('2d');
    const menu = document.getElementById('menu');
    const gameCanvas = document.getElementById('gameCanvas');

    const player1ScoreElement = document.getElementById('player1Score');
    const player2ScoreElement = document.getElementById('player2Score');

    const floorImage = new Image();
    floorImage.src = 'Sources\\battlefield2.png'; // Cambia la ruta por la ubicación de tu imagen de fondo del piso

    const obstacleImage = new Image();
    obstacleImage.src = 'Sources\\block2.jpg'; // Cambia la ruta por la ubicación de tu imagen de obstáculo

    // Define un nuevo tipo de obstáculo que no puede ser destruido por las balas ni atravesado por el jugador
    const unbreakableObstacleImage = new Image();
    unbreakableObstacleImage.src = 'Sources\\rock1.png'; // Ruta de la imagen del nuevo obstáculo

    const tankImagePlayer1Up = new Image();
    tankImagePlayer1Up.src = 'Sources/tankImagePlayer1Up.png'; // Ruta de la imagen del tanque para el jugador 1 hacia arriba
    
    const tankImagePlayer1Down = new Image();
    tankImagePlayer1Down.src = 'Sources/tankImagePlayer1Down.png'; // Ruta de la imagen del tanque para el jugador 1 hacia abajo
    
    const tankImagePlayer1Left = new Image();
    tankImagePlayer1Left.src = 'Sources/tankImagePlayer1Left.png'; // Ruta de la imagen del tanque para el jugador 1 hacia la izquierda
    
    const tankImagePlayer1Right = new Image();
    tankImagePlayer1Right.src = 'Sources/tankImagePlayer1Right.png'; // Ruta de la imagen del tanque para el jugador 1 hacia la derecha
    
    const tankImagePlayer2Up = new Image();
    tankImagePlayer2Up.src = 'Sources/tankImagePlayer2Up.png'; // Ruta de la imagen del tanque para el jugador 2 hacia arriba
    
    const tankImagePlayer2Down = new Image();
    tankImagePlayer2Down.src = 'Sources/tankImagePlayer2Down.png'; // Ruta de la imagen del tanque para el jugador 2 hacia abajo
    
    const tankImagePlayer2Left = new Image();
    tankImagePlayer2Left.src = 'Sources/tankImagePlayer2Left.png'; // Ruta de la imagen del tanque para el jugador 2 hacia la izquierda
    
    const tankImagePlayer2Right = new Image();
    tankImagePlayer2Right.src = 'Sources/tankImagePlayer2Right.png'; // Ruta de la imagen del tanque para el jugador 2 hacia la derecha

    const mineImage = new Image();
    mineImage.src = 'Sources/mine.png'; // Ruta de la imagen de la mina

    const mines = []; // Almacena las posiciones de las minas

    let player1, player2;

    function initializeGame(mode) {
      scoreboard.style.display = 'block'; // Muestra el marcador
      document.getElementById('menu').style.display = 'none'; // Oculta el menú
      const controlsContainer = document.querySelector('.controls-container');
      controlsContainer.classList.add('hidden');
      menu.style.display = 'none';
      gameCanvas.style.display = 'block';
    
      if (mode === 'versusLocal') {
        // Initialize player 1 and player 2 with the respective tank images for different directions
        player1 = new Tank(
          tileSize * 1 + tileSize / 2,
          tileSize * 1 + tileSize / 2,
          'green',
          'w',
          's',
          'a',
          'd',
          'f',
          {
            'up': tankImagePlayer1Up,
            'down': tankImagePlayer1Down,
            'left': tankImagePlayer1Left,
            'right': tankImagePlayer1Right,
          }
        );
    
        player2 = new Tank(
          tileSize * 18 + tileSize / 2,
          tileSize * 13 + tileSize / 2,
          'blue',
          'o',
          'l',
          'k',
          'ñ',
          'j',
          {
            'up': tankImagePlayer2Up,
            'down': tankImagePlayer2Down,
            'left': tankImagePlayer2Left,
            'right': tankImagePlayer2Right,
          }
        );
      }
      gameLoop();
    }
    

    document.getElementById('versusAI').addEventListener('click', () => {
      initializeGame('versusAI');
    });

    document.getElementById('versusLocal').addEventListener('click', () => {
      initializeGame('versusLocal');
    });

    const tileSize = 32; // Tamaño de cada "casilla" en el mapa
    // const map = [
    //   [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    //   [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1]
    // ];

    // Eliminamos el mapa estático actual
    const map = generateRandomMap(20, 20); // Generamos un nuevo mapa aleatorio

    function generateRandomMap(rows, cols) {
      const map = [];
      for (let y = 0; y < rows; y++) {
        const row = [];
        for (let x = 0; x < cols; x++) {
          // Generar un número aleatorio entre 0 y 1
          const randomNumber = Math.floor(Math.random() * 2);
          row.push(randomNumber);
        }
        map.push(row);
      }

    // Garantizar que haya al menos un obstáculo irrompible en el mapa
    let placedUnbreakable = false;
    while (!placedUnbreakable) {
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);
      if (map[y][x] === 0) {
        map[y][x] = 2; // Establecer el nuevo tipo de obstáculo en esta posición
        placedUnbreakable = true;
      }
    }

    // Agregar más obstáculos irrompibles de manera aleatoria (en este caso, 10)
    const unbreakableCount = 30; // Número deseado de obstáculos irrompibles
    let placedCount = 0;
    while (placedCount < unbreakableCount) {
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);
      if (map[y][x] === 0) {
        map[y][x] = 2; // Establecer el nuevo tipo de obstáculo en esta posición
        placedCount++;
      }
    }
      return map;
    }


    class Tank {
      constructor(x, y, color, upKey, downKey, leftKey, rightKey, shootKey, tankImages) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.color = color;
        this.speed = 10;
        this.isShooting = false;
        this.lastMove = 'up';
        this.bullet = null;
        this.upKey = upKey;
        this.downKey = downKey;
        this.leftKey = leftKey;
        this.rightKey = rightKey;
        this.shootKey = shootKey;
          // Define nuevas propiedades para las imágenes de cada dirección
        this.tankImages = {
          'up': tankImagePlayer1Up, // Imagen para arriba del jugador 1
          'down': tankImagePlayer1Down, // Imagen para abajo del jugador 1
          'left': tankImagePlayer1Left, // Imagen para la izquierda del jugador 1
          'right': tankImagePlayer1Right, // Imagen para la derecha del jugador 1
          'up2': tankImagePlayer2Up, // Imagen para arriba del jugador 2
          'down2': tankImagePlayer2Down, // Imagen para abajo del jugador 2
          'left2': tankImagePlayer2Left, // Imagen para la izquierda del jugador 2
          'right2': tankImagePlayer2Right, // Imagen para la derecha del jugador 2
        };
            // Define las imágenes para el jugador actual
        this.tankImages = tankImages;
      }

      draw() {
        // Obtén la imagen correspondiente a la dirección actual del tanque
        const image = this.tankImages[this.lastMove];
        ctx.drawImage(image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
      }

      move(dx, dy) {
        const newX = this.x + dx;
        const newY = this.y + dy;
        
        // Restringe el movimiento si el tanque alcanza los bordes del canvas
        if (
          newX - this.width / 2 >= 0 &&
          newX + this.width / 2 <= canvas.width &&
          newY - this.height / 2 >= 0 &&
          newY + this.height / 2 <= canvas.height
        ) {
          if (
            !this.isColliding(newX - this.width / 2, newY - this.height / 2) &&
            !this.isColliding(newX + this.width / 2, newY - this.height / 2) &&
            !this.isColliding(newX - this.width / 2, newY + this.height / 2) &&
            !this.isColliding(newX + this.width / 2, newY + this.height / 2)
          ) {
            this.x = newX;
            this.y = newY;
          }
        }
      }

      isColliding(x, y) {
        const col = Math.floor(x / tileSize);
        const row = Math.floor(y / tileSize);
        return map[row][col] === 1 || map[row][col] === 2; // El jugador no podrá pasar por el nuevo tipo de obstáculo (2)
      }

      shoot() {
        if (!this.bullet) {
          let bulletSpeedX = 0;
          let bulletSpeedY = 0;
          if (this.lastMove === 'up') {
            bulletSpeedY = -8;
          } else if (this.lastMove === 'down') {
            bulletSpeedY = 8;
          } else if (this.lastMove === 'left') {
            bulletSpeedX = -8;
          } else if (this.lastMove === 'right') {
            bulletSpeedX = 8;
          }
          this.bullet = {
            x: this.x + this.width / 2 - 2,
            y: this.y,
            width: 4,
            height: 4,
            color: 'red',
            speedX: bulletSpeedX,
            speedY: bulletSpeedY,
            draw: function() {
              ctx.fillStyle = this.color;
              ctx.fillRect(this.x, this.y, this.width, this.height);
            },
            update: function() {
              this.x += this.speedX;
              this.y += this.speedY;
            }
          };
        }
      }
    }

      // Función para inicializar minas en posiciones aleatorias en el mapa
      function initializeMines(count) {
        for (let i = 0; i < count; i++) {
          const randomX = Math.floor(Math.random() * map[0].length);
          const randomY = Math.floor(Math.random() * map.length);
  
          if (map[randomY][randomX] === 0) {
            mines.push({ x: randomX * tileSize, y: randomY * tileSize });
          }
        }
      }
  
      // Llama a initializeMines con la cantidad deseada de minas
      initializeMines(30); // Por ejemplo, 5 minas

      function drawMap() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      
        // Dibuja la imagen de fondo extendiéndola por todo el canvas
        ctx.drawImage(floorImage, 0, 0, canvas.width, canvas.height);
      
        for (let y = 0; y < map.length; y++) {
          for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 1) {
              ctx.drawImage(obstacleImage, x * tileSize, y * tileSize, tileSize, tileSize);
            }
          }
        }
      
        for (let i = 0; i < mines.length; i++) {
          const mine = mines[i];
          ctx.drawImage(mineImage, mine.x, mine.y, tileSize, tileSize);
        }
        for (let y = 0; y < map.length; y++) {
          for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 1) {
              ctx.drawImage(obstacleImage, x * tileSize, y * tileSize, tileSize, tileSize);
            } else if (map[y][x] === 2) {
              ctx.drawImage(unbreakableObstacleImage, x * tileSize, y * tileSize, tileSize, tileSize);
            }
          }
        }
      }

    let player1Wins = 0;
    let player2Wins = 0;

    function checkBulletCollision(attacker, target) {
      if (attacker.bullet) {
        const bulletCol = Math.floor(attacker.bullet.x / tileSize);
        const bulletRow = Math.floor(attacker.bullet.y / tileSize);
        if (map[bulletRow] && map[bulletRow][bulletCol] === 1) {
          // Eliminar el obstáculo rompible si la bala colisiona
          map[bulletRow][bulletCol] = 0;
          attacker.bullet = null;
        } else if (map[bulletRow] && map[bulletRow][bulletCol] === 2) {
          // Destruir la bala si choca contra el obstáculo irrompible
          attacker.bullet = null;
        } else if (
          target &&
          bulletCol * tileSize < target.x + target.width / 2 &&
          bulletCol * tileSize + tileSize > target.x - target.width / 2 &&
          bulletRow * tileSize < target.y + target.height / 2 &&
          bulletRow * tileSize + tileSize > target.y - target.height / 2
        ) {
          // Si el objetivo es impactado por el disparo del atacante
          target = null;
          attacker.bullet = null;
          if (attacker === player1) {
            player1Wins++;
          } else if (attacker === player2) {
            player2Wins++;
          }
          resetGame();
        }
      }
    }
    

    function checkMineCollision(player) {
      for (let i = 0; i < mines.length; i++) {
        const mine = mines[i];
        const safeDistance = 10; // Define una distancia de seguridad para la colisión
        if (
          player.x < mine.x + tileSize - safeDistance &&
          player.x + player.width > mine.x + safeDistance &&
          player.y < mine.y + tileSize - safeDistance &&
          player.y + player.height > mine.y + safeDistance
        ) {
          if (player === player2) {
            player2Wins--; // Resta un punto al jugador 2
          } else if (player === player1) {
            player1Wins--; // Resta un punto al jugador 1
          }
          resetGame();
          mines.splice(i, 1); // Elimina la mina del arreglo
          break;
        }
      }
    }
    
    function resetGame() {
    // Reiniciar posiciones y balas
    player1.x = tileSize * 1 + tileSize / 2;
    player1.y = tileSize * 1 + tileSize / 2;
    player1.bullet = null;

    player2.x = tileSize * 18 + tileSize / 2;
    player2.y = tileSize * 13 + tileSize / 2;
    player2.bullet = null;
    }

    function updateScore() {
      player1ScoreElement.textContent = `Player 1 | ${player1Wins}`;
      player2ScoreElement.textContent = `${player2Wins} | Player 2`;
    }

    function drawScore() {
        // ctx.fillStyle = "xian";
        // ctx.font = "20px Arial";
        // ctx.fillText(`Player 1: ${player1Wins}`, 20, 40);
        // ctx.fillText(`Player 2: ${player2Wins}`, canvas.width - 150, 40);
        updateScore(); // Llama a la función para actualizar el marcador en el HTML
      }

    function drawGame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawMap();
      if (player1 && player1.isShooting && !player1.bullet) {
        player1.shoot();
      }
      if (player2 && player2.isShooting && !player2.bullet) {
        player2.shoot();
      }
      if (player1 && player2) {
        checkBulletCollision(player1, player2);
        checkBulletCollision(player2, player1);
        }
      if (player1 && player1.bullet) {
        player1.bullet.draw();
        player1.bullet.update();
        checkBulletCollision(player1);
        if (
          player1.bullet &&
          (player1.bullet.y < 0 || player1.bullet.y > canvas.height || player1.bullet.x < 0 || player1.bullet.x > canvas.width)
        ) {
          player1.bullet = null;
        }
      }
      if (player2 && player2.bullet) {
        player2.bullet.draw();
        player2.bullet.update();
        checkBulletCollision(player2);
        if (
          player2.bullet &&
          (player2.bullet.y < 0 || player2.bullet.y > canvas.height || player2.bullet.x < 0 || player2.bullet.x > canvas.width)
        ) {
          player2.bullet = null;
        }
      }
      if (player1) {
        player1.draw();
      }
      if (player2) {
        player2.draw();
      }
      if (player1) {
        player1.draw();
        checkMineCollision(player1); // Verifica colisión con minas para el jugador 1
      }
      if (player2) {
        player2.draw();
        checkMineCollision(player2); // Verifica colisión con minas para el jugador 2
      }
      
      if (player1Wins >= 3 || player2Wins >= 3) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawScore();
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        if (player1Wins >= 3) {
        ctx.fillText("Player 1 WINS!", canvas.width / 2 - 100, canvas.height / 2);
        } else {
        ctx.fillText("Player 2 WINS!", canvas.width / 2 - 100, canvas.height / 2);
        }
        return;
    }

    // ... tu código existente
    drawScore();
    }

    function handleKeyPress(event) {
      if (player1) {
        handlePlayerKeyPress(player1, event);
      }
      if (player2) {
        handlePlayerKeyPress(player2, event);
      }
    }

    function handlePlayerKeyPress(player, event) {
      let dx = 0;
      let dy = 0;
      const keyPressed = event.key.toLowerCase();
      if (keyPressed === player.upKey.toLowerCase()) {
        dy = -player.speed;
        player.lastMove = 'up';
      } else if (keyPressed === player.downKey.toLowerCase()) {
        dy = player.speed;
        player.lastMove = 'down';
      } else if (keyPressed === player.leftKey.toLowerCase()) {
        dx = -player.speed;
        player.lastMove = 'left';
      } else if (keyPressed === player.rightKey.toLowerCase()) {
        dx = player.speed;
        player.lastMove = 'right';
      } else if (keyPressed === player.shootKey.toLowerCase()) {
        player.isShooting = true;
      }
      player.move(dx, dy);
    }

    function handleKeyRelease(event) {
      const keyPressed = event.key.toLowerCase();
      if (player1 && keyPressed === player1.shootKey.toLowerCase()) {
        player1.isShooting = false;
      }
      if (player2 && keyPressed === player2.shootKey.toLowerCase()) {
        player2.isShooting = false;
      }
    }

    function gameLoop() {
      drawGame();
      requestAnimationFrame(gameLoop);
    }

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyRelease);

// Obtener referencias a los elementos del DOM
const canvasMenuDiv = document.getElementById('canvasMenu');

// Definimos una variable para controlar si ya se ha posicionado el menú
let menuPositioned = false;

// Función para posicionar el menú emergente en el centro del canvas
function positionCanvasMenu() {
  if (!menuPositioned) {
    const rect = gameCanvas.getBoundingClientRect(); // Obtener el rectángulo del canvas
    const menuRect = canvasMenuDiv.getBoundingClientRect(); // Obtener el rectángulo del menú
    
    const centerX = rect.left + rect.width / 2 - menuRect.width / 2 -110; // Calcular el centro X
    const centerY = rect.top + rect.height / 2 - menuRect.height / 2; // Calcular el centro Y
    
    canvasMenuDiv.style.left = centerX + 'px'; // Posicionar el menú en el centro X del canvas
    canvasMenuDiv.style.top = centerY + 'px'; // Posicionar el menú en el centro Y del canvas
    
    menuPositioned = true; // Marcar que el menú se ha posicionado
  }
}

// Funciones para mostrar y ocultar el menú del canvas
function showCanvasMenu() {
  positionCanvasMenu();
  canvasMenuDiv.style.display = 'block';
  gameCanvas.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Color negro con 50% de opacidad
}

function hideCanvasMenu(event) {
  if (
    !event.relatedTarget ||
    (!canvasMenuDiv.contains(event.relatedTarget) &&
      !Array.from(canvasMenuDiv.getElementsByTagName('*')).includes(event.relatedTarget))
  ) {
    canvasMenuDiv.style.display = 'none';
    gameCanvas.style.backgroundColor = 'transparent'; // Restaura el fondo original
  }
}

// Agregar eventos al canvas para manejar el menú
gameCanvas.addEventListener('mouseenter', showCanvasMenu);
gameCanvas.addEventListener('mouseleave', hideCanvasMenu);

// Selecciona el botón "Volver al Menú"
const returnButton = document.getElementById('returnToMenu');

// Agrega un evento 'click' al botón
returnButton.addEventListener('click', () => {
  // Lógica para volver al menú principal

  // Por ejemplo, puedes redirigir a la página principal del juego
  window.location.href = 'index.html'; // Cambia 'index.html' por la ruta correcta de tu menú principal
});

function resetMatch() {
  // Restablece las puntuaciones
  player1Wins = 0;
  player2Wins = 0;

  // Genera un nuevo mapa
  map = generateRandomMap(20, 20); // Genera un mapa de 20x20, puedes ajustar el tamaño si es necesario
  initializeMines(30); // Reinicia las minas en el nuevo mapa

  // Reinicia el juego con el nuevo mapa
  initializeGame('versusLocal');
}


const restartButton = document.getElementById('restartGame');

restartButton.addEventListener('click', () => {
  resetMatch();
});

function resetMatch() {
  player1Wins = 0;
  player2Wins = 0;

  map = generateRandomMap(20, 20);
  initializeMines(30);
  initializeGame('versusLocal');
}


