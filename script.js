


document.addEventListener("DOMContentLoaded", function() {
    const board = document.querySelector('.board');
    const numCells = 42; 
  
    for (let i = 1; i <= numCells; i++) {
      const cell = document.createElement('div');
      cell.textContent = i;
      board.appendChild(cell);
    }
  });
  