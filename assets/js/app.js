// GLOBAL VARIABLES

const svgAttributes = {
  x: {
    default: {
      class: 'game__game-icon game__game-icon-x',
      width: '64',
      height: '64',
      xmlns: 'http://www.w3.org/2000/svg',
    },
    defaultPath: {
      d: 'M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z',
      fill: '#31C3BD',
      'fill-rule': 'evenodd',
    },
    outline: {
      class: 'game__game-icon game__game-icon-x-outline',
      width: '64',
      height: '64',
      xmlns: 'http://www.w3.org/2000/svg',
    },
    outlinePath: {
      d: 'M51.12 1.269c.511 0 1.023.195 1.414.586l9.611 9.611c.391.391.586.903.586 1.415s-.195 1.023-.586 1.414L44.441 32l17.704 17.705c.391.39.586.902.586 1.414 0 .512-.195 1.024-.586 1.415l-9.611 9.611c-.391.391-.903.586-1.415.586a1.994 1.994 0 0 1-1.414-.586L32 44.441 14.295 62.145c-.39.391-.902.586-1.414.586a1.994 1.994 0 0 1-1.415-.586l-9.611-9.611a1.994 1.994 0 0 1-.586-1.415c0-.512.195-1.023.586-1.414L19.559 32 1.855 14.295a1.994 1.994 0 0 1-.586-1.414c0-.512.195-1.024.586-1.415l9.611-9.611c.391-.391.903-.586 1.415-.586s1.023.195 1.414.586L32 19.559 49.705 1.855c.39-.391.902-.586 1.414-.586Z',
      stroke: '#31C3BD',
      'stroke-width': '2',
      fill: 'none',
    },
  },
  o: {
    default: {
      class: 'game__game-icon game__game-icon-o',
      width: '64',
      height: '64',
      xmlns: 'http://www.w3.org/2000/svg',
    },
    defaultPath: {
      d: 'M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z',
      fill: '#F2B137',
    },
    outline: {
      class: 'game__game-icon game__game-icon-o-outline',
      width: '66',
      height: '66',
      xmlns: 'http://www.w3.org/2000/svg',
    },
    outlinePath: {
      d: 'M33 1c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C15.327 65 1 50.673 1 33 1 15.327 15.327 1 33 1Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z',
      stroke: '#F2B137',
      'stroke-width': '2',
      fill: 'none',
    },
  },
};

// GAME

class Game {
  constructor(player1, player2, cpuMarker) {
    this.playerX = player1;
    this.playerO = player2;
    this.cpuMarker = cpuMarker;
    this.scorePlayerOne = 0;
    this.scorePlayerTwo = 0;
    this.scoreTies = 0;
    this.turn = 'x';
    this.startingPlayer = 'x';
    this.gameBoard = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['1', '4', '7'],
      ['2', '5', '8'],
      ['3', '6', '9'],
      ['1', '5', '9'],
      ['3', '5', '7'],
    ];

    this._displayStats();

