"use strict";

var Window = require("./window");
var Memory = require("./Memory");
var TaskBar = require("./taskbar");
var Settings = require("./Settings");

var Desktop = function() {
    this.ele = undefined;
    this.id = undefined;
    this.number = 0;
    this.username = undefined;
    this.sound = new Audio("http://5.101.100.107/bsod.wav");
};

Desktop.prototype.generate = function() {
    var Menu = new TaskBar();
    Menu.dockBar();
    var initWindow = new Window();
    initWindow.popupClose();

    var dockClearAll = document.querySelector("#clearAllButton");
    dockClearAll.addEventListener("click", function(event) {
    event.preventDefault();
    var dragWindow = new Window();
    dragWindow.popupOpen();

    var popupClose = document.querySelector(".s3-btn-close");
    popupClose.addEventListener("click", function(event) {
        event.preventDefault();
        var dragWindow = new Window();
        dragWindow.popupClose();
    }, false);

    var popupClose2 = document.querySelector(".cancelPopup");
    popupClose2.addEventListener("click", function(event) {
        event.preventDefault();
        var dragWindow = new Window();
        dragWindow.popupClose();
    }, false);

    var popupClear = document.querySelector(".confirmPopup");
    popupClear.addEventListener("click", function(event) {
        event.preventDefault();
        var dragWindow = new Window();
        dragWindow.clearAll();
        dragWindow.popupClose();
    }, false);

}, false);

    var dockMemory = document.querySelector("#memoryButton");

    dockMemory.addEventListener("click", function(event) {
        event.preventDefault();
        var container = document.querySelector("#container");
        var template = document.querySelector("#initialMemory");
        var temp = document.importNode(template.content, true);
        this.id = "id-" + this.number.toString();
        temp.firstElementChild.setAttribute("id", this.id);
        container.appendChild(temp);
        this.ele = document.getElementById(this.id);
        this.number += 1;
        var game = new Memory(this.ele);
        game.memory();
        var dragWindow = new Window(this.ele);
        dragWindow.newWindow();
        this.close(dragWindow);
    }.bind(this), false);

    var dockChat = document.querySelector("#chatButton");

    dockChat.addEventListener("click", function(event) {
        event.preventDefault();
        var container = document.querySelector("#container");
        var template = document.querySelector("#initialChat");
        var temp = document.importNode(template.content, true);
        this.id = "id-" + this.number.toString();
        temp.firstElementChild.setAttribute("id", this.id);
        container.appendChild(temp);
        this.ele = document.getElementById(this.id);
        this.number += 1;
        var dragWindow = new Window(this.ele);
        dragWindow.newWindow();
        dragWindow.genChat();
        this.close(dragWindow);
    }.bind(this), false);

    var dockExplorer = document.querySelector("#explorerButton");

    dockExplorer.addEventListener("click", function(event) {
        event.preventDefault();
        this.sound.play();
        var bsod = document.querySelector(".bsod");
        bsod.classList.remove("hidden");
        window.addEventListener("keypress", function() {
            bsod.classList.add("hidden");
        }, false);
    }.bind(this), false);

    var guestbook = document.querySelector("#guestBookButton");

    guestbook.addEventListener("click", function(event) {
        event.preventDefault();
        var clickOnce = document.querySelector(".guestbook");
        if (!clickOnce) {
            var container = document.querySelector("#container");
            var template = document.querySelector("#guestbook");
            var temp = document.importNode(template.content, true);
            this.id = "id-" + this.number.toString();
            temp.firstElementChild.setAttribute("id", this.id);
            container.appendChild(temp);
            this.ele = document.getElementById(this.id);
            this.number += 1;
            var dragWindow = new Window(this.ele);
            dragWindow.newWindow();
            this.close(dragWindow);
        }
    }.bind(this), false);

    var settings = document.querySelector("#settingsButton");

    settings.addEventListener("click", function(event) {
        event.preventDefault();
        var clickOnce = document.querySelector(".settings");
        if (!clickOnce) {
            var container = document.querySelector("#container");
            var template = document.querySelector("#settings");
            var temp = document.importNode(template.content, true);
            this.id = "id-" + this.number.toString();
            temp.firstElementChild.setAttribute("id", this.id);
            container.appendChild(temp);
            this.ele = document.getElementById(this.id);
            this.number += 1;
            var dragWindow = new Window(this.ele);
            dragWindow.newWindow();
            this.close(dragWindow);
            var background = new Settings();
            background.background();
        }
    }.bind(this), false);
};

Desktop.prototype.close = function(window) {
    var close = this.ele.querySelector(".close");
    close.addEventListener("click", function(event) {
        event.preventDefault();
        window.closeCurrent();
    }, false);
};

module.exports = Desktop;
