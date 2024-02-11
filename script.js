document.addEventListener("DOMContentLoaded", function () {
    const board = document.querySelector(".board");
    const numColumns = 7;
    const numRows = 6;
    let currentPlayer = "Player 1";
    let gameOver = false;
  
    // This code eliminated the need for 42 divs in HTML
    // Code here to initialize the board.
    const createBoard = () => {
      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
          const cell = document.createElement("div");
          cell.classList.add("cell");
          cell.setAttribute("data-column", j);
          cell.setAttribute("data-row", i);
          board.appendChild(cell);
        }
      }
    };
  
    
  // Check win function
const checkWin = (row, column, player) => {
    const directions = [
      [0, 1],   // Horizontal
      [1, 0],   // Vertical
      [1, 1],   // Diagonal (from top-left to bottom-right)
      [1, -1]   // Diagonal (from top-right to bottom-left)
    ];
  
    for (const [dx, dy] of directions) {
      let count = 1; // Count of consecutive circles
      let x = row + dx;
      let y = column + dy;
      while (x >= 0 && x < numRows && y >= 0 && y < numColumns &&
             board.querySelector(`[data-row="${x}"][data-column="${y}"]`).textContent === player) {
        count++;
        x += dx;
        y += dy;
      }
      x = row - dx;
      y = column - dy;
      while (x >= 0 && x < numRows && y >= 0 && y < numColumns &&
             board.querySelector(`[data-row="${x}"][data-column="${y}"]`).textContent === player) {
        count++;
        x -= dx;
        y -= dy;
      }
      if (count === 4) { // Change this line to check for exactly four circles
        return true;
      }
    }
    return false;
  };
  
    //Function to check for tie
    const checkTie = () => {
      const cells = document.querySelectorAll(".cell");
      for (let cell of cells) {
        if (cell.textContent === "") {
          return false;
        }
      }
      return true;
    };
  
  // Player move function
const playerMove = (column) => {
    if (!gameOver) {
      const cells = document.querySelectorAll(`.cell[data-column="${column}"]`);
      for (let i = numRows - 1; i >= 0; i--) {
        const cell = cells[i];
        if (cell.textContent === "") {
          cell.textContent = currentPlayer === "Player 1" ? "X" : "O";
          cell.classList.add("selected");
          if (checkWin(parseInt(cell.getAttribute("data-row")), parseInt(column), currentPlayer)) {
            gameOver = true;
            alert(`${currentPlayer} wins!`);
            return;
          }
          if (checkTie()) {
            gameOver = true;
            alert("It's a tie!");
          }
          currentPlayer = currentPlayer === "Player 1" ? "Player 2" : "Player 1";
          if (currentPlayer === "Player 2") {
            setTimeout(aiMove, 500); // Move setTimeout here
          }
          return;
        }
      }
    }
  };
  
  // Event listener for players' click
  board.addEventListener("click", (event) => {
    if (currentPlayer === "Player 1") {
      const column = event.target.getAttribute("data-column");
      playerMove(column);
    }
  });
  
    // Function to evaluate the desirability of a column for the AI
    const evaluateColumn = (column) => {
      const cells = document.querySelectorAll(`.cell[data-column="${column}"]`);
      let score = 0;
  
      // Check vertically
      for (let i = numRows - 1; i >= 0; i--) {
        if (cells[i] && cells[i].textContent === "") {
          score++;
        } else {
          break;
        }
      }
  
      // Check horizontally
      for (let i = 0; i <= numColumns - 4; i++) {
        let count = 0;
        for (let j = i; j < i + 4; j++) {
          if (cells[j] && cells[j].textContent === currentPlayer) {
            count++;
          }
        }
        if (count === 3) {
          score += 5; // Encourage completing a line
        }
      }
  
      return score;
    };
  
    // Function for AI move
    const aiMove = () => {
      if (!gameOver) {
        let bestColumn = null;
        let bestScore = -Infinity;
  
        // Evaluate each column's desirability
        for (let column = 0; column < numColumns; column++) {
          // Check if the column is not full
          const cells = document.querySelectorAll(
            `.cell[data-column="${column}"]`
          );
          if (cells[numRows - 1].textContent === "") {
            // Calculate score for this column
            const score = evaluateColumn(column);
            if (score > bestScore) {
              bestScore = score;
              bestColumn = column;
            }
          }
        }
  
        console.log("Best Column:", bestColumn, "Best Score:", bestScore);
  
        // Make the move in the column with the highest score
        if (bestColumn !== null) {
          for (let i = numRows - 1; i >= 0; i--) {
            const cell = board.querySelector(
              `.cell[data-row="${i}"][data-column="${bestColumn}"]`
            );
            if (cell.textContent === "") {
              cell.textContent = currentPlayer === "Player 1" ? "X" : "O";
              cell.classList.add("selected", "ai"); // Add both selected and AI class
              if (checkWin(i, bestColumn, currentPlayer)) {
                gameOver = true;
                alert(`${currentPlayer} wins!`);
              }
              if (checkTie()) {
                gameOver = true;
                alert("It's a tie!");
              }
              currentPlayer =
                currentPlayer === "Player 1" ? "Player 2" : "Player 1";
              return;
            }
          }
        }
      }
    };
  
  
    // Start game
    createBoard();
  });
  