    // This needs to run if CPU is X.
    if (this.turn === this.cpuMarker) {
      this._addMarkerForCPU();
    }
  }

  createSvgIcon(svgAttributes, pathAttributes) {
    const svgElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    for (let key in svgAttributes) {
      svgElement.setAttribute(key, svgAttributes[key]);
    }

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    for (let key in pathAttributes) {
      path.setAttribute(key, pathAttributes[key]);
    }
    svgElement.appendChild(path);

    return svgElement;
  }

  addMarkerToDOM(markerId) {
    const box = document.querySelector(`#box-${markerId}`);
    box.classList.add('active');
    console.log('marker added to ' + markerId);
    if (this.turn === 'x') {
      box.appendChild(
        this.createSvgIcon(svgAttributes.x.default, svgAttributes.x.defaultPath)
      );
    } else {
      box.appendChild(
        this.createSvgIcon(svgAttributes.o.default, svgAttributes.o.defaultPath)
      );
    }
    this._addMarkerToGameBoard(markerId);
    this._checkGame();
    this._changeTurn();

    // Add marker for DOM
    if (this.turn === this.cpuMarker) {
      this._addMarkerForCPU();
    }
  }

  resetGame() {
    // Reset marker lists
    this.gameBoard = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['1', '4', '7'],
      ['2', '5', '8'],
      ['3', '6', '9'],
      ['1', '5', '9'],
      ['3', '5', '7'],
    ];
    const allActiveGameBoxes = document.querySelectorAll(
      '.game__board .active'
    );
    allActiveGameBoxes.forEach((item) => {
      item.classList.remove('active');
      item.firstElementChild.remove();
    });

    this._displayStats();
    if (this.turn === this.cpuMarker) {
      this._addMarkerForCPU();
    }
  }

  _changeTurn() {
    if (this.turn === 'x') {
      this.turn = 'o';
      document.querySelector('.game__turn-icon-x').classList.remove('active');
      document.querySelector('.game__turn-icon-o').classList.add('active');
    } else {
      this.turn = 'x';
      document.querySelector('.game__turn-icon-o').classList.remove('active');
      document.querySelector('.game__turn-icon-x').classList.add('active');
    }
  }

  _checkGame() {
    // Only need to check current turn
    let win = false;
    this.gameBoard.forEach((list) => {
      if (
        list.every((item) => {
          return item === this.turn;
        })
      ) {
        win = true;
      }
    });
    if (win) {
      this._showResultPopup(this.turn);
      this.turn === 'x' ? this.scorePlayerOne++ : this.scorePlayerTwo++;
      return true;
    } else {
      const allActiveGameBoxes = document.querySelectorAll(
        '.game__board-box.active'
      );
      if (allActiveGameBoxes.length === 9) {
        this._showResultPopup('tie');
        this.scoreTies++;
        return 'tie';
      }
    }
    return false;
  }

  _displayStats() {
    document.querySelector(
      '.game__score-box-x .game__score-box-text'
    ).innerText = `X (${this.playerX})`;
    document.querySelector(
      '.game__score-box-o .game__score-box-text'
    ).innerText = `O (${this.playerO})`;
    document.querySelector('.game__score-x').innerText = this.scorePlayerOne;
    document.querySelector('.game__score-ties').innerText = this.scoreTies;
    document.querySelector('.game__score-o').innerText = this.scorePlayerTwo;
  }

  _showResultPopup(result) {
    if (result === 'x') {
      document.querySelector('.popup__text--s').innerText = `${this.playerX} ${
        this.playerX.toLowerCase() === 'you' ? 'win' : 'wins'
      }`;
      document.querySelector('.popup__icon-x').style.display = 'block';
      document.querySelector('.popup__icon-o').style.display = 'none';
      document.querySelector('.popup__text--l').innerText = 'Takes the round';
      document.querySelector('.popup__text--l').style.color =
        'var(--clr-accent-x)';
    } else if (result === 'o') {
      document.querySelector('.popup__text--s').innerText = `${this.playerO} ${
        this.playerO.toLowerCase() === 'you' ? 'win' : 'wins'
      }`;
      document.querySelector('.popup__icon-x').style.display = 'none';
      document.querySelector('.popup__icon-o').style.display = 'block';
      document.querySelector('.popup__text--l').innerText = 'Takes the round';
      document.querySelector('.popup__text--l').style.color =
        'var(--clr-accent-o)';
    } else {
      document.querySelector('.popup__text--s').innerText = '';
      document.querySelector('.popup__icon-x').style.display = 'none';
      document.querySelector('.popup__icon-o').style.display = 'none';
      document.querySelector('.popup__text--l').innerText = 'Round tied';
      document.querySelector('.popup__text--l').style.color =
        'var(--clr-semilight)';
    }
    document.querySelector('.popup--results').style.display = 'flex';
  }

  _addMarkerToGameBoard(markerId) {
    this.gameBoard.forEach((item, index) => {
      for (let num of item) {
        if (num === markerId) {
          this.gameBoard[index][item.indexOf(num)] = this.turn;
        }
      }
    });
  }

  _addMarkerForCPU() {
    const opponentMarker = this.turn === 'x' ? 'o' : 'x';
    if (this._checkForWinningOrBlockingMoves(this.turn)) {
      console.log('winning move exists');
      this.addMarkerToDOM(this._checkForWinningOrBlockingMoves(this.turn));
    } else if (this._checkForWinningOrBlockingMoves(opponentMarker)) {
      console.log('no winning move, blocking move exists');
      this.addMarkerToDOM(this._checkForWinningOrBlockingMoves(opponentMarker));
    } else if (this._checkForForkingMoves(this.turn)) {
      console.log(
        'no winning move, no blocking move, forking move exists for cpu'
      );
      this.addMarkerToDOM(this._checkForForkingMoves(this.turn));
    } else if (this._checkForForkingMoves(opponentMarker)) {
      console.log(
        'no winning move, no blocking move, forking move exists for opponent'
      );
      this.addMarkerToDOM(this._checkForForkingMoves(opponentMarker));
    } else if (this._checkForCenterCornerOrSide()) {
      console.log('center, corner or side exists');
      this.addMarkerToDOM(this._checkForCenterCornerOrSide());
    } else {
      console.log('no, option. tied game if no active spots');
    }
  }

  _checkForWinningOrBlockingMoves(markerToCheck) {
    let counter;
    let boxId;
    let winningId;
    this.gameBoard.forEach((list, index) => {
      counter = 0;
      for (let item of list) {
        if (item === markerToCheck) {
          counter++;
        } else {
          boxId =
            item !== 'x' && item !== 'o'
              ? this.gameBoard[index][list.indexOf(item)]
              : null;
        }
      }
      if (counter === 2 && boxId) {
        winningId = boxId;
      }
    });
    return winningId ? winningId : false;
  }

  _checkForForkingMoves(markerToCheck) {
    // Works the same for both the player and opponent. Takes in different marker to check.
    // Check for possibility to create 2 x 2 in a row
    // 1. Select all rows with one in a row and two free spots
    // 2. Check if these rows have a common id --> this is the forking move.
    let counter = 0;
    const rowsToCheck = [];
    let freeSpotsInRow = [];
    this.gameBoard.forEach((list) => {
      counter = 0;
      freeSpotsInRow = [];
      for (let item of list) {
        if (item === markerToCheck) {
          counter++;
        } else {
          if (item !== 'x' && item !== 'o') {
            freeSpotsInRow.push(item);
          }
        }
      }
      if (freeSpotsInRow.length === 2 && counter === 1) {
        rowsToCheck.push(freeSpotsInRow);
      }
    });
    const commonItems = [];
    if (rowsToCheck.length >= 2) {
      for (let i = 0; i < rowsToCheck.length - 1; i++) {
        for (let j = i + 1; j < rowsToCheck.length; j++) {
          let commonElements = this._findCommonElements(
            rowsToCheck[i],
            rowsToCheck[j]
          );
          if (commonElements.length > 0) {
            // If there are common elements, add them to commonItems
            commonItems.push(...commonElements);
          }
        }
      }
    }
    return commonItems.length > 0 ? commonItems[0] : false;
  }

  _checkForCenterCornerOrSide() {
    const allBoardBoxes = document.querySelectorAll('.game__board-box');
    const availableBoxId = [];
    allBoardBoxes.forEach((box) => {
      if (!box.classList.contains('active')) {
        availableBoxId.push(box.id.slice(-1));
      }
    });

    const corners = [];
    const sides = [];
    const center = [];
    availableBoxId.forEach((id) => {
      if (id === '5') {
        center.push(id);
      } else if (id === '1' || id === '3' || id === '7' || id === '9') {
        corners.push(id);
      } else if (id === '2' || id === '4' || id === '6' || id === '8') {
        sides.push(id);
      }
    });

    if (center.length > 0) {
      return center[0];
    } else if (corners.length > 0) {
      // Return random
      const randNum = Math.floor(Math.random() * corners.length);
      return corners[randNum];
    } else if (sides.length > 0) {
      const randNum = Math.floor(Math.random() * corners.length);
      return sides[randNum];
    } else {
      return false;
    }
  }

  _findCommonElements(arr1, arr2) {
    return arr1.filter((element) => arr2.includes(element));
  }
}

