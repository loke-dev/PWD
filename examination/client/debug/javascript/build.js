(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Chat = function(username, element) {
    this.chatBox = "";
    this.socket = new WebSocket("ws://vhost3.lnu.se:20080/socket/");
    this.username = username || "Loke";
    this.channel = "";
    this.key = "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd";
    this.data = {};
    this.message = undefined;
    this.textArea = undefined;
    this.element = element;
};

/**
 *
 */
Chat.prototype.server = function() {

    //EventListener for when communication is open
    this.socket.addEventListener("open", function() {
        var sendChat = this.element.querySelector(".sendChat");
        sendChat.addEventListener("click", function(event) {
            event.preventDefault();
            this.send();
        }.bind(this), false);

        var enterChat = this.element.querySelector(".chatBox");
        enterChat.addEventListener("keypress", function(e) {
            var key = e.which || e.keyCode;
            if (key === 13) { // 13 is enter
                this.send();
            }
        }.bind(this), false);
    }.bind(this));

    this.socket.addEventListener("message", function(event) {
        this.message = JSON.parse(event.data);
        if (this.message.data !== "") {
            console.log(this.message.username + ": " + this.message.data);
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(this.message.username + ": " + this.message.data));
            this.textArea = this.element.querySelector(".textArea");
            this.textArea.appendChild(li);

            //Scrolls down when new message is arrived
            var chatEl = this.element.querySelector(".textContainer");
            chatEl.scrollTop = chatEl.scrollHeight;
        }

    }.bind(this));
};

Chat.prototype.send = function() {
    this.chatBox = this.element.querySelector(".chatBox");
    this.data = {
        type: "message",
        data: this.chatBox.value,
        username: this.username,
        channel: this.channel,
        key: this.key
    };
    this.socket.send(JSON.stringify(this.data));
    this.chatBox.value = "";
    this.chatBox.focus();
};

