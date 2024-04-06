import Grid from "./Grid.js";
import PieceQueue from "./PieceQueue.js";

("use strict");

class Game {
  constructor() {
    this.points = 0;
    this.level = 1;
    this.tickSpeed = 1000;
    this.gameLoop;
  }

  gameOverSoundPlayed = false;
  crashSoundPlayed = false;

  grid = new Grid();
  pieceQueue = new PieceQueue();
  audio = document.getElementById("theme");

  stopTheme() {
    this.audio.pause();
  }

  playTheme() {
    this.audio.src = "./audio/Tetris theme.mp3";
    this.audio.loop = true;
    this.audio.play();
  }

  playCrash() {
    if (!this.crashSoundPlayed) {
      this.audio.src = "./audio/crash sfx.mp3";
      this.audio.loop = false;
      this.audio.play();
      this.audio.loop = false;
      this.audio.addEventListener("ended", () => {
        this.audio.src = null;
      });
      this.crashSoundPlayed = true;
    }
  }

  playGameOver() {
    if (!this.gameOverSoundPlayed) {
      this.audio.src = "./audio/Game over sfx.mp3";
      this.audio.loop = false;
      this.audio.play();
      this.audio.addEventListener("ended", () => {
        this.audio.src = null;
      });
      this.gameOverSoundPlayed = true;
    }
  }

  mainMenu() {
    const startButtons = document.getElementsByClassName("button-32");
    let startButton;
    if (startButtons.length > 0) {
      startButton = startButtons[0];
    }

    startButton.addEventListener("click", () => {
      const gameContainer = document.getElementById("game");
      const menu = document.getElementById("menu-container");

      menu.classList.add("hidden");
      gameContainer.classList.remove("hidden");
      this.startGame();
    });
  }

  startGame() {
    this.playTheme();
    this.initControls();
    this.initStats();
    // next piece from the queue piece
    this.pieceQueue.drawQueue();
    const nextPieceType = this.pieceQueue.getNextPieceType();
    this.grid.insertNewPiece(nextPieceType);
    this.pieceQueue.dequeue();
    this.pieceQueue.drawQueue();

    this.gameLoop = setInterval(() => {
      if (!this.grid.gameOver) {
        this.update();
      } else {
        this.gameOver();
      }
    }, this.tickSpeed);
  }

  calculatePoints(lines) {
    switch (lines) {
      case 0:
        break;
      case 1:
        this.points = this.points + 40;
        break;
      case 2:
        this.points = this.points + 100;
        break;
      case 3:
        this.points = this.points + 300;
        break;
      case 4:
        this.points = this.points + 1200;
        break;
    }
  }

  update() {
    this.grid.drawGrid("grid-container");
    this.grid.moveCurrentPieceDown();
    this.updateStats();

    let pointsToAdd = 0;
    if (this.grid.newPieceReady) {
      const nextPieceType = this.pieceQueue.getNextPieceType();
      pointsToAdd = this.grid.insertNewPiece(nextPieceType);
      this.pieceQueue.dequeue();
      this.pieceQueue.drawQueue();
      this.grid.newPieceReady = false;
    }

    this.calculatePoints(pointsToAdd);

    this.checkProgression();
  }

  checkProgression() {
    if (this.grid.totalClearedLines > this.level * 10) {
      this.level++;
      this.tickSpeed = this.tickSpeed - 50;
      this.grid.grid = this.grid.createGrid(this.grid.rows, this.grid.columns);
      const nextPieceType = this.pieceQueue.getNextPieceType();
      this.grid.insertNewPiece(nextPieceType);
    }
  }

  initStats() {
    const statsContainer = document.getElementById("stats-container");

    let pointCounter = document.createElement("div");
    pointCounter.classList.add("point-counter");
    pointCounter.innerHTML = "Points " + this.points;
    statsContainer.appendChild(pointCounter);

    let levelTracker = document.createElement("div");
    levelTracker.classList.add("level-tracker");
    levelTracker.innerHTML = "Level: " + this.level;
    statsContainer.appendChild(levelTracker);
  }

  updateStats() {
    let pointCounters = document.getElementsByClassName("point-counter");
    if (pointCounters.length > 0) {
      let pointCounter = pointCounters[0];
      pointCounter.innerHTML = "Points " + this.points;
    }

    let levelTrackers = document.getElementsByClassName("level-tracker");
    if (levelTrackers.length > 0) {
      let levelTracker = levelTrackers[0];
      levelTracker.innerHTML = "Level: " + this.level;
    }
  }

  gameOver() {
    this.stopTheme();
    this.playCrash();
    console.log("GAME OVER");
    const gameOverText = document.getElementById("game-over");
    this.grid.gameOverAnimation(() => {
      gameOverText.classList.remove("hidden");
      clearInterval(this.gameLoop);
      this.playGameOver();
    });
  }
  // keyboard input arrow keys
  initControls() {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowLeft":
          this.grid.moveCurrentPieceToLeft();
          break;
        case "ArrowRight":
          this.grid.moveCurrentPieceToRight();
          break;
        case "ArrowDown":
          this.grid.moveCurrentPieceToDown();
          break;
        case "ArrowUp":
          this.grid.onRotatePress();
          break;
      }
    });
  }
}

export default Game;
