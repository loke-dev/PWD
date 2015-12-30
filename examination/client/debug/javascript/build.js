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
};

Desktop.prototype.generate = function() {
    var Menu = new TaskBar();
    Menu.dockBar();
    var initWindow = new Window();
    initWindow.popupClose();

    var dockClearAll = document.querySelector("#clearAllButton");
    dockClearAll.addEventListener("click", function(event) {
    event.preventDefault();
    var Window = new Window();
    Window.popupOpen();

    var popupClose = document.querySelector(".s3-btn-close");
    popupClose.addEventListener("click", function(event) {
        event.preventDefault();
        var Window = new Window();
        Window.popupClose();
    }, false);

    var popupClose2 = document.querySelector(".cancelPopup");
    popupClose2.addEventListener("click", function(event) {
        event.preventDefault();
        var Window = new Window();
        Window.popupClose();
    }, false);

    var popupClear = document.querySelector(".confirmPopup");
    popupClear.addEventListener("click", function(event) {
        event.preventDefault();
        var Window = new Window();
        Window.clearAll();
        Window.popupClose();
    }, false);

}, false);

    var dockMemory = document.querySelector("#memoryButton");

    dockMemory.addEventListener("click", function(event) {
        event.preventDefault();
        var container = document.querySelector("#container");
        var template = document.querySelector("#memoryWindow");
        var temp = document.importNode(template.content, true);
        this.id = "id-" + this.number.toString();
        temp.firstElementChild.setAttribute("id", this.id);
        container.appendChild(temp);
        this.ele = document.getElementById(this.id);
        this.number += 1;
        var game = new Memory(4, 4, this.ele);
        game.memory();
        var dragWindow = new Window(this.ele);
        dragWindow.newWindow();
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
    }.bind(this), false);

    var dockExplorer = document.querySelector("#explorerButton");

    dockExplorer.addEventListener("click", function(event) {
        event.preventDefault();
        var bsod = document.querySelector(".bsod");
        bsod.classList.remove("hidden");
        window.addEventListener("keypress", function() {
            bsod.classList.add("hidden");
        }, false);
    }, false);

};

