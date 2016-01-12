"use strict";

var Chat = require("./Chat");

/**
 * Move function based of this source "http://codepen.io/thebabydino/pen/Afams".
 * @param ele - The current window
 * @constructor
 */
var Window = function(ele) {
    this.ele = ele;
    this.username = undefined;
    this.channel = undefined;
};

/**
 * Close the window that close button has been pressed on
 */
Window.prototype.closeCurrent = function() {
    this.ele.remove();
};

/**
 * Drag logic for the windows
 */
Window.prototype.newWindow = function() {
    var element = this.ele;
    var p1 = {
        x: parseInt(element.dataset.x, 10),
        y: parseInt(element.dataset.y, 10)
    };
    var p0 = {
        x: parseInt(element.dataset.x, 10),
        y: parseInt(element.dataset.y, 10)
    };
    var coords = {
        x: parseInt(element.dataset.x, 10),
        y: parseInt(element.dataset.y, 10)
    };
    var flag;

    var drag = function(e) {
        p1 = {x: e.clientX, y: e.clientY};

        element.dataset.x = coords.x + p1.x - p0.x;
        element.dataset.y = coords.y + p1.y - p0.y;

        element.style["-webkit-transform"] =
            "translate(" + element.dataset.x + "px, " + element.dataset.y + "px)";
        element.style.transform =
            "translate(" + element.dataset.x + "px, " + element.dataset.y + "px)";
    };

    window.addEventListener("mousedown", function(e) {
        var t = e.target;

        if (t === element.querySelector("h1")) {
            p0 = {x: e.clientX, y: e.clientY};
            flag = true;

            window.addEventListener("mousemove", drag, false);
        }
        else {
            flag = false;
        }
    }.bind(this), false);

    window.addEventListener("mouseup", function() {
        if (flag) {
            coords.x += p1.x - p0.x;
            coords.y += p1.y - p0.y;
        }

        window.removeEventListener("mousemove", drag, false);
    }.bind(this), false);
};

/**
 * Removes everything inside the container
 */
Window.prototype.clearAll = function() {
    var el = document.querySelector("#container");
    if (el) {
        while (el.hasChildNodes()) {
            el.removeChild(el.lastChild);
        }
    }
};

/**
 * Clear everything inside the element that is passed to this function
 * @param element - Current element
 */
Window.prototype.clearWindow = function(element) {
    var el = element;
    if (el) {
        while (el.hasChildNodes()) {
            el.removeChild(el.lastChild);
        }
    }
};

/**
 * Generates the chat window when user enters a nickname
 */
Window.prototype.genChat = function() {
    var initChat = this.ele.querySelector(".button");
    initChat.addEventListener("click", function(event) {
        event.preventDefault();
        this.setChannel();
        this.setUsername();
        this.setPlaceholder();
        this.chatFunc();
    }.bind(this), false);

    var initChatEnter = this.ele.querySelector(".userName");
    initChatEnter.addEventListener("keypress", function(e) {
        var key = e.which || e.keyCode;
        if (key === 13) { // 13 is enter
            this.setChannel();
            this.setUsername();
            this.chatFunc();
        }
    }.bind(this), false);

    var initChatEnterNick = this.ele.querySelector(".channel");
    initChatEnterNick.addEventListener("keypress", function(e) {
        var key = e.which || e.keyCode;
        if (key === 13) { // 13 is enter
            this.setChannel();
            this.setUsername();
            this.chatFunc();
        }
    }.bind(this), false);
};

/**
 * Generates the new chat window after user has set nickname
 */
Window.prototype.chatFunc = function() {
    event.preventDefault();
    this.saveUsername();
    var windowContainer = this.ele.querySelector(".windowContainer");
    var chatTemplate = document.querySelector("#chatWindow");
    var tempWindow = document.importNode(chatTemplate.content, true);
    this.clearWindow(windowContainer);
    windowContainer.appendChild(tempWindow);
    var MyChat = new Chat(this.username, this.channel, this.ele);
    MyChat.server();
    this.ele.querySelector(".chatBox").focus();
};

/**
 * Handles how the username is set
 */
Window.prototype.setUsername = function() {
    var localUser;
    var username = this.ele.querySelector(".userName").value;

    if (localStorage.getItem("username") !== null) {
        localUser = JSON.parse(localStorage.getItem("username"));
    }

    if (username) {
        this.username = username;
        console.log("using text field");
    } else {
        this.username = localUser || "Loke";
        console.log("using local storage or default");
    }
};

/**
 * Saves the username to localstorage
 */
Window.prototype.saveUsername = function() {
    var username = this.ele.querySelector(".userName");
    if (username.value) {
        localStorage.setItem("username", JSON.stringify(username.value));
        this.setPlaceholder();
    }
};

/**
 * If defined, use channel
 */
Window.prototype.setChannel = function() {
    var channel = this.ele.querySelector(".channel");
    if (channel.value) {
        this.channel = channel.value;
    }
};

/**
 * Sets the username to the placeholder
 */
Window.prototype.setPlaceholder = function() {
    document.querySelector(".userName").placeholder = this.username;
    console.log(this.username);
};

/**
 * Displays the popup clear desktop
 */
Window.prototype.popupOpen = function() {
    document.querySelector("#popup").style.display = "block";
    document.querySelector("#overlay").style.display = "block";
};

/**
 * Closes the popup clear desktop
 */
Window.prototype.popupClose = function() {
    document.querySelector("#popup").style.display = "none";
    document.querySelector("#overlay").style.display = "none";
};

module.exports = Window;

