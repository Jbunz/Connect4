document.addEventListener("DOMContentLoaded", function () {
  const board = document.querySelector(".board");
  const numColumns = 7;
  const numRows = 6;
  let currentPlayer = "Player 1";
  let gameOver = false;

  //  initialize the board.
  const createBoard = () => {
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numColumns; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-column", j);
        cell.setAttribute("data-row", i);
        cell.textContent = ""; // Set initial content to an empty string
        board.appendChild(cell);
      }
    }
  };

  // check for tie
  const checkTie = () => {
    const cells = document.querySelectorAll(".cell");
    for (let cell of cells) {
      if (cell.textContent === "") {
        return false;
      }
    }
    return true;
  };

  // Check win function
  const checkWin = (row, column, player) => {
    console.log("Checking win for player:", player);
    const directions = [
      [0, 1], // Horizontal
      [1, 0], // Vertical
      [1, 1], // Diagonal (from top-left to bottom-right)
      [1, -1], // Diagonal (from top-right to bottom-left)
    ];

    for (const [dx, dy] of directions) {
      let count = 1; // Count of consecutive circles
      let x = row + dx;
      let y = column + dy;
      while (
        x >= 0 &&
        x < numRows &&
        y >= 0 &&
        y < numColumns &&
        board.querySelector(`[data-row="${x}"][data-column="${y}"]`)
          .textContent === player
      ) {
        count++;
        x += dx;
        y += dy;
      }
      x = row - dx;
      y = column - dy;
      while (
        x >= 0 &&
        x < numRows &&
        y >= 0 &&
        y < numColumns &&
        board.querySelector(`[data-row="${x}"][data-column="${y}"]`)
          .textContent === player
      ) {
        count++;
        x -= dx;
        y -= dy;
      }
      console.log("Count:", count);
      if (count >= 4) {
        return true;
      }
    }
    return false;
  };

  // Player move function
  const playerMove = (column) => {
    if (!gameOver) {
      const cells = document.querySelectorAll(`.cell[data-column="${column}"]`);
      for (let i = numRows - 1; i >= 0; i--) {
        const cell = cells[i];
        if (cell.textContent === "") {
          cell.textContent = currentPlayer === "Player 1" ? "PL" : "AI";
          cell.classList.add("player");
          if (
            checkWin(
              parseInt(cell.getAttribute("data-row")),
              parseInt(column),
              currentPlayer
            )
          ) {
            gameOver = true;
            alert(`${currentPlayer} wins!`);
            return;
          }
          if (checkTie()) {
            gameOver = true;
            alert("It's a tie!");
          }
          currentPlayer =
            currentPlayer === "Player 1" ? "Player 2" : "Player 1";
          if (currentPlayer === "Player 2") {
            setTimeout(aiMove, 500); // setTimeout here
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

  // Function for AI move
  const aiMove = () => {
    if (!gameOver) {
      console.log("check AI move");
      debugger; // check logic
      // Check if player has won
      for (let column = 0; column < numColumns; column++) {
        if (checkWin(numRows - 1, column, "PL")) {
          gameOver = true;
          console.log("Player wins!");
          alert("Player wins!");
          return;
        }
      }

      // Proceed with AI move if player has not won
      let bestColumn = null;
      let bestScore = -Infinity;

      // Evaluate each column's desirability
      for (let column = 0; column < numColumns; column++) {
        // Check if the column is not full
        const cells = document.querySelectorAll(
          `.cell[data-column="${column}"]`
        );
        for (let i = numRows - 1; i >= 0; i--) {
          if (cells[i].textContent === "") {
            // Calculate score for this cell
            const score = evaluateColumn(column, "AI"); // AI's player token is "O"
            console.log(`Column ${column}, Row ${i}, Score: ${score}`);
            if (score > bestScore) {
              bestScore = score;
              bestColumn = column;
            }
            break; // Move to the next column
          }
        }
      }

      // Make the move in the column with the highest score
      if (bestColumn !== null) {
        console.log("AI chose column:", bestColumn);
        const cells = document.querySelectorAll(
          `.cell[data-column="${bestColumn}"]`
        );
        for (let i = numRows - 1; i >= 0; i--) {
          if (cells[i].textContent === "") {
            cells[i].textContent = "AI"; // AI's player token
            cells[i].classList.add("player", "ai"); // Add both selected and AI class
            if (checkWin(i, bestColumn, "AI")) {
              // Check if AI wins
              gameOver = true;
              console.log("AI wins!");
              alert("AI wins!");
            }
            if (checkTie()) {
              gameOver = true;
              console.log("It's a tie!");
              alert("It's a tie!");
            }
            currentPlayer = "Player 1"; // Switch to human player's turn
            return;
          }
        }
      }
    }
  };

  // Function to evaluate the desirability of a column for the AI
  const evaluateColumn = (column, player) => {
    const cells = document.querySelectorAll(`.cell[data-column="${column}"]`);
    let score = 0;

    // Check for player win
    for (let i = 0; i <= numRows - 4; i++) {
      let count = 0;
      for (let j = i; j < i + 4; j++) {
        const cell = board.querySelector(
          `.cell[data-row="${j}"][data-column="${column}"]`
        );
        if (cell && cell.textContent === player) {
          count++;
        }
      }
      if (count === 4) {
        // Player wins, return high score
        return 1000;
      }
    }

    return score; // Return the calculated score
  };

  // Start game
  createBoard();
  aiMove(); // Initiate AI's move at the beginning of the game
});
