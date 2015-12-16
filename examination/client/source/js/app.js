"use strict";

var newWindow = require("./window");
var Memory = require("./Memory");

newWindow.newWindow();

var buttonStart = document.querySelector(".startMemory");

buttonStart.addEventListener("click", function(event) {
    event.preventDefault();
    var game = new Memory(4, 4);
    game.startGame();
}, false);
