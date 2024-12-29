const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('#statusText');
const restartBtn = document.querySelector('#restartBtn');
const startBtn = document.querySelector('#startBtn');
const player1Input = document.querySelector('#player1');
const player2Input = document.querySelector('#player2');
const customNamesCheckbox = document.querySelector('#customNames');

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let options = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let running = false;
let player1Name = 'Shefain';
let player2Name = 'Monsour';

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
customNamesCheckbox.addEventListener('change', toggleNameInputs);

function startGame() {
  player1Name = customNamesCheckbox.checked && player1Input.value.trim() ? player1Input.value.trim() : 'Shefain';
  player2Name = customNamesCheckbox.checked && player2Input.value.trim() ? player2Input.value.trim() : 'Monsour';
  currentPlayer = 'X';
  options = ['', '', '', '', '', '', '', '', ''];
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('cell-clicked', 'winning-cell');
  });
  statusText.textContent = `${player1Name}'s turn`;
  running = true;
  restartBtn.style.display = 'block';
}

function cellClicked() {
  const cellIndex = this.getAttribute('cellIndex');

  // Prevent clicking on already filled or game-ended cells
  if (options[cellIndex] !== '' || !running) {
    return;
  }

  updateCell(this, cellIndex);
  checkWinner();
}

function updateCell(cell, index) {
  options[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add('cell-clicked');
}

function changePlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `${currentPlayer === 'X' ? player1Name : player2Name}'s turn`;
}

function checkWinner() {
  let roundWon = false;
  let winningCells = [];
  
  for (let i = 0; i < winConditions.length; i++) {
    const condition = winConditions[i];
    const cellA = options[condition[0]];
    const cellB = options[condition[1]];
    const cellC = options[condition[2]];

    if (cellA === '' || cellB === '' || cellC === '') {
      continue;
    }

    if (cellA === cellB && cellB === cellC) {
      roundWon = true;
      winningCells = condition;
      break;
    }
  }

  if (roundWon) {
    // Highlight winning cells
    highlightWinningCells(winningCells);
    displayCustomAlert(`${currentPlayer === 'X' ? player1Name : player2Name} wins!`);
    running = false;
  } else if (!options.includes('')) {
    statusText.textContent = 'Draw';
    displayCustomAlert('It\'s a draw!');
    running = false;
  } else {
    changePlayer();
  }
}

function highlightWinningCells(cells) {
  cells.forEach(index => {
    document.querySelector(`.cell[cellIndex="${index}"]`).classList.add('winning-cell');
  });
}

function displayCustomAlert(message) {
  // Create a custom alert
  const alertDiv = document.createElement('div');
  alertDiv.classList.add('custom-alert');
  alertDiv.textContent = message;
  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 3000);

  // Toastr notification
  toastr.options = {
    positionClass: 'toast-top-center',
    timeOut: 3000
  };
  toastr.success(message);
}

function restartGame() {
  startGame();
  statusText.textContent = `${player1Name}'s turn`;
}


function toggleNameInputs() {
  if (customNamesCheckbox.checked) {
    player1Input.disabled = false;
    player2Input.disabled = false;
  } else {
    player1Input.disabled = true;
    player2Input.disabled = true;
  }
}



cells.forEach(cell => cell.addEventListener('click', cellClicked));


// Initialize checkbox state
toggleNameInputs();