// APP

class App {
  constructor() {
    this._loadEventListeners();
    this.playerOneMarker = 'x';
    this.playerTwoMarker = 'o';
  }

  _loadEventListeners() {
    document
      .querySelector('.start__box-x')
      .addEventListener('click', this._changeSelectedMarker.bind(this));
    document
      .querySelector('.start__box-o')
      .addEventListener('click', this._changeSelectedMarker.bind(this));
    document
      .querySelector('.btn-primary-cpu')
      .addEventListener('click', this._newGame.bind(this));
    document
      .querySelector('.btn-primary-player')
      .addEventListener('click', this._newGame.bind(this));
    document
      .querySelector('.game__board')
      .addEventListener('click', this._addMarkerForPlayer.bind(this));
    document
      .querySelector('.game__board')
      .addEventListener('mouseover', this._handleHover.bind(this));
    document
      .querySelector('.game__board')
      .addEventListener('mouseout', this._handleHover.bind(this));
    document
      .querySelector('.btn-secondary-light--reset')
      .addEventListener('click', this._toggleRestartPopup.bind(this));
    document
      .querySelector('.popup__btn-cancel')
      .addEventListener('click', this._toggleRestartPopup.bind(this));
    document
      .querySelector('.popup__btn-restart')
      .addEventListener('click', this._restartGame.bind(this));
    document
      .querySelector('.popup__btn-quit')
      .addEventListener('click', this._restartGame.bind(this));
    document
      .querySelector('.popup__btn-next-round')
      .addEventListener('click', this._nextRound.bind(this));
  }