module.exports = Chat;

},{}],2:[function(require,module,exports){
"use strict";

var Window = require("./window");
var Memory = require("./Memory");
var TaskBar = require("./taskbar");

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

},{"./Memory":3,"./taskbar":5,"./window":6}],3:[function(require,module,exports){
"use strict";

/**
 * Memory constructor
 * @param ele - Current element
 * @constructor
 */
var Memory = function(ele) {
    this.rows = undefined;
    this.cols = undefined;
    this.element = ele;
    this.arr = [];
    this.turn1 = "";
    this.turn2 = "";
    this.lastTile = "";
    this.tries = 0;
    this.pairs = 0;
};

/**
 * Eventlistener for the start button
 */
Memory.prototype.memory = function() {
    var memoryButton = this.element.querySelector(".startMemory");
    memoryButton.addEventListener("click", function(event) {
        event.preventDefault();
        var memorySize = this.element.querySelector(".memorySize");
        var chosenSize = memorySize.options[memorySize.selectedIndex].value;

        if (chosenSize === "16") {
            this.rows = 4;
            this.cols = 4;
        } else if (chosenSize === "8") {
            this.rows = 2;
            this.cols = 4;
        } else {
            this.rows = 2;
            this.cols = 2;
        }

        this.startGame();
    }.bind(this), false);
};

/**
 * Starting point of the game
 */
Memory.prototype.startGame = function() {
    this.clear();
    this.createArray();
    this.createBoard();
};

/**
 * Clear the memory play area and variables that saves a value
 */
Memory.prototype.clear = function() {
    var el = this.element.querySelector(".memoryContainer");
    if (el) {
        while (el.hasChildNodes()) {
            el.removeChild(el.lastChild);
        }
    }

    this.arr = [];
    this.turn1 = "";
    this.turn2 = "";
    this.lastTile = "";
    this.tries = 0;
    this.pairs = 0;
};

/**
 * Dynamically creates the board
 */
Memory.prototype.createBoard = function() {
    var container = this.element.querySelector(".memoryContainer");
    var template = document.querySelectorAll("#memoryTemplate")[0].content.firstElementChild;
    var a;

    this.arr.forEach(function(tile, index) {
        a = document.importNode(template, true);
        container.appendChild(a);
        if ((index + 1) % this.cols === 0) {
            container.appendChild(document.createElement("br"));
        }

        a.addEventListener("click", function(event) {
            event.preventDefault();
            var img = event.target.nodeName === "IMG" ? event.target : event.target.firstElementChild;
            this.turnBrick(tile, index, img);
        }.bind(this), false);
    }.bind(this));

};

/**
 * Dynamically creates the array for the selection of images
 */
Memory.prototype.createArray = function() {
    for (var i = 1; i <= ((this.rows * this.cols) / 2); i += 1) {
        this.arr.push(i);
        this.arr.push(i);
    }

    return this.shuffle(this.arr);
};

Memory.prototype.turnBrick = function(tile, index, img) {
    if (this.turn2) { return; }

    img.src = "image/" + tile + ".png";

    if (!this.turn1) {
        this.turn1 = img;
        this.lastTile = tile;

    } else {
        if (img === this.turn1) { return; }

        this.tries += 1;

        this.turn2 = img;

        if (tile === this.lastTile) {
            this.pairs += 1;
            if (this.pairs === (this.cols * this.rows) / 2) {
                var el = this.element.querySelector(".memoryContainer");
                if (el) {
                    while (el.hasChildNodes()) {
                        el.removeChild(el.lastChild);
                    }
                }

                this.win();
                console.log("Won on " + this.tries + " number of tries!");
                return;
            }

            setTimeout(function() {
                this.turn1.parentNode.classList.add("removed");
                this.turn2.parentNode.classList.add("removed");
                this.turn1 = null;
                this.turn2 = null;
            }.bind(this), 300);
        } else {
            window.setTimeout(function() {
                this.turn1.src = "image/0.png";
                this.turn2.src = "image/0.png";
                this.turn1 = null;
                this.turn2 = null;
            }.bind(this), 500);
        }
    }
};

/**
 * This prototype handles the shuffling of the deck
 * http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * @param indexArr - the array to be shuffled
 * @returns {*}
 */
Memory.prototype.shuffle = function(indexArr) {
    var array = indexArr;
    var currentIndex = array.length;
    var temporaryValue;
    var randomIndex;

    while (currentIndex !== 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;

};

Memory.prototype.win = function() {
    var container = this.element.querySelector(".memoryContainer");
    var template = document.querySelectorAll("#memoryWin")[0].content;
    var a = document.importNode(template, true);
    container.appendChild(a);

    var memoryWinTries = this.element.querySelector(".memoryWinTries");
    var b = document.createTextNode("Won on " + this.tries + " number of tries!");
    memoryWinTries.appendChild(b);
};

module.exports = Memory;

},{}],4:[function(require,module,exports){
"use strict";

var Desktop = require("./Desktop");
var desktop = new Desktop();
desktop.generate();

/*
TODO: 3'rd app: Notepad?
TODO:
 */

},{"./Desktop":2}],5:[function(require,module,exports){
"use strict";

var TaskBar = function() {
};

/**
 *
 */
TaskBar.prototype.dockBar = function() {
    function addPrevClass(e) {
        var target = e.target;
        if (target.getAttribute("src")) {
            var li = target.parentNode.parentNode;
            var prevLi = li.previousElementSibling;
            if (prevLi) {
                prevLi.className = "prev";
            }

            target.addEventListener("mouseout", function() {
                if (prevLi) {
                    prevLi.removeAttribute("class");
                }
            }, false);
        } else {
            var prevLi2 = target.previousElementSibling;
            if (prevLi2) {
                prevLi2.className = "prev";
            }

            target.addEventListener("mouseout", function() {
                if (prevLi2) {
                    prevLi2.removeAttribute("class");
                }
            }, false);
        }
    }

    if (window.addEventListener) {
        document.getElementById("dock").addEventListener("mouseover", addPrevClass, false);
    }
};

module.exports = TaskBar;

},{}],6:[function(require,module,exports){
"use strict";

var Chat = require("./Chat");

/**
 * Move function based of this source "http://codepen.io/thebabydino/pen/Afams".
 */
var Window = function(ele) {
    this.ele = ele;
    this.username = undefined;
};

Window.prototype.closeCurrent = function() {
    this.ele.remove();
};

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

Window.prototype.clearAll = function() {
    var el = document.querySelector("#container");
    if (el) {
        while (el.hasChildNodes()) {
            el.removeChild(el.lastChild);
        }
    }
};

Window.prototype.clearWindow = function(element) {
    var el = element;
    if (el) {
        while (el.hasChildNodes()) {
            el.removeChild(el.lastChild);
        }
    }
};

Window.prototype.genChat = function() {
    var initChat = this.ele.querySelector(".button");
    initChat.addEventListener("click", function(event) {
        event.preventDefault();
        this.setUsername();
        this.setPlaceholder();
        this.chatFunc();
    }.bind(this), false);

    var initChatEnter = this.ele.querySelector(".userName");
    initChatEnter.addEventListener("keypress", function(e) {
        var key = e.which || e.keyCode;
        if (key === 13) { // 13 is enter
            this.setUsername();
            this.setPlaceholder();
            this.chatFunc();
        }
    }.bind(this), false);
};

Window.prototype.chatFunc = function() {
    event.preventDefault();
    var windowContainer = this.ele.querySelector(".windowContainer");
    var chatTemplate = document.querySelector("#chatWindow");
    var tempWindow = document.importNode(chatTemplate.content, true);
    this.clearWindow(windowContainer);
    windowContainer.appendChild(tempWindow);
    var MyChat = new Chat(this.username, this.ele);
    MyChat.server();
    this.ele.querySelector(".chatBox").focus();
    this.saveUsername();
};

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

Window.prototype.saveUsername = function() {
    var username = this.ele.querySelector(".userName");
    if (username.value) {
        localStorage.setItem("username", JSON.stringify(username.value));
    }
};

Window.prototype.setPlaceholder = function() {
    this.ele.querySelector(".userName").placeholder = this.username;
};

Window.prototype.popupOpen = function() {
    document.querySelector("#popup").style.display = "block";
    document.querySelector("#overlay").style.display = "block";
};

Window.prototype.popupClose = function() {
    document.querySelector("#popup").style.display = "none";
    document.querySelector("#overlay").style.display = "none";
};

module.exports = Window;


},{"./Chat":1}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvRGVza3RvcC5qcyIsImNsaWVudC9zb3VyY2UvanMvTWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiLCJjbGllbnQvc291cmNlL2pzL3Rhc2tiYXIuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBDaGF0ID0gZnVuY3Rpb24odXNlcm5hbWUsIGVsZW1lbnQpIHtcbiAgICB0aGlzLmNoYXRCb3ggPSBcIlwiO1xuICAgIHRoaXMuc29ja2V0ID0gbmV3IFdlYlNvY2tldChcIndzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvXCIpO1xuICAgIHRoaXMudXNlcm5hbWUgPSB1c2VybmFtZSB8fCBcIkxva2VcIjtcbiAgICB0aGlzLmNoYW5uZWwgPSBcIlwiO1xuICAgIHRoaXMua2V5ID0gXCJlREJFNzZkZVU3TDBIOW1FQmd4VUtWUjBWQ25xMFhCZFwiO1xuICAgIHRoaXMuZGF0YSA9IHt9O1xuICAgIHRoaXMubWVzc2FnZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnRleHRBcmVhID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG59O1xuXG4vKipcbiAqXG4gKi9cbkNoYXQucHJvdG90eXBlLnNlcnZlciA9IGZ1bmN0aW9uKCkge1xuXG4gICAgLy9FdmVudExpc3RlbmVyIGZvciB3aGVuIGNvbW11bmljYXRpb24gaXMgb3BlblxuICAgIHRoaXMuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VuZENoYXQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5zZW5kQ2hhdFwiKTtcbiAgICAgICAgc2VuZENoYXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gICAgICAgIHZhciBlbnRlckNoYXQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5jaGF0Qm94XCIpO1xuICAgICAgICBlbnRlckNoYXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBlLndoaWNoIHx8IGUua2V5Q29kZTtcbiAgICAgICAgICAgIGlmIChrZXkgPT09IDEzKSB7IC8vIDEzIGlzIGVudGVyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLnNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICBpZiAodGhpcy5tZXNzYWdlLmRhdGEgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMubWVzc2FnZS51c2VybmFtZSArIFwiOiBcIiArIHRoaXMubWVzc2FnZS5kYXRhKTtcbiAgICAgICAgICAgIHZhciBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgICAgIGxpLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMubWVzc2FnZS51c2VybmFtZSArIFwiOiBcIiArIHRoaXMubWVzc2FnZS5kYXRhKSk7XG4gICAgICAgICAgICB0aGlzLnRleHRBcmVhID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGV4dEFyZWFcIik7XG4gICAgICAgICAgICB0aGlzLnRleHRBcmVhLmFwcGVuZENoaWxkKGxpKTtcblxuICAgICAgICAgICAgLy9TY3JvbGxzIGRvd24gd2hlbiBuZXcgbWVzc2FnZSBpcyBhcnJpdmVkXG4gICAgICAgICAgICB2YXIgY2hhdEVsID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGV4dENvbnRhaW5lclwiKTtcbiAgICAgICAgICAgIGNoYXRFbC5zY3JvbGxUb3AgPSBjaGF0RWwuc2Nyb2xsSGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuQ2hhdC5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY2hhdEJveCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmNoYXRCb3hcIik7XG4gICAgdGhpcy5kYXRhID0ge1xuICAgICAgICB0eXBlOiBcIm1lc3NhZ2VcIixcbiAgICAgICAgZGF0YTogdGhpcy5jaGF0Qm94LnZhbHVlLFxuICAgICAgICB1c2VybmFtZTogdGhpcy51c2VybmFtZSxcbiAgICAgICAgY2hhbm5lbDogdGhpcy5jaGFubmVsLFxuICAgICAgICBrZXk6IHRoaXMua2V5XG4gICAgfTtcbiAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YSkpO1xuICAgIHRoaXMuY2hhdEJveC52YWx1ZSA9IFwiXCI7XG4gICAgdGhpcy5jaGF0Qm94LmZvY3VzKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdpbmRvdyA9IHJlcXVpcmUoXCIuL3dpbmRvd1wiKTtcbnZhciBNZW1vcnkgPSByZXF1aXJlKFwiLi9NZW1vcnlcIik7XG52YXIgVGFza0JhciA9IHJlcXVpcmUoXCIuL3Rhc2tiYXJcIik7XG5cbnZhciBEZXNrdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5lbGUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5pZCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLm51bWJlciA9IDA7XG4gICAgdGhpcy51c2VybmFtZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnNvdW5kID0gbmV3IEF1ZGlvKFwiaHR0cDovLzUuMTAxLjEwMC4xMDcvYnNvZC53YXZcIik7XG59O1xuXG5EZXNrdG9wLnByb3RvdHlwZS5nZW5lcmF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBNZW51ID0gbmV3IFRhc2tCYXIoKTtcbiAgICBNZW51LmRvY2tCYXIoKTtcbiAgICB2YXIgaW5pdFdpbmRvdyA9IG5ldyBXaW5kb3coKTtcbiAgICBpbml0V2luZG93LnBvcHVwQ2xvc2UoKTtcblxuICAgIHZhciBkb2NrQ2xlYXJBbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NsZWFyQWxsQnV0dG9uXCIpO1xuICAgIGRvY2tDbGVhckFsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBkcmFnV2luZG93ID0gbmV3IFdpbmRvdygpO1xuICAgIGRyYWdXaW5kb3cucG9wdXBPcGVuKCk7XG5cbiAgICB2YXIgcG9wdXBDbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuczMtYnRuLWNsb3NlXCIpO1xuICAgIHBvcHVwQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBkcmFnV2luZG93ID0gbmV3IFdpbmRvdygpO1xuICAgICAgICBkcmFnV2luZG93LnBvcHVwQ2xvc2UoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB2YXIgcG9wdXBDbG9zZTIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNhbmNlbFBvcHVwXCIpO1xuICAgIHBvcHVwQ2xvc2UyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgZHJhZ1dpbmRvdyA9IG5ldyBXaW5kb3coKTtcbiAgICAgICAgZHJhZ1dpbmRvdy5wb3B1cENsb3NlKCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgdmFyIHBvcHVwQ2xlYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbmZpcm1Qb3B1cFwiKTtcbiAgICBwb3B1cENsZWFyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgZHJhZ1dpbmRvdyA9IG5ldyBXaW5kb3coKTtcbiAgICAgICAgZHJhZ1dpbmRvdy5jbGVhckFsbCgpO1xuICAgICAgICBkcmFnV2luZG93LnBvcHVwQ2xvc2UoKTtcbiAgICB9LCBmYWxzZSk7XG5cbn0sIGZhbHNlKTtcblxuICAgIHZhciBkb2NrTWVtb3J5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlCdXR0b25cIik7XG5cbiAgICBkb2NrTWVtb3J5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250YWluZXJcIik7XG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjaW5pdGlhbE1lbW9yeVwiKTtcbiAgICAgICAgdmFyIHRlbXAgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICB0aGlzLmlkID0gXCJpZC1cIiArIHRoaXMubnVtYmVyLnRvU3RyaW5nKCk7XG4gICAgICAgIHRlbXAuZmlyc3RFbGVtZW50Q2hpbGQuc2V0QXR0cmlidXRlKFwiaWRcIiwgdGhpcy5pZCk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ZW1wKTtcbiAgICAgICAgdGhpcy5lbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkKTtcbiAgICAgICAgdGhpcy5udW1iZXIgKz0gMTtcbiAgICAgICAgdmFyIGdhbWUgPSBuZXcgTWVtb3J5KHRoaXMuZWxlKTtcbiAgICAgICAgZ2FtZS5tZW1vcnkoKTtcbiAgICAgICAgdmFyIGRyYWdXaW5kb3cgPSBuZXcgV2luZG93KHRoaXMuZWxlKTtcbiAgICAgICAgZHJhZ1dpbmRvdy5uZXdXaW5kb3coKTtcbiAgICAgICAgdGhpcy5jbG9zZShkcmFnV2luZG93KTtcbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcblxuICAgIHZhciBkb2NrQ2hhdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhdEJ1dHRvblwiKTtcblxuICAgIGRvY2tDaGF0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250YWluZXJcIik7XG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjaW5pdGlhbENoYXRcIik7XG4gICAgICAgIHZhciB0ZW1wID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgICAgdGhpcy5pZCA9IFwiaWQtXCIgKyB0aGlzLm51bWJlci50b1N0cmluZygpO1xuICAgICAgICB0ZW1wLmZpcnN0RWxlbWVudENoaWxkLnNldEF0dHJpYnV0ZShcImlkXCIsIHRoaXMuaWQpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGVtcCk7XG4gICAgICAgIHRoaXMuZWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCk7XG4gICAgICAgIHRoaXMubnVtYmVyICs9IDE7XG4gICAgICAgIHZhciBkcmFnV2luZG93ID0gbmV3IFdpbmRvdyh0aGlzLmVsZSk7XG4gICAgICAgIGRyYWdXaW5kb3cubmV3V2luZG93KCk7XG4gICAgICAgIGRyYWdXaW5kb3cuZ2VuQ2hhdCgpO1xuICAgICAgICB0aGlzLmNsb3NlKGRyYWdXaW5kb3cpO1xuICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gICAgdmFyIGRvY2tFeHBsb3JlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZXhwbG9yZXJCdXR0b25cIik7XG5cbiAgICBkb2NrRXhwbG9yZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuc291bmQucGxheSgpO1xuICAgICAgICB2YXIgYnNvZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYnNvZFwiKTtcbiAgICAgICAgYnNvZC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYnNvZC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgICB2YXIgZ3Vlc3Rib29rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNndWVzdEJvb2tCdXR0b25cIik7XG5cbiAgICBndWVzdGJvb2suYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBjbGlja09uY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmd1ZXN0Ym9va1wiKTtcbiAgICAgICAgaWYgKCFjbGlja09uY2UpIHtcbiAgICAgICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRhaW5lclwiKTtcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZ3Vlc3Rib29rXCIpO1xuICAgICAgICAgICAgdmFyIHRlbXAgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5pZCA9IFwiaWQtXCIgKyB0aGlzLm51bWJlci50b1N0cmluZygpO1xuICAgICAgICAgICAgdGVtcC5maXJzdEVsZW1lbnRDaGlsZC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0aGlzLmlkKTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ZW1wKTtcbiAgICAgICAgICAgIHRoaXMuZWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCk7XG4gICAgICAgICAgICB0aGlzLm51bWJlciArPSAxO1xuICAgICAgICAgICAgdmFyIGRyYWdXaW5kb3cgPSBuZXcgV2luZG93KHRoaXMuZWxlKTtcbiAgICAgICAgICAgIGRyYWdXaW5kb3cubmV3V2luZG93KCk7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKGRyYWdXaW5kb3cpO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgICB2YXIgc2V0dGluZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NldHRpbmdzQnV0dG9uXCIpO1xuXG4gICAgc2V0dGluZ3MuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBjbGlja09uY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNldHRpbmdzXCIpO1xuICAgICAgICBpZiAoIWNsaWNrT25jZSkge1xuICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzZXR0aW5nc1wiKTtcbiAgICAgICAgICAgIHZhciB0ZW1wID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBcImlkLVwiICsgdGhpcy5udW1iZXIudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIHRlbXAuZmlyc3RFbGVtZW50Q2hpbGQuc2V0QXR0cmlidXRlKFwiaWRcIiwgdGhpcy5pZCk7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGVtcCk7XG4gICAgICAgICAgICB0aGlzLmVsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWQpO1xuICAgICAgICAgICAgdGhpcy5udW1iZXIgKz0gMTtcbiAgICAgICAgICAgIHZhciBkcmFnV2luZG93ID0gbmV3IFdpbmRvdyh0aGlzLmVsZSk7XG4gICAgICAgICAgICBkcmFnV2luZG93Lm5ld1dpbmRvdygpO1xuICAgICAgICAgICAgdGhpcy5jbG9zZShkcmFnV2luZG93KTtcbiAgICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xufTtcblxuRGVza3RvcC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbih3aW5kb3cpIHtcbiAgICB2YXIgY2xvc2UgPSB0aGlzLmVsZS5xdWVyeVNlbGVjdG9yKFwiLmNsb3NlXCIpO1xuICAgIGNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB3aW5kb3cuY2xvc2VDdXJyZW50KCk7XG4gICAgfSwgZmFsc2UpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZXNrdG9wO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogTWVtb3J5IGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0gZWxlIC0gQ3VycmVudCBlbGVtZW50XG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIE1lbW9yeSA9IGZ1bmN0aW9uKGVsZSkge1xuICAgIHRoaXMucm93cyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmNvbHMgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlO1xuICAgIHRoaXMuYXJyID0gW107XG4gICAgdGhpcy50dXJuMSA9IFwiXCI7XG4gICAgdGhpcy50dXJuMiA9IFwiXCI7XG4gICAgdGhpcy5sYXN0VGlsZSA9IFwiXCI7XG4gICAgdGhpcy50cmllcyA9IDA7XG4gICAgdGhpcy5wYWlycyA9IDA7XG59O1xuXG4vKipcbiAqIEV2ZW50bGlzdGVuZXIgZm9yIHRoZSBzdGFydCBidXR0b25cbiAqL1xuTWVtb3J5LnByb3RvdHlwZS5tZW1vcnkgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbWVtb3J5QnV0dG9uID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3RhcnRNZW1vcnlcIik7XG4gICAgbWVtb3J5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgbWVtb3J5U2l6ZSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeVNpemVcIik7XG4gICAgICAgIHZhciBjaG9zZW5TaXplID0gbWVtb3J5U2l6ZS5vcHRpb25zW21lbW9yeVNpemUuc2VsZWN0ZWRJbmRleF0udmFsdWU7XG5cbiAgICAgICAgaWYgKGNob3NlblNpemUgPT09IFwiMTZcIikge1xuICAgICAgICAgICAgdGhpcy5yb3dzID0gNDtcbiAgICAgICAgICAgIHRoaXMuY29scyA9IDQ7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hvc2VuU2l6ZSA9PT0gXCI4XCIpIHtcbiAgICAgICAgICAgIHRoaXMucm93cyA9IDI7XG4gICAgICAgICAgICB0aGlzLmNvbHMgPSA0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yb3dzID0gMjtcbiAgICAgICAgICAgIHRoaXMuY29scyA9IDI7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0YXJ0R2FtZSgpO1xuICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xufTtcblxuLyoqXG4gKiBTdGFydGluZyBwb2ludCBvZiB0aGUgZ2FtZVxuICovXG5NZW1vcnkucHJvdG90eXBlLnN0YXJ0R2FtZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY2xlYXIoKTtcbiAgICB0aGlzLmNyZWF0ZUFycmF5KCk7XG4gICAgdGhpcy5jcmVhdGVCb2FyZCgpO1xufTtcblxuLyoqXG4gKiBDbGVhciB0aGUgbWVtb3J5IHBsYXkgYXJlYSBhbmQgdmFyaWFibGVzIHRoYXQgc2F2ZXMgYSB2YWx1ZVxuICovXG5NZW1vcnkucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGVsID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5Q29udGFpbmVyXCIpO1xuICAgIGlmIChlbCkge1xuICAgICAgICB3aGlsZSAoZWwuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICBlbC5yZW1vdmVDaGlsZChlbC5sYXN0Q2hpbGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hcnIgPSBbXTtcbiAgICB0aGlzLnR1cm4xID0gXCJcIjtcbiAgICB0aGlzLnR1cm4yID0gXCJcIjtcbiAgICB0aGlzLmxhc3RUaWxlID0gXCJcIjtcbiAgICB0aGlzLnRyaWVzID0gMDtcbiAgICB0aGlzLnBhaXJzID0gMDtcbn07XG5cbi8qKlxuICogRHluYW1pY2FsbHkgY3JlYXRlcyB0aGUgYm9hcmRcbiAqL1xuTWVtb3J5LnByb3RvdHlwZS5jcmVhdGVCb2FyZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb250YWluZXIgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW1vcnlDb250YWluZXJcIik7XG4gICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNtZW1vcnlUZW1wbGF0ZVwiKVswXS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkO1xuICAgIHZhciBhO1xuXG4gICAgdGhpcy5hcnIuZm9yRWFjaChmdW5jdGlvbih0aWxlLCBpbmRleCkge1xuICAgICAgICBhID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZSwgdHJ1ZSk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChhKTtcbiAgICAgICAgaWYgKChpbmRleCArIDEpICUgdGhpcy5jb2xzID09PSAwKSB7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdmFyIGltZyA9IGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gXCJJTUdcIiA/IGV2ZW50LnRhcmdldCA6IGV2ZW50LnRhcmdldC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgICAgIHRoaXMudHVybkJyaWNrKHRpbGUsIGluZGV4LCBpbWcpO1xuICAgICAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG59O1xuXG4vKipcbiAqIER5bmFtaWNhbGx5IGNyZWF0ZXMgdGhlIGFycmF5IGZvciB0aGUgc2VsZWN0aW9uIG9mIGltYWdlc1xuICovXG5NZW1vcnkucHJvdG90eXBlLmNyZWF0ZUFycmF5ID0gZnVuY3Rpb24oKSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gKCh0aGlzLnJvd3MgKiB0aGlzLmNvbHMpIC8gMik7IGkgKz0gMSkge1xuICAgICAgICB0aGlzLmFyci5wdXNoKGkpO1xuICAgICAgICB0aGlzLmFyci5wdXNoKGkpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnNodWZmbGUodGhpcy5hcnIpO1xufTtcblxuTWVtb3J5LnByb3RvdHlwZS50dXJuQnJpY2sgPSBmdW5jdGlvbih0aWxlLCBpbmRleCwgaW1nKSB7XG4gICAgaWYgKHRoaXMudHVybjIpIHsgcmV0dXJuOyB9XG5cbiAgICBpbWcuc3JjID0gXCJpbWFnZS9cIiArIHRpbGUgKyBcIi5wbmdcIjtcblxuICAgIGlmICghdGhpcy50dXJuMSkge1xuICAgICAgICB0aGlzLnR1cm4xID0gaW1nO1xuICAgICAgICB0aGlzLmxhc3RUaWxlID0gdGlsZTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpbWcgPT09IHRoaXMudHVybjEpIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgdGhpcy50cmllcyArPSAxO1xuXG4gICAgICAgIHRoaXMudHVybjIgPSBpbWc7XG5cbiAgICAgICAgaWYgKHRpbGUgPT09IHRoaXMubGFzdFRpbGUpIHtcbiAgICAgICAgICAgIHRoaXMucGFpcnMgKz0gMTtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhaXJzID09PSAodGhpcy5jb2xzICogdGhpcy5yb3dzKSAvIDIpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWwgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW1vcnlDb250YWluZXJcIik7XG4gICAgICAgICAgICAgICAgaWYgKGVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChlbC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLnJlbW92ZUNoaWxkKGVsLmxhc3RDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLndpbigpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV29uIG9uIFwiICsgdGhpcy50cmllcyArIFwiIG51bWJlciBvZiB0cmllcyFcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjEucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKFwicmVtb3ZlZFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4yLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZChcInJlbW92ZWRcIik7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMiA9IG51bGw7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIDMwMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4xLnNyYyA9IFwiaW1hZ2UvMC5wbmdcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4yLnNyYyA9IFwiaW1hZ2UvMC5wbmdcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4xID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4yID0gbnVsbDtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgNTAwKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogVGhpcyBwcm90b3R5cGUgaGFuZGxlcyB0aGUgc2h1ZmZsaW5nIG9mIHRoZSBkZWNrXG4gKiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI0NTA5NTQvaG93LXRvLXJhbmRvbWl6ZS1zaHVmZmxlLWEtamF2YXNjcmlwdC1hcnJheVxuICogQHBhcmFtIGluZGV4QXJyIC0gdGhlIGFycmF5IHRvIGJlIHNodWZmbGVkXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuTWVtb3J5LnByb3RvdHlwZS5zaHVmZmxlID0gZnVuY3Rpb24oaW5kZXhBcnIpIHtcbiAgICB2YXIgYXJyYXkgPSBpbmRleEFycjtcbiAgICB2YXIgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoO1xuICAgIHZhciB0ZW1wb3JhcnlWYWx1ZTtcbiAgICB2YXIgcmFuZG9tSW5kZXg7XG5cbiAgICB3aGlsZSAoY3VycmVudEluZGV4ICE9PSAwKSB7XG5cbiAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xuICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcblxuICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XG4gICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcblxufTtcblxuTWVtb3J5LnByb3RvdHlwZS53aW4gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29udGFpbmVyID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5Q29udGFpbmVyXCIpO1xuICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjbWVtb3J5V2luXCIpWzBdLmNvbnRlbnQ7XG4gICAgdmFyIGEgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLCB0cnVlKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYSk7XG5cbiAgICB2YXIgbWVtb3J5V2luVHJpZXMgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW1vcnlXaW5Ucmllc1wiKTtcbiAgICB2YXIgYiA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiV29uIG9uIFwiICsgdGhpcy50cmllcyArIFwiIG51bWJlciBvZiB0cmllcyFcIik7XG4gICAgbWVtb3J5V2luVHJpZXMuYXBwZW5kQ2hpbGQoYik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRGVza3RvcCA9IHJlcXVpcmUoXCIuL0Rlc2t0b3BcIik7XG52YXIgZGVza3RvcCA9IG5ldyBEZXNrdG9wKCk7XG5kZXNrdG9wLmdlbmVyYXRlKCk7XG5cbi8qXG5UT0RPOiAzJ3JkIGFwcDogTm90ZXBhZD9cblRPRE86XG4gKi9cbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIFRhc2tCYXIgPSBmdW5jdGlvbigpIHtcclxufTtcclxuXHJcbi8qKlxyXG4gKlxyXG4gKi9cclxuVGFza0Jhci5wcm90b3R5cGUuZG9ja0JhciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgZnVuY3Rpb24gYWRkUHJldkNsYXNzKGUpIHtcclxuICAgICAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcbiAgICAgICAgaWYgKHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJzcmNcIikpIHtcclxuICAgICAgICAgICAgdmFyIGxpID0gdGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZTtcclxuICAgICAgICAgICAgdmFyIHByZXZMaSA9IGxpLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICAgIGlmIChwcmV2TGkpIHtcclxuICAgICAgICAgICAgICAgIHByZXZMaS5jbGFzc05hbWUgPSBcInByZXZcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcmV2TGkpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2TGkucmVtb3ZlQXR0cmlidXRlKFwiY2xhc3NcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgcHJldkxpMiA9IHRhcmdldC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgICBpZiAocHJldkxpMikge1xyXG4gICAgICAgICAgICAgICAgcHJldkxpMi5jbGFzc05hbWUgPSBcInByZXZcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcmV2TGkyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldkxpMi5yZW1vdmVBdHRyaWJ1dGUoXCJjbGFzc1wiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAod2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRvY2tcIikuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLCBhZGRQcmV2Q2xhc3MsIGZhbHNlKTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGFza0JhcjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBDaGF0ID0gcmVxdWlyZShcIi4vQ2hhdFwiKTtcblxuLyoqXG4gKiBNb3ZlIGZ1bmN0aW9uIGJhc2VkIG9mIHRoaXMgc291cmNlIFwiaHR0cDovL2NvZGVwZW4uaW8vdGhlYmFieWRpbm8vcGVuL0FmYW1zXCIuXG4gKi9cbnZhciBXaW5kb3cgPSBmdW5jdGlvbihlbGUpIHtcbiAgICB0aGlzLmVsZSA9IGVsZTtcbiAgICB0aGlzLnVzZXJuYW1lID0gdW5kZWZpbmVkO1xufTtcblxuV2luZG93LnByb3RvdHlwZS5jbG9zZUN1cnJlbnQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVsZS5yZW1vdmUoKTtcbn07XG5cbldpbmRvdy5wcm90b3R5cGUubmV3V2luZG93ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGVsZW1lbnQgPSB0aGlzLmVsZTtcbiAgICB2YXIgcDEgPSB7XG4gICAgICAgIHg6IHBhcnNlSW50KGVsZW1lbnQuZGF0YXNldC54LCAxMCksXG4gICAgICAgIHk6IHBhcnNlSW50KGVsZW1lbnQuZGF0YXNldC55LCAxMClcbiAgICB9O1xuICAgIHZhciBwMCA9IHtcbiAgICAgICAgeDogcGFyc2VJbnQoZWxlbWVudC5kYXRhc2V0LngsIDEwKSxcbiAgICAgICAgeTogcGFyc2VJbnQoZWxlbWVudC5kYXRhc2V0LnksIDEwKVxuICAgIH07XG4gICAgdmFyIGNvb3JkcyA9IHtcbiAgICAgICAgeDogcGFyc2VJbnQoZWxlbWVudC5kYXRhc2V0LngsIDEwKSxcbiAgICAgICAgeTogcGFyc2VJbnQoZWxlbWVudC5kYXRhc2V0LnksIDEwKVxuICAgIH07XG4gICAgdmFyIGZsYWc7XG5cbiAgICB2YXIgZHJhZyA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgcDEgPSB7eDogZS5jbGllbnRYLCB5OiBlLmNsaWVudFl9O1xuXG4gICAgICAgIGVsZW1lbnQuZGF0YXNldC54ID0gY29vcmRzLnggKyBwMS54IC0gcDAueDtcbiAgICAgICAgZWxlbWVudC5kYXRhc2V0LnkgPSBjb29yZHMueSArIHAxLnkgLSBwMC55O1xuXG4gICAgICAgIGVsZW1lbnQuc3R5bGVbXCItd2Via2l0LXRyYW5zZm9ybVwiXSA9XG4gICAgICAgICAgICBcInRyYW5zbGF0ZShcIiArIGVsZW1lbnQuZGF0YXNldC54ICsgXCJweCwgXCIgKyBlbGVtZW50LmRhdGFzZXQueSArIFwicHgpXCI7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID1cbiAgICAgICAgICAgIFwidHJhbnNsYXRlKFwiICsgZWxlbWVudC5kYXRhc2V0LnggKyBcInB4LCBcIiArIGVsZW1lbnQuZGF0YXNldC55ICsgXCJweClcIjtcbiAgICB9O1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgdCA9IGUudGFyZ2V0O1xuXG4gICAgICAgIGlmICh0ID09PSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoMVwiKSkge1xuICAgICAgICAgICAgcDAgPSB7eDogZS5jbGllbnRYLCB5OiBlLmNsaWVudFl9O1xuICAgICAgICAgICAgZmxhZyA9IHRydWU7XG5cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGRyYWcsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZsYWcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZmxhZykge1xuICAgICAgICAgICAgY29vcmRzLnggKz0gcDEueCAtIHAwLng7XG4gICAgICAgICAgICBjb29yZHMueSArPSBwMS55IC0gcDAueTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGRyYWcsIGZhbHNlKTtcbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcbn07XG5cbldpbmRvdy5wcm90b3R5cGUuY2xlYXJBbGwgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRhaW5lclwiKTtcbiAgICBpZiAoZWwpIHtcbiAgICAgICAgd2hpbGUgKGVsLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgZWwucmVtb3ZlQ2hpbGQoZWwubGFzdENoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbldpbmRvdy5wcm90b3R5cGUuY2xlYXJXaW5kb3cgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgdmFyIGVsID0gZWxlbWVudDtcbiAgICBpZiAoZWwpIHtcbiAgICAgICAgd2hpbGUgKGVsLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgZWwucmVtb3ZlQ2hpbGQoZWwubGFzdENoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbldpbmRvdy5wcm90b3R5cGUuZ2VuQ2hhdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbml0Q2hhdCA9IHRoaXMuZWxlLnF1ZXJ5U2VsZWN0b3IoXCIuYnV0dG9uXCIpO1xuICAgIGluaXRDaGF0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLnNldFVzZXJuYW1lKCk7XG4gICAgICAgIHRoaXMuc2V0UGxhY2Vob2xkZXIoKTtcbiAgICAgICAgdGhpcy5jaGF0RnVuYygpO1xuICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gICAgdmFyIGluaXRDaGF0RW50ZXIgPSB0aGlzLmVsZS5xdWVyeVNlbGVjdG9yKFwiLnVzZXJOYW1lXCIpO1xuICAgIGluaXRDaGF0RW50ZXIuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIGtleSA9IGUud2hpY2ggfHwgZS5rZXlDb2RlO1xuICAgICAgICBpZiAoa2V5ID09PSAxMykgeyAvLyAxMyBpcyBlbnRlclxuICAgICAgICAgICAgdGhpcy5zZXRVc2VybmFtZSgpO1xuICAgICAgICAgICAgdGhpcy5zZXRQbGFjZWhvbGRlcigpO1xuICAgICAgICAgICAgdGhpcy5jaGF0RnVuYygpO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG59O1xuXG5XaW5kb3cucHJvdG90eXBlLmNoYXRGdW5jID0gZnVuY3Rpb24oKSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB2YXIgd2luZG93Q29udGFpbmVyID0gdGhpcy5lbGUucXVlcnlTZWxlY3RvcihcIi53aW5kb3dDb250YWluZXJcIik7XG4gICAgdmFyIGNoYXRUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhdFdpbmRvd1wiKTtcbiAgICB2YXIgdGVtcFdpbmRvdyA9IGRvY3VtZW50LmltcG9ydE5vZGUoY2hhdFRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgIHRoaXMuY2xlYXJXaW5kb3cod2luZG93Q29udGFpbmVyKTtcbiAgICB3aW5kb3dDb250YWluZXIuYXBwZW5kQ2hpbGQodGVtcFdpbmRvdyk7XG4gICAgdmFyIE15Q2hhdCA9IG5ldyBDaGF0KHRoaXMudXNlcm5hbWUsIHRoaXMuZWxlKTtcbiAgICBNeUNoYXQuc2VydmVyKCk7XG4gICAgdGhpcy5lbGUucXVlcnlTZWxlY3RvcihcIi5jaGF0Qm94XCIpLmZvY3VzKCk7XG4gICAgdGhpcy5zYXZlVXNlcm5hbWUoKTtcbn07XG5cbldpbmRvdy5wcm90b3R5cGUuc2V0VXNlcm5hbWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbG9jYWxVc2VyO1xuICAgIHZhciB1c2VybmFtZSA9IHRoaXMuZWxlLnF1ZXJ5U2VsZWN0b3IoXCIudXNlck5hbWVcIikudmFsdWU7XG5cbiAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ1c2VybmFtZVwiKSAhPT0gbnVsbCkge1xuICAgICAgICBsb2NhbFVzZXIgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidXNlcm5hbWVcIikpO1xuICAgIH1cblxuICAgIGlmICh1c2VybmFtZSkge1xuICAgICAgICB0aGlzLnVzZXJuYW1lID0gdXNlcm5hbWU7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidXNpbmcgdGV4dCBmaWVsZFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnVzZXJuYW1lID0gbG9jYWxVc2VyIHx8IFwiTG9rZVwiO1xuICAgICAgICBjb25zb2xlLmxvZyhcInVzaW5nIGxvY2FsIHN0b3JhZ2Ugb3IgZGVmYXVsdFwiKTtcbiAgICB9XG59O1xuXG5XaW5kb3cucHJvdG90eXBlLnNhdmVVc2VybmFtZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB1c2VybmFtZSA9IHRoaXMuZWxlLnF1ZXJ5U2VsZWN0b3IoXCIudXNlck5hbWVcIik7XG4gICAgaWYgKHVzZXJuYW1lLnZhbHVlKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidXNlcm5hbWVcIiwgSlNPTi5zdHJpbmdpZnkodXNlcm5hbWUudmFsdWUpKTtcbiAgICB9XG59O1xuXG5XaW5kb3cucHJvdG90eXBlLnNldFBsYWNlaG9sZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5lbGUucXVlcnlTZWxlY3RvcihcIi51c2VyTmFtZVwiKS5wbGFjZWhvbGRlciA9IHRoaXMudXNlcm5hbWU7XG59O1xuXG5XaW5kb3cucHJvdG90eXBlLnBvcHVwT3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcG9wdXBcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI292ZXJsYXlcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbn07XG5cbldpbmRvdy5wcm90b3R5cGUucG9wdXBDbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcG9wdXBcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdpbmRvdztcblxuIl19
