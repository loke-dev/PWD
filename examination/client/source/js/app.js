"use strict";

var newWindow = require("./window");
var Memory = require("./Memory");
var TaskBar = require("./taskbar");
var Chat = require("./Chat");



var Menu = new TaskBar();
Menu.dockBar();

var Window = new newWindow();
Window.popupClose();

var dockClearAll = document.querySelector("#clearAllButton");
dockClearAll.addEventListener("click", function(event) {
    event.preventDefault();
    var Window = new newWindow();
    Window.popupOpen();

    var popupClose = document.querySelector(".s3-btn-close");
    popupClose.addEventListener("click", function(event) {
        event.preventDefault();
        var Window = new newWindow();
        Window.popupClose();
    }, false);

    var popupClose2 = document.querySelector(".cancelPopup");
    popupClose2.addEventListener("click", function(event) {
        event.preventDefault();
        var Window = new newWindow();
        Window.popupClose();
    }, false);

    var popupClear = document.querySelector(".confirmPopup");
    popupClear.addEventListener("click", function(event) {
        event.preventDefault();
        var Window = new newWindow();
        Window.clearAll();
        Window.popupClose();
    }, false);

}, false);


var dockMemory = document.querySelector("#memoryButton");

dockMemory.addEventListener("click", function(event) {
    event.preventDefault();
    var Window = new newWindow();
    Window.genWindow();
    var windowDiv = document.querySelectorAll(".point");
    for (var i = 0; i < windowDiv.length; i += 1) {
        Window.newWindow(windowDiv[i]);
    }
    var newMemory = document.querySelector(".startMemory");
    newMemory.addEventListener("click", function() {
        event.preventDefault();
        var game = new Memory(4, 4);
        game.clear();
        game.startGame();
    }, false);
}, false);

var dockChat = document.querySelector("#chatButton");

dockChat.addEventListener("click", function(event) {
    event.preventDefault();
    var Window = new newWindow();
    Window.genChat();
    var windowDiv = document.querySelectorAll(".point");
    for (var i = 0; i < windowDiv.length; i += 1) {
        Window.newWindow(windowDiv[i]);
    }
    var MyChat = new Chat();
    MyChat.server();
}, false);
