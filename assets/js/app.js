// Det mesta bör vara klart. Först göra lite tester av spelet och se att allt funkar som det ska.
// Steget efter blir då att kolla igenom hela projektet. Kan med fördel börja med HTML och CSS, där vissa justeringar av klasser osv. kan komma. Samtidigt se till att ändra klasser i JS.
// Där efter refraktorera hela JS, som bör gå förenkla och göra betydligt smartare och enklare.
// OBS: GÖR EN KOPIA PÅ ALLT INNAN JAG BÖRJAR KOLLA IGENOM/ÄNDRA.

// GAME

class Game {
  constructor(player1, player2, againstCPU, cpuMarker) {
    // May be done better/smarter
    this.playerX = player1;
    this.playerO = player2;
    this.againstCPU = againstCPU;
    this.cpuMarker = cpuMarker;
    this.scorePlayerOne = 0;
    this.scorePlayerTwo = 0;
    this.scoreTies = 0;
    this.turn = 'x';
    this.PlayerXMarkers = [];
    this.PlayerOMarkers = [];

    // Ett sätt istället för att lägga in alla marker id i en lista för båda spelarna kan vara att det redan är en lista med spelplanens ID, som byts till O eller X när man spelar. Kan förenkla flera av funktionerna nedan.
    this.PlayerXMarkersNew = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['1', '4', '7'],
      ['2', '5', '8'],
      ['3', '6', '9'],
      ['1', '5', '9'],
      ['3', '5', '7'],
    ];
    this.PlayerOMarkersNew = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['1', '4', '7'],
      ['2', '5', '8'],
      ['3', '6', '9'],
      ['1', '5', '9'],
      ['3', '5', '7'],
    ];

    this.changeToGameView();
    this._displayStats(true);
    if (this.againstCPU && this.turn === this.cpuMarker) {
      this.addMarkerForCPU();
      this.checkGame();
      this.changeTurn();
    }
  }

  // Public functions
  changeToGameView() {
    document.querySelector('.start').style.display = 'none';
    document.querySelector('.game').style.display = 'block';
  }

  changeToStartView() {
    document.querySelector('.start').style.display = 'block';
    document.querySelector('.game').style.display = 'none';
  }

  showResultPopup(result) {
    // Change popup on who is the winner
    if (result === 'x') {
      document.querySelector(
        '.popup__text--s'
      ).innerText = `${this.playerX} wins`;
      document.querySelector('.popup__icon-x').style.display = 'block';
      document.querySelector('.popup__icon-o').style.display = 'none';
      document.querySelector('.popup__text--l').innerText = 'Takes the round';
      document.querySelector('.popup__text--l').style.color =
        'var(--clr-accent-x)';
    } else if (result === 'o') {
      document.querySelector(
        '.popup__text--s'
      ).innerText = `${this.playerO} wins`;
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

  // Only random - too easy to win over CPU
  addRandomMarkerForCPU() {
    // Check available spots
    const boxes = document.querySelectorAll('.game__board-box');
    const avaSpots = [];
    boxes.forEach((box) => {
      if (!box.classList.contains('active')) {
        avaSpots.push(box.id);
      }
    });
    const randIndex = Math.floor(Math.random() * avaSpots.length);
    const randBox = document.querySelector(`#${avaSpots[randIndex]}`);
    const boxChildrenArr = Array.from(randBox.children);
    randBox.classList.add('active');
    if (this.turn === 'x') {
      this.PlayerXMarkers.push(randBox.id.slice(-1));
      boxChildrenArr.forEach((item) => {
        if (item.classList.contains('game__game-icon-x')) {
          item.classList.add('active');
        }
      });
    } else {
      this.PlayerOMarkers.push(randBox.id.slice(-1));
      boxChildrenArr.forEach((item) => {
        if (item.classList.contains('game__game-icon-o')) {
          item.classList.add('active');
        }
      });
    }
  }

  addMarkerForCPU() {
    // Check available spots
    const boxes = document.querySelectorAll('.game__board-box');
    const avaSpots = [];
    boxes.forEach((box) => {
      if (!box.classList.contains('active')) {
        avaSpots.push(box.id.slice(-1));
      }
    });

    const markersCPU =
      this.cpuMarker === 'x' ? this.PlayerXMarkersNew : this.PlayerOMarkersNew;
    const markersPlayer =
      this.cpuMarker === 'x' ? this.PlayerOMarkersNew : this.PlayerXMarkersNew;

    if (this.checkForWinningMoves(markersCPU)) {
      console.log('winning move exists');
      this.addMarkerToDOM(this.checkForWinningMoves(markersCPU));
    } else if (this.checkForBlockingMoves(markersPlayer)) {
      console.log('no winning move, blocking move exists');
      this.addMarkerToDOM(this.checkForBlockingMoves(markersPlayer));
    } else if (this.checkForForkingMoves(markersCPU, this.turn)) {
      console.log(
        'no winning move, no blocking move, forking move exists for cpu'
      );
      this.addMarkerToDOM(this.checkForForkingMoves(markersCPU, this.turn));
    } else if (
      this.checkForForkingMoves(markersPlayer, this.turn === 'x' ? 'o' : 'x')
    ) {
      console.log(
        'no winning move, no blocking move, forking move exists for opponent'
      );
      this.addMarkerToDOM(
        this.checkForForkingMoves(markersPlayer, this.turn === 'x' ? 'o' : 'x')
      );
    } else if (this.checkForCenterCornerOrSide()) {
      console.log('center, corner or side exists');
      this.addMarkerToDOM(this.checkForCenterCornerOrSide());
    } else {
      console.log('no, option. tied game if no active spots');

      // This adds random marker if no option above - delete later
      const randIndex = Math.floor(Math.random() * avaSpots.length);
      const randBox = document.querySelector(`#box-${avaSpots[randIndex]}`);
      const boxChildrenArr = Array.from(randBox.children);
      randBox.classList.add('active');
      if (this.turn === 'x') {
        this.PlayerXMarkers.push(randBox.id.slice(-1));
        this.PlayerXMarkersNew.forEach((item, index) => {
          for (let num of item) {
            if (num === randBox.id.slice(-1)) {
              this.PlayerXMarkersNew[index][item.indexOf(num)] = 'x';
            }
          }
        });
        boxChildrenArr.forEach((item) => {
          if (item.classList.contains('game__game-icon-x')) {
            item.classList.add('active');
          }
        });
      } else {
        this.PlayerOMarkers.push(randBox.id.slice(-1));
        this.PlayerOMarkersNew.forEach((item, index) => {
          for (let num of item) {
            if (num === randBox.id.slice(-1)) {
              this.PlayerOMarkersNew[index][item.indexOf(num)] = 'o';
            }
          }
        });
        boxChildrenArr.forEach((item) => {
          if (item.classList.contains('game__game-icon-o')) {
            item.classList.add('active');
          }
        });
      }
    }
  }

  checkForCenterCornerOrSide() {
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

  checkForForkingMoves(markers, markerToCheck) {
    // Works the same for both the player and opponent. Takes in different markers
    // Check for possibility to create 2 x 2 in a row
    // 1. Select all rows with one in a row and two free spots
    // 2. Check if these rows have a common id --> this is the forking move.
    let counter = 0;
    const rowsToCheck = [];
    let freeSpotsInRow = [];
    markers.forEach((list) => {
      counter = 0;
      freeSpotsInRow = [];
      for (let item of list) {
        if (item === markerToCheck) {
          counter++;
        } else {
          if (
            !document.querySelector(`#box-${item}`).classList.contains('active')
          ) {
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
          let commonElements = this.findCommonElements(
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

  findCommonElements(arr1, arr2) {
    return arr1.filter((element) => arr2.includes(element));
  }

  checkForBlockingMoves(markersPlayer) {
    // Almost same as winning moves. Check for two in a row for opponent
    let counter = 0;
    let boxId;
    let blockingId;
    const markerToCheck = this.turn === 'x' ? 'o' : 'x';
    markersPlayer.forEach((list, index) => {
      counter = 0;
      for (let item of list) {
        if (item === markerToCheck) {
          counter++;
        } else {
          boxId = markersPlayer[index][list.indexOf(item)];
        }
      }
      if (
        counter >= 2 &&
        boxId &&
        !document.querySelector(`#box-${boxId}`).classList.contains('active')
      ) {
        blockingId = boxId;
      }
    });
    return blockingId ? blockingId : false;
  }

  checkForWinningMoves(markersCPU) {
    // Should be made as a separate function that return either ID or false, if false continue to check blocking moves that does the same thing
    // This seem to work; next a function that check for blocking moves if this returns false
    let counter = 0;
    let boxId;
    let winningId;
    markersCPU.forEach((list, index) => {
      counter = 0;
      for (let item of list) {
        if (item === this.turn) {
          counter++;
        } else {
          boxId = markersCPU[index][list.indexOf(item)];
        }
      }
      if (
        counter >= 2 &&
        boxId &&
        !document.querySelector(`#box-${boxId}`).classList.contains('active')
      ) {
        winningId = boxId;
      }
    });
    return winningId ? winningId : false;
  }

  addMarkerToDOM(markerId) {
    const box = document.querySelector(`#box-${markerId}`);
    box.classList.add('active');
    const boxChildrenArr = Array.from(box.children);
    if (this.turn === 'x') {
      this.PlayerXMarkers.push(markerId);
      this.PlayerXMarkersNew.forEach((item, index) => {
        for (let num of item) {
          if (num === markerId) {
            this.PlayerXMarkersNew[index][item.indexOf(num)] = 'x';
          }
        }
      });
      boxChildrenArr.forEach((item) => {
        if (item.classList.contains('game__game-icon-x')) {
          item.classList.add('active');
        }
      });
    } else {
      this.PlayerOMarkers.push(markerId);
      this.PlayerOMarkersNew.forEach((item, index) => {
        for (let num of item) {
          if (num === markerId) {
            this.PlayerOMarkersNew[index][item.indexOf(num)] = 'o';
          }
        }
      });
      boxChildrenArr.forEach((item) => {
        if (item.classList.contains('game__game-icon-o')) {
          item.classList.add('active');
        }
      });
    }
  }

  changeTurn() {
    if (this.turn === 'x') {
      this.turn = 'o';
      document.querySelector('.game__turn-icon-x').classList.remove('active');
      document.querySelector('.game__turn-icon-o').classList.add('active');
    } else {
      this.turn = 'x';
      document.querySelector('.game__turn-icon-o').classList.remove('active');
      document.querySelector('.game__turn-icon-x').classList.add('active');
    }
    if (this.againstCPU) {
    }
  }

  includesAll(markers, combo) {
    return combo.every((value) => markers.includes(value));
  }

  checkGame() {
    // Only check current turn
    const markers =
      this.turn === 'x' ? this.PlayerXMarkersNew : this.PlayerOMarkersNew;

    let win = false;
    markers.forEach((list) => {
      if (
        list.every((item) => {
          return item === this.turn;
        })
      ) {
        win = true;
      }
    });
    if (win) {
      this.showResultPopup(`${this.turn}`);
      if (this.turn === 'x') {
        this.scorePlayerOne++;
      } else {
        this.scorePlayerTwo++;
      }
    } else {
      const allActiveGameBoxes = document.querySelectorAll(
        '.game__board-box.active'
      );
      console.log(allActiveGameBoxes);
      if (allActiveGameBoxes.length === 9) {
        this.showResultPopup();
        this.scoreTies++;
        return 'tie';
      }
    }

    // GAMMAL
    // Kombinationer:
    // const winCombinations = [
    //   ['1', '2', '3'],
    //   ['4', '5', '6'],
    //   ['7', '8', '9'],
    //   ['1', '4', '7'],
    //   ['2', '5', '8'],
    //   ['3', '6', '9'],
    //   ['1', '5', '9'],
    //   ['3', '5', '7'],
    // ];

    // const markers =
    //   this.turn === 'x' ? this.PlayerXMarkers : this.PlayerOMarkers;
    // let win = false;
    // winCombinations.forEach((combo) => {
    //   if (this.includesAll(markers, combo)) {
    //     win = true;
    //   }
    // });
    // if (win) {
    //   this.showResultPopup(`${this.turn}`);
    //   if (this.turn === 'x') {
    //     this.scorePlayerOne++;
    //   } else {
    //     this.scorePlayerTwo++;
    //   }
    // } else if (win === false && markers.length === 5) {
    //   this.showResultPopup();
    //   this.scoreTies++;
    // }
  }

  resetGame() {
    // Reset marker lists
    this.PlayerXMarkers = [];
    this.PlayerOMarkers = [];
    this.PlayerXMarkersNew = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['1', '4', '7'],
      ['2', '5', '8'],
      ['3', '6', '9'],
      ['1', '5', '9'],
      ['3', '5', '7'],
    ];
    this.PlayerOMarkersNew = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['1', '4', '7'],
      ['2', '5', '8'],
      ['3', '6', '9'],
      ['1', '5', '9'],
      ['3', '5', '7'],
    ];

    // Reset markers
    // const allGameBoxes = document.querySelectorAll('.game__board-box');
    // allGameBoxes.forEach((box) => {
    //   box.classList.remove('active');
    // });
    const allActiveGameBoxes = document.querySelectorAll(
      '.game__board .active'
    );
    allActiveGameBoxes.forEach((item) => {
      item.classList.remove('active');
    });
    this._displayStats();
  }

  // Private functions
  _displayStats(newGame = false) {
    // Change text on score boxes in new games
    if (newGame) {
      document.querySelector(
        '.game__score-box-x .game__score-box-text'
      ).innerText = `X (${this.playerX})`;
      document.querySelector(
        '.game__score-box-o .game__score-box-text'
      ).innerText = `O (${this.playerO})`;
    }
    document.querySelector('.game__score-x').innerText = this.scorePlayerOne;
    document.querySelector('.game__score-ties').innerText = this.scoreTies;
    document.querySelector('.game__score-o').innerText = this.scorePlayerTwo;
  }
}

// START VIEW

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
      .addEventListener('click', this._addMarker.bind(this));

    document
      .querySelector('.game__board')
      .addEventListener('mouseover', this._handleHover.bind(this));
    document
      .querySelector('.game__board')
      .addEventListener('mouseleave', this._handleHover.bind(this));
    document
      .querySelector('.btn-secondary-light--reset')
      .addEventListener('click', this.toggleRestartPopup.bind(this));
    document
      .querySelector('.popup__btn-cancel')
      .addEventListener('click', this.toggleRestartPopup.bind(this));
    document
      .querySelector('.popup__btn-restart')
      .addEventListener('click', this.restartGame.bind(this));
    document
      .querySelector('.popup__btn-quit')
      .addEventListener('click', this.restartGame.bind(this));
    document
      .querySelector('.popup__btn-next-round')
      .addEventListener('click', this.nextRound.bind(this));
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
      if (document.querySelector('.start__box.start__box-x.selected')) {
        this._game = new Game('You', 'CPU', true, 'o');
      } else {
        this._game = new Game('CPU', 'You', true, 'x');
      }
    } else {
      // Game player vs player, no point in choosing.
      this._game = new Game('Player 1', 'Player 2', false);
    }
  }

  // Should move most of this to addMarkerToDOM-function
  _addMarker(e) {
    if (
      e.target.classList.contains('game__board-box') ||
      e.target.classList.contains('game__game-icon')
    ) {
      const pressedBox = e.target.closest('.game__board-box');
      if (pressedBox.classList.contains('active')) {
        return;
      }
      const boxChildrenArr = Array.from(pressedBox.children);

      boxChildrenArr.forEach((child) => {
        child.classList.remove('hover');
        if (child.classList.contains(`game__game-icon-${this._game.turn}`)) {
          child.classList.add('active');
          pressedBox.classList.add('active');
          if (this._game.turn === 'x') {
            this._game.PlayerXMarkers.push(pressedBox.id.slice(-1));
            this._game.PlayerXMarkersNew.forEach((item, index) => {
              for (let num of item) {
                if (num === pressedBox.id.slice(-1)) {
                  this._game.PlayerXMarkersNew[index][item.indexOf(num)] = 'x';
                }
              }
            });
          } else {
            this._game.PlayerOMarkers.push(pressedBox.id.slice(-1));
            this._game.PlayerOMarkersNew.forEach((item, index) => {
              for (let num of item) {
                if (num === pressedBox.id.slice(-1)) {
                  this._game.PlayerOMarkersNew[index][item.indexOf(num)] = 'o';
                }
              }
            });
          }
        }
      });
    } else {
      return;
    }
    this._game.checkGame();
    this._game.changeTurn();
    if (
      this._game.againstCPU &&
      this._game.turn === this._game.cpuMarker &&
      this._game.checkGame() !== 'tie'
    ) {
      this._game.addMarkerForCPU(this._game.cpuMarker); // This cannot be run if tied game.
      this._game.checkGame();
      this._game.changeTurn();
    }
  }

  _handleHover(e) {
    const allIcons = document.querySelectorAll(`.game__game-icon`);
    allIcons.forEach((icon) => {
      icon.classList.remove('hover');
    });

    const box = e.target.closest('.game__board-box');
    if (!box || box.classList.contains('active')) {
      return;
    }

    const boxChildren = box.children;
    const boxChildrenArr = Array.from(boxChildren);
    boxChildrenArr.forEach((child) => {
      if (
        child.classList.contains(`game__game-icon-${this._game.turn}-outline`)
      ) {
        child.classList.add('hover');
      }
    });
  }

  restartGame() {
    // Simple solution - may be better ones? Kan försöka göra en bättre lösning senare, där allt nollställs utan att jag reloadar sidan.
    window.location.reload();

    // this._game.changeToStartView();
    // delete this._game;
    // this.toggleRestartPopup();
    // console.log(this._game);
  }

  nextRound() {
    document.querySelector('.popup--results').style.display = 'none';
    this._game.resetGame();
  }

  toggleRestartPopup() {
    if (document.querySelector('.popup--restart').style.display !== 'flex') {
      document.querySelector('.popup--restart').style.display = 'flex';
    } else {
      document.querySelector('.popup--restart').style.display = 'none';
    }
  }
}

const app = new App();
