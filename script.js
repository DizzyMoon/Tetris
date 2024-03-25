import Game from "./Game.js";

("use strict");

window.addEventListener("DOMContentLoaded", start);

function start() {
  console.log("Javascript is running :)");
  const game = new Game();
  game.start();
}