module.exports = Desktop;

},{"./Memory":3,"./taskbar":5,"./window":6}],3:[function(require,module,exports){
"use strict";

/**
 * Memory constructor
 * @param rows - The amount of rows
 * @param cols - The amount of columns
 * @param ele - Current element
 * @constructor
 */
var Memory = function(rows, cols, ele) {
    this.rows = rows;
    this.cols = cols;
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

Window.prototype.newWindow = function() {
    var element = this.ele;
    console.log(element);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvRGVza3RvcC5qcyIsImNsaWVudC9zb3VyY2UvanMvTWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiLCJjbGllbnQvc291cmNlL2pzL3Rhc2tiYXIuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQ2hhdCA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBlbGVtZW50KSB7XG4gICAgdGhpcy5jaGF0Qm94ID0gXCJcIjtcbiAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL3Zob3N0My5sbnUuc2U6MjAwODAvc29ja2V0L1wiKTtcbiAgICB0aGlzLnVzZXJuYW1lID0gdXNlcm5hbWUgfHwgXCJMb2tlXCI7XG4gICAgdGhpcy5jaGFubmVsID0gXCJcIjtcbiAgICB0aGlzLmtleSA9IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIjtcbiAgICB0aGlzLmRhdGEgPSB7fTtcbiAgICB0aGlzLm1lc3NhZ2UgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy50ZXh0QXJlYSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xufTtcblxuLyoqXG4gKlxuICovXG5DaGF0LnByb3RvdHlwZS5zZXJ2ZXIgPSBmdW5jdGlvbigpIHtcblxuICAgIC8vRXZlbnRMaXN0ZW5lciBmb3Igd2hlbiBjb21tdW5pY2F0aW9uIGlzIG9wZW5cbiAgICB0aGlzLnNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbmRDaGF0ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2VuZENoYXRcIik7XG4gICAgICAgIHNlbmRDaGF0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuc2VuZCgpO1xuICAgICAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcblxuICAgICAgICB2YXIgZW50ZXJDaGF0ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2hhdEJveFwiKTtcbiAgICAgICAgZW50ZXJDaGF0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0gZS53aGljaCB8fCBlLmtleUNvZGU7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAxMykgeyAvLyAxMyBpcyBlbnRlclxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5zb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgaWYgKHRoaXMubWVzc2FnZS5kYXRhICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLm1lc3NhZ2UudXNlcm5hbWUgKyBcIjogXCIgKyB0aGlzLm1lc3NhZ2UuZGF0YSk7XG4gICAgICAgICAgICB2YXIgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgICAgICBsaS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGlzLm1lc3NhZ2UudXNlcm5hbWUgKyBcIjogXCIgKyB0aGlzLm1lc3NhZ2UuZGF0YSkpO1xuICAgICAgICAgICAgdGhpcy50ZXh0QXJlYSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnRleHRBcmVhXCIpO1xuICAgICAgICAgICAgdGhpcy50ZXh0QXJlYS5hcHBlbmRDaGlsZChsaSk7XG5cbiAgICAgICAgICAgIC8vU2Nyb2xscyBkb3duIHdoZW4gbmV3IG1lc3NhZ2UgaXMgYXJyaXZlZFxuICAgICAgICAgICAgdmFyIGNoYXRFbCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnRleHRDb250YWluZXJcIik7XG4gICAgICAgICAgICBjaGF0RWwuc2Nyb2xsVG9wID0gY2hhdEVsLnNjcm9sbEhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cbkNoYXQucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNoYXRCb3ggPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5jaGF0Qm94XCIpO1xuICAgIHRoaXMuZGF0YSA9IHtcbiAgICAgICAgdHlwZTogXCJtZXNzYWdlXCIsXG4gICAgICAgIGRhdGE6IHRoaXMuY2hhdEJveC52YWx1ZSxcbiAgICAgICAgdXNlcm5hbWU6IHRoaXMudXNlcm5hbWUsXG4gICAgICAgIGNoYW5uZWw6IHRoaXMuY2hhbm5lbCxcbiAgICAgICAga2V5OiB0aGlzLmtleVxuICAgIH07XG4gICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGEpKTtcbiAgICB0aGlzLmNoYXRCb3gudmFsdWUgPSBcIlwiO1xuICAgIHRoaXMuY2hhdEJveC5mb2N1cygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaGF0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXaW5kb3cgPSByZXF1aXJlKFwiLi93aW5kb3dcIik7XG52YXIgTWVtb3J5ID0gcmVxdWlyZShcIi4vTWVtb3J5XCIpO1xudmFyIFRhc2tCYXIgPSByZXF1aXJlKFwiLi90YXNrYmFyXCIpO1xuXG52YXIgRGVza3RvcCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZWxlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuaWQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5udW1iZXIgPSAwO1xuICAgIHRoaXMudXNlcm5hbWUgPSB1bmRlZmluZWQ7XG59O1xuXG5EZXNrdG9wLnByb3RvdHlwZS5nZW5lcmF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBNZW51ID0gbmV3IFRhc2tCYXIoKTtcbiAgICBNZW51LmRvY2tCYXIoKTtcbiAgICB2YXIgaW5pdFdpbmRvdyA9IG5ldyBXaW5kb3coKTtcbiAgICBpbml0V2luZG93LnBvcHVwQ2xvc2UoKTtcblxuICAgIHZhciBkb2NrQ2xlYXJBbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NsZWFyQWxsQnV0dG9uXCIpO1xuICAgIGRvY2tDbGVhckFsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBXaW5kb3cgPSBuZXcgV2luZG93KCk7XG4gICAgV2luZG93LnBvcHVwT3BlbigpO1xuXG4gICAgdmFyIHBvcHVwQ2xvc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnMzLWJ0bi1jbG9zZVwiKTtcbiAgICBwb3B1cENsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgV2luZG93ID0gbmV3IFdpbmRvdygpO1xuICAgICAgICBXaW5kb3cucG9wdXBDbG9zZSgpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHZhciBwb3B1cENsb3NlMiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2FuY2VsUG9wdXBcIik7XG4gICAgcG9wdXBDbG9zZTIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBXaW5kb3cgPSBuZXcgV2luZG93KCk7XG4gICAgICAgIFdpbmRvdy5wb3B1cENsb3NlKCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgdmFyIHBvcHVwQ2xlYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbmZpcm1Qb3B1cFwiKTtcbiAgICBwb3B1cENsZWFyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgV2luZG93ID0gbmV3IFdpbmRvdygpO1xuICAgICAgICBXaW5kb3cuY2xlYXJBbGwoKTtcbiAgICAgICAgV2luZG93LnBvcHVwQ2xvc2UoKTtcbiAgICB9LCBmYWxzZSk7XG5cbn0sIGZhbHNlKTtcblxuICAgIHZhciBkb2NrTWVtb3J5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlCdXR0b25cIik7XG5cbiAgICBkb2NrTWVtb3J5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250YWluZXJcIik7XG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5V2luZG93XCIpO1xuICAgICAgICB2YXIgdGVtcCA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuaWQgPSBcImlkLVwiICsgdGhpcy5udW1iZXIudG9TdHJpbmcoKTtcbiAgICAgICAgdGVtcC5maXJzdEVsZW1lbnRDaGlsZC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0aGlzLmlkKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRlbXApO1xuICAgICAgICB0aGlzLmVsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWQpO1xuICAgICAgICB0aGlzLm51bWJlciArPSAxO1xuICAgICAgICB2YXIgZ2FtZSA9IG5ldyBNZW1vcnkoNCwgNCwgdGhpcy5lbGUpO1xuICAgICAgICBnYW1lLm1lbW9yeSgpO1xuICAgICAgICB2YXIgZHJhZ1dpbmRvdyA9IG5ldyBXaW5kb3codGhpcy5lbGUpO1xuICAgICAgICBkcmFnV2luZG93Lm5ld1dpbmRvdygpO1xuICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gICAgdmFyIGRvY2tDaGF0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjaGF0QnV0dG9uXCIpO1xuXG4gICAgZG9ja0NoYXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRhaW5lclwiKTtcbiAgICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNpbml0aWFsQ2hhdFwiKTtcbiAgICAgICAgdmFyIHRlbXAgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICB0aGlzLmlkID0gXCJpZC1cIiArIHRoaXMubnVtYmVyLnRvU3RyaW5nKCk7XG4gICAgICAgIHRlbXAuZmlyc3RFbGVtZW50Q2hpbGQuc2V0QXR0cmlidXRlKFwiaWRcIiwgdGhpcy5pZCk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ZW1wKTtcbiAgICAgICAgdGhpcy5lbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkKTtcbiAgICAgICAgdGhpcy5udW1iZXIgKz0gMTtcbiAgICAgICAgdmFyIGRyYWdXaW5kb3cgPSBuZXcgV2luZG93KHRoaXMuZWxlKTtcbiAgICAgICAgZHJhZ1dpbmRvdy5uZXdXaW5kb3coKTtcbiAgICAgICAgZHJhZ1dpbmRvdy5nZW5DaGF0KCk7XG4gICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgICB2YXIgZG9ja0V4cGxvcmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNleHBsb3JlckJ1dHRvblwiKTtcblxuICAgIGRvY2tFeHBsb3Jlci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIGJzb2QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJzb2RcIik7XG4gICAgICAgIGJzb2QuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGJzb2QuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgIH0sIGZhbHNlKTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZXNrdG9wO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogTWVtb3J5IGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0gcm93cyAtIFRoZSBhbW91bnQgb2Ygcm93c1xuICogQHBhcmFtIGNvbHMgLSBUaGUgYW1vdW50IG9mIGNvbHVtbnNcbiAqIEBwYXJhbSBlbGUgLSBDdXJyZW50IGVsZW1lbnRcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgTWVtb3J5ID0gZnVuY3Rpb24ocm93cywgY29scywgZWxlKSB7XG4gICAgdGhpcy5yb3dzID0gcm93cztcbiAgICB0aGlzLmNvbHMgPSBjb2xzO1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZTtcbiAgICB0aGlzLmFyciA9IFtdO1xuICAgIHRoaXMudHVybjEgPSBcIlwiO1xuICAgIHRoaXMudHVybjIgPSBcIlwiO1xuICAgIHRoaXMubGFzdFRpbGUgPSBcIlwiO1xuICAgIHRoaXMudHJpZXMgPSAwO1xuICAgIHRoaXMucGFpcnMgPSAwO1xufTtcblxuLyoqXG4gKiBFdmVudGxpc3RlbmVyIGZvciB0aGUgc3RhcnQgYnV0dG9uXG4gKi9cbk1lbW9yeS5wcm90b3R5cGUubWVtb3J5ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG1lbW9yeUJ1dHRvbiA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnN0YXJ0TWVtb3J5XCIpO1xuICAgIG1lbW9yeUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5zdGFydEdhbWUoKTtcbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcbn07XG5cbi8qKlxuICogU3RhcnRpbmcgcG9pbnQgb2YgdGhlIGdhbWVcbiAqL1xuTWVtb3J5LnByb3RvdHlwZS5zdGFydEdhbWUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNsZWFyKCk7XG4gICAgdGhpcy5jcmVhdGVBcnJheSgpO1xuICAgIHRoaXMuY3JlYXRlQm9hcmQoKTtcbn07XG5cbi8qKlxuICogQ2xlYXIgdGhlIG1lbW9yeSBwbGF5IGFyZWEgYW5kIHZhcmlhYmxlcyB0aGF0IHNhdmVzIGEgdmFsdWVcbiAqL1xuTWVtb3J5LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeUNvbnRhaW5lclwiKTtcbiAgICBpZiAoZWwpIHtcbiAgICAgICAgd2hpbGUgKGVsLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgZWwucmVtb3ZlQ2hpbGQoZWwubGFzdENoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYXJyID0gW107XG4gICAgdGhpcy50dXJuMSA9IFwiXCI7XG4gICAgdGhpcy50dXJuMiA9IFwiXCI7XG4gICAgdGhpcy5sYXN0VGlsZSA9IFwiXCI7XG4gICAgdGhpcy50cmllcyA9IDA7XG4gICAgdGhpcy5wYWlycyA9IDA7XG59O1xuXG4vKipcbiAqIER5bmFtaWNhbGx5IGNyZWF0ZXMgdGhlIGJvYXJkXG4gKi9cbk1lbW9yeS5wcm90b3R5cGUuY3JlYXRlQm9hcmQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29udGFpbmVyID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5Q29udGFpbmVyXCIpO1xuICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjbWVtb3J5VGVtcGxhdGVcIilbMF0uY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICB2YXIgYTtcblxuICAgIHRoaXMuYXJyLmZvckVhY2goZnVuY3Rpb24odGlsZSwgaW5kZXgpIHtcbiAgICAgICAgYSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUsIHRydWUpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYSk7XG4gICAgICAgIGlmICgoaW5kZXggKyAxKSAlIHRoaXMuY29scyA9PT0gMCkge1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJiclwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICBhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBpbWcgPSBldmVudC50YXJnZXQubm9kZU5hbWUgPT09IFwiSU1HXCIgPyBldmVudC50YXJnZXQgOiBldmVudC50YXJnZXQuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgICAgICB0aGlzLnR1cm5Ccmljayh0aWxlLCBpbmRleCwgaW1nKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxufTtcblxuLyoqXG4gKiBEeW5hbWljYWxseSBjcmVhdGVzIHRoZSBhcnJheSBmb3IgdGhlIHNlbGVjdGlvbiBvZiBpbWFnZXNcbiAqL1xuTWVtb3J5LnByb3RvdHlwZS5jcmVhdGVBcnJheSA9IGZ1bmN0aW9uKCkge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDw9ICgodGhpcy5yb3dzICogdGhpcy5jb2xzKSAvIDIpOyBpICs9IDEpIHtcbiAgICAgICAgdGhpcy5hcnIucHVzaChpKTtcbiAgICAgICAgdGhpcy5hcnIucHVzaChpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zaHVmZmxlKHRoaXMuYXJyKTtcbn07XG5cbk1lbW9yeS5wcm90b3R5cGUudHVybkJyaWNrID0gZnVuY3Rpb24odGlsZSwgaW5kZXgsIGltZykge1xuICAgIGlmICh0aGlzLnR1cm4yKSB7IHJldHVybjsgfVxuXG4gICAgaW1nLnNyYyA9IFwiaW1hZ2UvXCIgKyB0aWxlICsgXCIucG5nXCI7XG5cbiAgICBpZiAoIXRoaXMudHVybjEpIHtcbiAgICAgICAgdGhpcy50dXJuMSA9IGltZztcbiAgICAgICAgdGhpcy5sYXN0VGlsZSA9IHRpbGU7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaW1nID09PSB0aGlzLnR1cm4xKSB7IHJldHVybjsgfVxuXG4gICAgICAgIHRoaXMudHJpZXMgKz0gMTtcblxuICAgICAgICB0aGlzLnR1cm4yID0gaW1nO1xuXG4gICAgICAgIGlmICh0aWxlID09PSB0aGlzLmxhc3RUaWxlKSB7XG4gICAgICAgICAgICB0aGlzLnBhaXJzICs9IDE7XG4gICAgICAgICAgICBpZiAodGhpcy5wYWlycyA9PT0gKHRoaXMuY29scyAqIHRoaXMucm93cykgLyAyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVsID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5Q29udGFpbmVyXCIpO1xuICAgICAgICAgICAgICAgIGlmIChlbCkge1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoZWwuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5yZW1vdmVDaGlsZChlbC5sYXN0Q2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy53aW4oKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIldvbiBvbiBcIiArIHRoaXMudHJpZXMgKyBcIiBudW1iZXIgb2YgdHJpZXMhXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4xLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZChcInJlbW92ZWRcIik7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMi5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoXCJyZW1vdmVkXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjEgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjIgPSBudWxsO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCAzMDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMS5zcmMgPSBcImltYWdlLzAucG5nXCI7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMi5zcmMgPSBcImltYWdlLzAucG5nXCI7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMiA9IG51bGw7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIDUwMCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIFRoaXMgcHJvdG90eXBlIGhhbmRsZXMgdGhlIHNodWZmbGluZyBvZiB0aGUgZGVja1xuICogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNDUwOTU0L2hvdy10by1yYW5kb21pemUtc2h1ZmZsZS1hLWphdmFzY3JpcHQtYXJyYXlcbiAqIEBwYXJhbSBpbmRleEFyciAtIHRoZSBhcnJheSB0byBiZSBzaHVmZmxlZFxuICogQHJldHVybnMgeyp9XG4gKi9cbk1lbW9yeS5wcm90b3R5cGUuc2h1ZmZsZSA9IGZ1bmN0aW9uKGluZGV4QXJyKSB7XG4gICAgdmFyIGFycmF5ID0gaW5kZXhBcnI7XG4gICAgdmFyIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aDtcbiAgICB2YXIgdGVtcG9yYXJ5VmFsdWU7XG4gICAgdmFyIHJhbmRvbUluZGV4O1xuXG4gICAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xuXG4gICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcbiAgICAgICAgY3VycmVudEluZGV4IC09IDE7XG5cbiAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xuICAgICAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xuICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG5cbn07XG5cbk1lbW9yeS5wcm90b3R5cGUud2luID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeUNvbnRhaW5lclwiKTtcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI21lbW9yeVdpblwiKVswXS5jb250ZW50O1xuICAgIHZhciBhID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZSwgdHJ1ZSk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGEpO1xuXG4gICAgdmFyIG1lbW9yeVdpblRyaWVzID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5V2luVHJpZXNcIik7XG4gICAgdmFyIGIgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIldvbiBvbiBcIiArIHRoaXMudHJpZXMgKyBcIiBudW1iZXIgb2YgdHJpZXMhXCIpO1xuICAgIG1lbW9yeVdpblRyaWVzLmFwcGVuZENoaWxkKGIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZW1vcnk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERlc2t0b3AgPSByZXF1aXJlKFwiLi9EZXNrdG9wXCIpO1xudmFyIGRlc2t0b3AgPSBuZXcgRGVza3RvcCgpO1xuZGVza3RvcC5nZW5lcmF0ZSgpO1xuXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBUYXNrQmFyID0gZnVuY3Rpb24oKSB7XHJcbn07XHJcblxyXG4vKipcclxuICpcclxuICovXHJcblRhc2tCYXIucHJvdG90eXBlLmRvY2tCYXIgPSBmdW5jdGlvbigpIHtcclxuICAgIGZ1bmN0aW9uIGFkZFByZXZDbGFzcyhlKSB7XHJcbiAgICAgICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0O1xyXG4gICAgICAgIGlmICh0YXJnZXQuZ2V0QXR0cmlidXRlKFwic3JjXCIpKSB7XHJcbiAgICAgICAgICAgIHZhciBsaSA9IHRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGU7XHJcbiAgICAgICAgICAgIHZhciBwcmV2TGkgPSBsaS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgICBpZiAocHJldkxpKSB7XHJcbiAgICAgICAgICAgICAgICBwcmV2TGkuY2xhc3NOYW1lID0gXCJwcmV2XCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJldkxpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldkxpLnJlbW92ZUF0dHJpYnV0ZShcImNsYXNzXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHByZXZMaTIgPSB0YXJnZXQucHJldmlvdXNFbGVtZW50U2libGluZztcclxuICAgICAgICAgICAgaWYgKHByZXZMaTIpIHtcclxuICAgICAgICAgICAgICAgIHByZXZMaTIuY2xhc3NOYW1lID0gXCJwcmV2XCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJldkxpMikge1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZMaTIucmVtb3ZlQXR0cmlidXRlKFwiY2xhc3NcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkb2NrXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgYWRkUHJldkNsYXNzLCBmYWxzZSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRhc2tCYXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQ2hhdCA9IHJlcXVpcmUoXCIuL0NoYXRcIik7XG5cbi8qKlxuICogTW92ZSBmdW5jdGlvbiBiYXNlZCBvZiB0aGlzIHNvdXJjZSBcImh0dHA6Ly9jb2RlcGVuLmlvL3RoZWJhYnlkaW5vL3Blbi9BZmFtc1wiLlxuICovXG52YXIgV2luZG93ID0gZnVuY3Rpb24oZWxlKSB7XG4gICAgdGhpcy5lbGUgPSBlbGU7XG4gICAgdGhpcy51c2VybmFtZSA9IHVuZGVmaW5lZDtcbn07XG5cbldpbmRvdy5wcm90b3R5cGUubmV3V2luZG93ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGVsZW1lbnQgPSB0aGlzLmVsZTtcbiAgICBjb25zb2xlLmxvZyhlbGVtZW50KTtcbiAgICB2YXIgcDEgPSB7XG4gICAgICAgIHg6IHBhcnNlSW50KGVsZW1lbnQuZGF0YXNldC54LCAxMCksXG4gICAgICAgIHk6IHBhcnNlSW50KGVsZW1lbnQuZGF0YXNldC55LCAxMClcbiAgICB9O1xuICAgIHZhciBwMCA9IHtcbiAgICAgICAgeDogcGFyc2VJbnQoZWxlbWVudC5kYXRhc2V0LngsIDEwKSxcbiAgICAgICAgeTogcGFyc2VJbnQoZWxlbWVudC5kYXRhc2V0LnksIDEwKVxuICAgIH07XG4gICAgdmFyIGNvb3JkcyA9IHtcbiAgICAgICAgeDogcGFyc2VJbnQoZWxlbWVudC5kYXRhc2V0LngsIDEwKSxcbiAgICAgICAgeTogcGFyc2VJbnQoZWxlbWVudC5kYXRhc2V0LnksIDEwKVxuICAgIH07XG4gICAgdmFyIGZsYWc7XG5cbiAgICB2YXIgZHJhZyA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgcDEgPSB7eDogZS5jbGllbnRYLCB5OiBlLmNsaWVudFl9O1xuXG4gICAgICAgIGVsZW1lbnQuZGF0YXNldC54ID0gY29vcmRzLnggKyBwMS54IC0gcDAueDtcbiAgICAgICAgZWxlbWVudC5kYXRhc2V0LnkgPSBjb29yZHMueSArIHAxLnkgLSBwMC55O1xuXG4gICAgICAgIGVsZW1lbnQuc3R5bGVbXCItd2Via2l0LXRyYW5zZm9ybVwiXSA9XG4gICAgICAgICAgICBcInRyYW5zbGF0ZShcIiArIGVsZW1lbnQuZGF0YXNldC54ICsgXCJweCwgXCIgKyBlbGVtZW50LmRhdGFzZXQueSArIFwicHgpXCI7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID1cbiAgICAgICAgICAgIFwidHJhbnNsYXRlKFwiICsgZWxlbWVudC5kYXRhc2V0LnggKyBcInB4LCBcIiArIGVsZW1lbnQuZGF0YXNldC55ICsgXCJweClcIjtcbiAgICB9O1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgdCA9IGUudGFyZ2V0O1xuXG4gICAgICAgIGlmICh0ID09PSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoMVwiKSkge1xuICAgICAgICAgICAgcDAgPSB7eDogZS5jbGllbnRYLCB5OiBlLmNsaWVudFl9O1xuICAgICAgICAgICAgZmxhZyA9IHRydWU7XG5cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGRyYWcsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZsYWcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZmxhZykge1xuICAgICAgICAgICAgY29vcmRzLnggKz0gcDEueCAtIHAwLng7XG4gICAgICAgICAgICBjb29yZHMueSArPSBwMS55IC0gcDAueTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGRyYWcsIGZhbHNlKTtcbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcbn07XG5cbldpbmRvdy5wcm90b3R5cGUuY2xlYXJBbGwgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRhaW5lclwiKTtcbiAgICBpZiAoZWwpIHtcbiAgICAgICAgd2hpbGUgKGVsLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgZWwucmVtb3ZlQ2hpbGQoZWwubGFzdENoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbldpbmRvdy5wcm90b3R5cGUuY2xlYXJXaW5kb3cgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgdmFyIGVsID0gZWxlbWVudDtcbiAgICBpZiAoZWwpIHtcbiAgICAgICAgd2hpbGUgKGVsLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgZWwucmVtb3ZlQ2hpbGQoZWwubGFzdENoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbldpbmRvdy5wcm90b3R5cGUuZ2VuQ2hhdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbml0Q2hhdCA9IHRoaXMuZWxlLnF1ZXJ5U2VsZWN0b3IoXCIuYnV0dG9uXCIpO1xuICAgIGluaXRDaGF0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLnNldFVzZXJuYW1lKCk7XG4gICAgICAgIHRoaXMuc2V0UGxhY2Vob2xkZXIoKTtcbiAgICAgICAgdGhpcy5jaGF0RnVuYygpO1xuICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gICAgdmFyIGluaXRDaGF0RW50ZXIgPSB0aGlzLmVsZS5xdWVyeVNlbGVjdG9yKFwiLnVzZXJOYW1lXCIpO1xuICAgIGluaXRDaGF0RW50ZXIuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIGtleSA9IGUud2hpY2ggfHwgZS5rZXlDb2RlO1xuICAgICAgICBpZiAoa2V5ID09PSAxMykgeyAvLyAxMyBpcyBlbnRlclxuICAgICAgICAgICAgdGhpcy5zZXRVc2VybmFtZSgpO1xuICAgICAgICAgICAgdGhpcy5zZXRQbGFjZWhvbGRlcigpO1xuICAgICAgICAgICAgdGhpcy5jaGF0RnVuYygpO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG59O1xuXG5XaW5kb3cucHJvdG90eXBlLmNoYXRGdW5jID0gZnVuY3Rpb24oKSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB2YXIgd2luZG93Q29udGFpbmVyID0gdGhpcy5lbGUucXVlcnlTZWxlY3RvcihcIi53aW5kb3dDb250YWluZXJcIik7XG4gICAgdmFyIGNoYXRUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhdFdpbmRvd1wiKTtcbiAgICB2YXIgdGVtcFdpbmRvdyA9IGRvY3VtZW50LmltcG9ydE5vZGUoY2hhdFRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgIHRoaXMuY2xlYXJXaW5kb3cod2luZG93Q29udGFpbmVyKTtcbiAgICB3aW5kb3dDb250YWluZXIuYXBwZW5kQ2hpbGQodGVtcFdpbmRvdyk7XG4gICAgdmFyIE15Q2hhdCA9IG5ldyBDaGF0KHRoaXMudXNlcm5hbWUsIHRoaXMuZWxlKTtcbiAgICBNeUNoYXQuc2VydmVyKCk7XG4gICAgdGhpcy5lbGUucXVlcnlTZWxlY3RvcihcIi5jaGF0Qm94XCIpLmZvY3VzKCk7XG4gICAgdGhpcy5zYXZlVXNlcm5hbWUoKTtcbn07XG5cbldpbmRvdy5wcm90b3R5cGUuc2V0VXNlcm5hbWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbG9jYWxVc2VyO1xuICAgIHZhciB1c2VybmFtZSA9IHRoaXMuZWxlLnF1ZXJ5U2VsZWN0b3IoXCIudXNlck5hbWVcIikudmFsdWU7XG5cbiAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ1c2VybmFtZVwiKSAhPT0gbnVsbCkge1xuICAgICAgICBsb2NhbFVzZXIgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidXNlcm5hbWVcIikpO1xuICAgIH1cblxuICAgIGlmICh1c2VybmFtZSkge1xuICAgICAgICB0aGlzLnVzZXJuYW1lID0gdXNlcm5hbWU7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidXNpbmcgdGV4dCBmaWVsZFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnVzZXJuYW1lID0gbG9jYWxVc2VyIHx8IFwiTG9rZVwiO1xuICAgICAgICBjb25zb2xlLmxvZyhcInVzaW5nIGxvY2FsIHN0b3JhZ2Ugb3IgZGVmYXVsdFwiKTtcbiAgICB9XG59O1xuXG5XaW5kb3cucHJvdG90eXBlLnNhdmVVc2VybmFtZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB1c2VybmFtZSA9IHRoaXMuZWxlLnF1ZXJ5U2VsZWN0b3IoXCIudXNlck5hbWVcIik7XG4gICAgaWYgKHVzZXJuYW1lLnZhbHVlKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidXNlcm5hbWVcIiwgSlNPTi5zdHJpbmdpZnkodXNlcm5hbWUudmFsdWUpKTtcbiAgICB9XG59O1xuXG5XaW5kb3cucHJvdG90eXBlLnNldFBsYWNlaG9sZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5lbGUucXVlcnlTZWxlY3RvcihcIi51c2VyTmFtZVwiKS5wbGFjZWhvbGRlciA9IHRoaXMudXNlcm5hbWU7XG59O1xuXG5XaW5kb3cucHJvdG90eXBlLnBvcHVwT3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcG9wdXBcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI292ZXJsYXlcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbn07XG5cbldpbmRvdy5wcm90b3R5cGUucG9wdXBDbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcG9wdXBcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdpbmRvdztcblxuIl19
