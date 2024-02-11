document.addEventListener("DOMContentLoaded", function () {
  const board = document.querySelector(".board");
  const numColumns = 7;
  const numRows = 6;
  let currentPlayer = "PLayer 1";
  let gameOver = false;

// This code eliminated the need for 42 divs in HTML 
// Code here to initialize the board.
const createBoard = () => {
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++){
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.setAttribute("data-column", j);
            cell.setAttribute("data-row", i);
            board.appendChild(cell);
        }
    }
};
// player move function
const playerMove = (column) => {
// logic for players token in column
// check for win or tie
// switch turns
if (!gameOver){
    const cells = document.querySelectorAll(`.cell[data-column"${column}"]`);
    for (let i = numRows - 1; i >= 0; i--){
        const cell = cells[i];
        if (cell.textContent ==="") {
            cell.textContent = currentPlayer === "Player 1" ? "X" : "0"
            if (checkWin(parseInt(cell.getAttribute("data-row")), parseInt(column))) {
               gameOver = true;
               alert(`${currentPlayer} wins!`);
               return;
            }
        }
    }
}
};

// AI move function
const aiMove = () => {

};

// event listener for players click.
board.addEventListener("click", (event) => {
    if (currentPlayer === "PLayer 1") {
        const column = event.target.getAttribute("data-column");
        playerMove(column);
    }
});

// Start game
createBoard();


  
});
