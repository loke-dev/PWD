"use strict";

var newWindow = require("./window");
var Memory = require("./Memory");
var TaskBar = require("./taskbar");

var Menu = new TaskBar();

Menu.dockBar();

var buttonStart = document.querySelector("#memoryButton");

buttonStart.addEventListener("click", function(event) {
    event.preventDefault();
    newWindow.genWindow();
    newWindow.newWindow();
    var game = new Memory(4, 4);
    game.startGame();
}, false);
