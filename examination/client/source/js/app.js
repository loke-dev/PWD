"use strict";

var newWindow = require("./window");
var Memory = require("./Memory");
var TaskBar = require("./taskbar");

var Menu = new TaskBar();
Menu.dockBar();

var dockClearAll = document.querySelector("#clearAllButton");
dockClearAll.addEventListener("click", function(event) {
    event.preventDefault();
    var Window = new newWindow();
    Window.clearAll();
}, false);


var dockMemory = document.querySelector("#memoryButton");

dockMemory.addEventListener("click", function(event) {
    event.preventDefault();
    var Window = new newWindow();
    Window.genWindow();
    Window.newWindow();
    var newMemory = document.querySelector(".startMemory");
    newMemory.addEventListener("click", function() {
        var game = new Memory(4, 4);
        game.clear();
        game.startGame();
    }, false);
}, false);