  _changeSelectedMarker(e) {
    // Selects marker for player one, player two/CPU gets the other
    const markerX = document.querySelector('.start__box-x');
    const markerO = document.querySelector('.start__box-o');
    const selectedBox = document.querySelector('.start__selected-box');

    if (e.target.closest('.start__box').classList.contains('selected')) {
      return;
    }

    let selectedMarker = e.target
      .closest('.start__box')
      .classList.contains('start__box-x')
      ? 'x'
      : 'o';
    if (selectedMarker === 'x') {
      markerX.classList.add('selected');
      markerO.classList.remove('selected');
      selectedBox.style.transform = 'translateX(0%)';
      this.playerOneMarker = 'x';
      this.playerTwoMarker = 'o';
    } else {
      markerO.classList.add('selected');
      markerX.classList.remove('selected');
      selectedBox.style.transform = 'translateX(100%)';
      this.playerOneMarker = 'o';
      this.playerTwoMarker = 'x';
    }
  }

  _newGame(e) {
    if (e.target.classList.contains('btn-primary-cpu')) {
      if (this.playerOneMarker === 'x') {
        this._game = new Game('You', 'CPU', 'o');
      } else {
        this._game = new Game('CPU', 'You', 'x');
      }
    } else {
      this._game = new Game('Player 1', 'Player 2', '');
    }
    this._changeToGameView();
  }

  _changeToGameView() {
    document.querySelector('.start').style.display = 'none';
    document.querySelector('.game').style.display = 'block';
  }

  _addMarkerForPlayer(e) {
    if (e.target.classList.contains('game__board-box')) {
      const pressedBox = e.target.closest('.game__board-box');
      if (pressedBox.classList.contains('active')) {
        return;
      }
      // Remove any hover icon
      if (pressedBox.firstElementChild) {
        pressedBox.firstElementChild.remove();
      }
      this._game.addMarkerToDOM(pressedBox.id.slice(-1));
    } else {
      return;
    }
  }

  _handleHover(e) {
    const box = e.target.closest('.game__board-box');

    if (!box || box.classList.contains('active')) {
      return;
    }

    if (e.type === 'mouseover' && !box.firstElementChild) {
      if (this._game.turn === 'x') {
        box.appendChild(
          this._game.createSvgIcon(
            svgAttributes.x.outline,
            svgAttributes.x.outlinePath
          )
        );
      } else {
        box.appendChild(
          this._game.createSvgIcon(
            svgAttributes.o.outline,
            svgAttributes.o.outlinePath
          )
        );
      }
    } else if (e.type === 'mouseout') {
      box.firstElementChild.remove();
    }
  }

  _toggleRestartPopup() {
    if (document.querySelector('.popup--restart').style.display !== 'flex') {
      document.querySelector('.popup--restart').style.display = 'flex';
    } else {
      document.querySelector('.popup--restart').style.display = 'none';
    }
  }

  _restartGame() {
    window.location.reload();
  }

  _nextRound() {
    document.querySelector('.popup--results').style.display = 'none';
    this._game.resetGame();
  }
}

const game = new App();
