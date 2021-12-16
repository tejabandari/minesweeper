import {
  checkwin,
  checklost,
  revealTile,
  TILE_STATUS,
  createBoard,
} from "./minesweeper.js";
const boardDiv = document.querySelector(".board");
const mines_count = document.querySelector("[data-mine-count]");
const subText = document.querySelector(".subtext");

const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 10;
boardDiv.style.setProperty("--size", BOARD_SIZE);
mines_count.textContent = NUMBER_OF_MINES;
const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
console.log(board.length);
board.forEach((row) => {
  row.forEach((tile) => {
    tile.element.addEventListener("click", () => {
      revealTile(board, tile, BOARD_SIZE);
      checkGameStatus(board, tile);
    });
    tile.element.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (tile.status == TILE_STATUS.NUMBER || tile.status == TILE_STATUS.MINE)
        return;
      if (tile.status == TILE_STATUS.MARKED) {
        tile.status = TILE_STATUS.HIDDEN;
        tile.element.innerHTML = "";
        return;
      }
      tile.status = TILE_STATUS.MARKED;
      tile.element.innerHTML = `<img src="./flag.svg" alt="bomb" height= "20px" width="20px"/>`;
      const count = board.reduce((sum, row) => {
        return (sum += row.filter(
          (tile) => tile.status === TILE_STATUS.MARKED
        ).length);
      }, 0);
      mines_count.textContent = NUMBER_OF_MINES - count;
    });
    boardDiv.append(tile.element);
  });
});

function checkGameStatus(board, tile) {
  const win = checkwin(board);
  const lose = checklost(tile);
  if (win || lose) {
    boardDiv.addEventListener("click", stopClick, { capture: true });
    boardDiv.addEventListener("contextmenu", stopClick, { capture: true });
  }
  if (win) {
    subText.textContent = "You Won";
  }
  if (lose) {
    subText.textContent = "You Lose";
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.isMine) {
          tile.status = TILE_STATUS.MINE;
          tile.element.innerHTML = `<img src="./bomb-solid.svg" alt="bomb" height= "20px" width="20px"/>`;
        }
      });
    });
  }
}

function stopClick(e) {
  e.stopImmediatePropagation();
}
// create a board
// option to mark
// a. once you mark reduce the count of mines
// show win or lose
// arrange board
// a. assign random mines in the board

// b. click on space reveal total space till tiles which it is surrounded by mine

// click on a tille to reveal
