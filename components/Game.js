import Grid from "./Grid.js";
import PieceQueue from "./PieceQueue.js";
import PieceStack from "./PieceStack.js";

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
  nextLevelPlayed = false;
  hasSaved = false;

  grid = new Grid();
  pieceQueue = new PieceQueue();
  pieceStack = new PieceStack();
  audio = document.getElementById("theme");

  playNextLevel() {
    if (!this.nextLevelPlayed) {
      this.audio.src = "./audio/next level sfx.wav";
      this.audio.loop = false;
      this.audio.play();
      this.audio.addEventListener("ended", () => {
        this.audio.src = null;
      });
    }
    this.nextLevelPlayed = true;
  }

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

    this.pieceStack.drawStack();

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

  async update() {
    this.grid.drawGrid("grid-container");
    this.grid.moveCurrentPieceDown();
    this.updateStats();

    await this.checkProgression(); // Wait for checkProgression to complete

    if (this.grid.newPieceReady) {
      const nextPieceType = this.pieceQueue.getNextPieceType();
      let pointsToAdd = this.grid.insertNewPiece(nextPieceType);
      this.pieceQueue.dequeue();
      this.pieceQueue.drawQueue();
      this.grid.newPieceReady = false;

      this.calculatePoints(pointsToAdd);
      this.hasSaved = false;
    }
  }

  async checkProgression() {
    if (this.grid.totalClearedLines >= this.level * 10) {
      this.level++;
      this.tickSpeed = this.tickSpeed - 50;
      this.grid.grid = this.grid.createGrid(this.grid.rows, this.grid.columns);
      await this.levelTransition(); // Wait for levelTransition to complete
      const nextPieceType = this.pieceQueue.getNextPieceType();
      this.grid.insertNewPiece(nextPieceType);
    }
  }

  async levelTransition() {
    this.stopTheme();
    this.playNextLevel();
    const levelBanner = document.getElementById("level-banner");
    let levelTexts = document.getElementsByClassName("level-banner-text");
    let levelText;
    if (levelTexts.length > 0) {
      levelText = levelTexts[0];
      levelText.innerHTML = "Level: " + this.level;
      levelBanner.classList.remove("hidden");
      await this.delay(3000);
      levelBanner.classList.add("hidden");
      this.nextLevelPlayed = false;
      this.playTheme();
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
        case "c":
          this.savePiece();
          break;
      }
    });
  }

  savePiece() {
    if (!this.hasSaved) {
      if (this.pieceStack.isEmpty()) {
        const currentPieceType = this.grid.getCurrentPiece()[0].type;
        this.pieceStack.add(currentPieceType);
        this.pieceStack.drawStack();
        this.grid.removeCurrentPiece();
        const nextPieceType = this.pieceQueue.getNextPieceType();
        this.grid.insertNewPiece(nextPieceType);
        this.pieceQueue.dequeue();
        this.pieceQueue.drawQueue();
      } else {
        const currentPieceType = this.grid.getCurrentPiece()[0].type;
        this.grid.removeCurrentPiece();
        this.grid.insertNewPiece(this.pieceStack.peek());
        this.pieceStack.remove();
        this.pieceStack.add(currentPieceType);
        this.pieceStack.drawStack();
      }
      this.hasSaved = true;
    }
  }
}

export default Game;
