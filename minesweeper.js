export const TILE_STATUS = {
  MARKED: "marked",
  NUMBER: "number",
  HIDDEN: "hidden",
  MINE: "mine",
};

const board = [];

export function createBoard(BOARD_SIZE, NUMBER_OF_MINES) {
  const mines = generateMines(BOARD_SIZE, NUMBER_OF_MINES);
  for (let x = 0; x < BOARD_SIZE; x++) {
    const row = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      const element = document.createElement("div");
      element.dataset.status = TILE_STATUS.HIDDEN;
      const isMine = mines.some((mine) => mine.x === x && mine.y === y);
      row.push({
        element,
        x,
        y,
        isMine: isMine,
        get status() {
          return this.element.dataset.status;
        },
        set status(value) {
          this.element.dataset.status = value;
        },
      });
    }
    board.push(row);
  }
  //   getMinesSurrounded(board, BOARD_SIZE);
  console.log(board);
  return board;
}
function generateMines(BOARD_SIZE, NUMBER_OF_MINES) {
  let mines = [];
  let count = 0;

  while (count < NUMBER_OF_MINES) {
    let x = Math.floor(Math.random() * BOARD_SIZE);
    let y = Math.floor(Math.random() * BOARD_SIZE);
    const mineObj = { x, y };
    const mineExist = mines.some((item) => item.x == x && item.y === y);
    if (!mineExist) {
      mines.push(mineObj);
      count += 1;
    }
  }
  return mines;
}
export function revealTile(board, tile, BOARD_SIZE) {
  if (tile.status !== TILE_STATUS.HIDDEN) return;
  if (tile.isMine) {
    tile.status = TILE_STATUS.MINE;
    tile.element.innerHTML = `<img src="./bomb-solid.svg" alt="bomb" height= "20px" width="20px"/>`;
    return;
  }
  tile.status = TILE_STATUS.NUMBER;
  const surroundingTiles = getSurroundingTiles(board, tile, BOARD_SIZE);
  const count = surroundingTiles.reduce((count, tile) => {
    if (tile.isMine) {
      count += 1;
    }
    return count;
  }, 0);
  if (count == 0) {
    surroundingTiles.forEach((currentTile) => {
      revealTile(board, currentTile, BOARD_SIZE);
    });
  } else {
    tile.element.textContent = count;
  }
}
function getSurroundingTiles(board, tile, BOARD_SIZE) {
  if (tile.isMine) {
    return;
  }
  const tiles = [];
  const xArray = [-1, -1, -1, 0, 0, 1, 1, 1];
  const yArray = [-1, 0, 1, -1, 1, -1, 0, 1];
  let count = 0;
  for (let i = 0; i < xArray.length; i++) {
    const x = tile.x + xArray[i];
    const y = tile.y + yArray[i];
    if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE)
      tiles.push(board[x][y]);
  }

  return tiles;
}

export function checkwin(board) {
  //   return true;
  return board.every((row) => {
    return row.every((tile) => {
      return (
        tile.status === TILE_STATUS.NUMBER ||
        (tile.isMine &&
          (tile.status === TILE_STATUS.HIDDEN ||
            tile.status === TILE_STATUS.MARKED))
      );
    });
  });
}
export function checklost(tile) {
  if (tile.isMine) return true;
  return false;
}
