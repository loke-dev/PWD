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
var Chat = require("./Chat");

var Menu = new TaskBar();
Menu.dockBar();

var initWindow = new Window();
initWindow.popupClose();

var Desktop = function() {
    this.ele = undefined;
    this.id = undefined;
    this.number = 0;
};

Desktop.prototype.generate = function() {
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
        var template = document.querySelector("#chatWindow");
        var temp = document.importNode(template.content, true);
        this.id = "id-" + this.number.toString();
        temp.firstElementChild.setAttribute("id", this.id);
        container.appendChild(temp);
        this.ele = document.getElementById(this.id);
        this.number += 1;
        var MyChat = new Chat("Loke!", this.ele);
        MyChat.server();
        var dragWindow = new Window(this.ele);
        dragWindow.newWindow();

    }.bind(this), false);
};

module.exports = Desktop;

},{"./Chat":1,"./Memory":3,"./taskbar":5,"./window":6}],3:[function(require,module,exports){
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

/**
 * Move function based of this source "http://codepen.io/thebabydino/pen/Afams".
 */
var Window = function(ele) {
    this.ele = ele;
};

Window.prototype.newWindow = function() {
    var point = this.ele;
    var p1 = {
        x: parseInt(point.dataset.x, 10),
        y: parseInt(point.dataset.y, 10)
    };
    var p0 = {
        x: parseInt(point.dataset.x, 10),
        y: parseInt(point.dataset.y, 10)
    };
    var coords = {
        x: parseInt(point.dataset.x, 10),
        y: parseInt(point.dataset.y, 10)
    };
    var flag;

    var drag = function(e) {
        p1 = {x: e.clientX, y: e.clientY};

        point.dataset.x = coords.x + p1.x - p0.x;
        point.dataset.y = coords.y + p1.y - p0.y;

        point.style["-webkit-transform"] =
            "translate(" + point.dataset.x + "px, " + point.dataset.y + "px)";
        point.style.transform =
            "translate(" + point.dataset.x + "px, " + point.dataset.y + "px)";
    };

    window.addEventListener("mousedown", function(e) {
        var t = e.target;

        if (t === point) {
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

Window.prototype.genChat = function() {

};

Window.prototype.clearAll = function() {
    var el = document.querySelector("#container");
    if (el) {
        while (el.hasChildNodes()) {
            el.removeChild(el.lastChild);
        }
    }
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


},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvRGVza3RvcC5qcyIsImNsaWVudC9zb3VyY2UvanMvTWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiLCJjbGllbnQvc291cmNlL2pzL3Rhc2tiYXIuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIENoYXQgPSBmdW5jdGlvbih1c2VybmFtZSwgZWxlbWVudCkge1xuICAgIHRoaXMuY2hhdEJveCA9IFwiXCI7XG4gICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KFwid3M6Ly92aG9zdDMubG51LnNlOjIwMDgwL3NvY2tldC9cIik7XG4gICAgdGhpcy51c2VybmFtZSA9IHVzZXJuYW1lIHx8IFwiTG9rZVwiO1xuICAgIHRoaXMuY2hhbm5lbCA9IFwiXCI7XG4gICAgdGhpcy5rZXkgPSBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCI7XG4gICAgdGhpcy5kYXRhID0ge307XG4gICAgdGhpcy5tZXNzYWdlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMudGV4dEFyZWEgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbn07XG5cbi8qKlxuICpcbiAqL1xuQ2hhdC5wcm90b3R5cGUuc2VydmVyID0gZnVuY3Rpb24oKSB7XG5cbiAgICAvL0V2ZW50TGlzdGVuZXIgZm9yIHdoZW4gY29tbXVuaWNhdGlvbiBpcyBvcGVuXG4gICAgdGhpcy5zb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZW5kQ2hhdCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnNlbmRDaGF0XCIpO1xuICAgICAgICBzZW5kQ2hhdC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLnNlbmQoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgICAgICAgdmFyIGVudGVyQ2hhdCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmNoYXRCb3hcIik7XG4gICAgICAgIGVudGVyQ2hhdC5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgdmFyIGtleSA9IGUud2hpY2ggfHwgZS5rZXlDb2RlO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gMTMpIHsgLy8gMTMgaXMgZW50ZXJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgIGlmICh0aGlzLm1lc3NhZ2UuZGF0YSAhPT0gXCJcIikge1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5tZXNzYWdlLnVzZXJuYW1lICsgXCI6IFwiICsgdGhpcy5tZXNzYWdlLmRhdGEpO1xuICAgICAgICAgICAgdmFyIGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgICAgICAgICAgbGkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGhpcy5tZXNzYWdlLnVzZXJuYW1lICsgXCI6IFwiICsgdGhpcy5tZXNzYWdlLmRhdGEpKTtcbiAgICAgICAgICAgIHRoaXMudGV4dEFyZWEgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi50ZXh0QXJlYVwiKTtcbiAgICAgICAgICAgIHRoaXMudGV4dEFyZWEuYXBwZW5kQ2hpbGQobGkpO1xuXG4gICAgICAgICAgICAvL1Njcm9sbHMgZG93biB3aGVuIG5ldyBtZXNzYWdlIGlzIGFycml2ZWRcbiAgICAgICAgICAgIHZhciBjaGF0RWwgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi50ZXh0Q29udGFpbmVyXCIpO1xuICAgICAgICAgICAgY2hhdEVsLnNjcm9sbFRvcCA9IGNoYXRFbC5zY3JvbGxIZWlnaHQ7XG4gICAgICAgIH1cblxuICAgIH0uYmluZCh0aGlzKSk7XG59O1xuXG5DaGF0LnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5jaGF0Qm94ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2hhdEJveFwiKTtcbiAgICB0aGlzLmRhdGEgPSB7XG4gICAgICAgIHR5cGU6IFwibWVzc2FnZVwiLFxuICAgICAgICBkYXRhOiB0aGlzLmNoYXRCb3gudmFsdWUsXG4gICAgICAgIHVzZXJuYW1lOiB0aGlzLnVzZXJuYW1lLFxuICAgICAgICBjaGFubmVsOiB0aGlzLmNoYW5uZWwsXG4gICAgICAgIGtleTogdGhpcy5rZXlcbiAgICB9O1xuICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhKSk7XG4gICAgdGhpcy5jaGF0Qm94LnZhbHVlID0gXCJcIjtcbiAgICB0aGlzLmNoYXRCb3guZm9jdXMoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hhdDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV2luZG93ID0gcmVxdWlyZShcIi4vd2luZG93XCIpO1xudmFyIE1lbW9yeSA9IHJlcXVpcmUoXCIuL01lbW9yeVwiKTtcbnZhciBUYXNrQmFyID0gcmVxdWlyZShcIi4vdGFza2JhclwiKTtcbnZhciBDaGF0ID0gcmVxdWlyZShcIi4vQ2hhdFwiKTtcblxudmFyIE1lbnUgPSBuZXcgVGFza0JhcigpO1xuTWVudS5kb2NrQmFyKCk7XG5cbnZhciBpbml0V2luZG93ID0gbmV3IFdpbmRvdygpO1xuaW5pdFdpbmRvdy5wb3B1cENsb3NlKCk7XG5cbnZhciBEZXNrdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5lbGUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5pZCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLm51bWJlciA9IDA7XG59O1xuXG5EZXNrdG9wLnByb3RvdHlwZS5nZW5lcmF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkb2NrQ2xlYXJBbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NsZWFyQWxsQnV0dG9uXCIpO1xuICAgIGRvY2tDbGVhckFsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBXaW5kb3cgPSBuZXcgV2luZG93KCk7XG4gICAgV2luZG93LnBvcHVwT3BlbigpO1xuXG4gICAgdmFyIHBvcHVwQ2xvc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnMzLWJ0bi1jbG9zZVwiKTtcbiAgICBwb3B1cENsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgV2luZG93ID0gbmV3IFdpbmRvdygpO1xuICAgICAgICBXaW5kb3cucG9wdXBDbG9zZSgpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHZhciBwb3B1cENsb3NlMiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2FuY2VsUG9wdXBcIik7XG4gICAgcG9wdXBDbG9zZTIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBXaW5kb3cgPSBuZXcgV2luZG93KCk7XG4gICAgICAgIFdpbmRvdy5wb3B1cENsb3NlKCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgdmFyIHBvcHVwQ2xlYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbmZpcm1Qb3B1cFwiKTtcbiAgICBwb3B1cENsZWFyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgV2luZG93ID0gbmV3IFdpbmRvdygpO1xuICAgICAgICBXaW5kb3cuY2xlYXJBbGwoKTtcbiAgICAgICAgV2luZG93LnBvcHVwQ2xvc2UoKTtcbiAgICB9LCBmYWxzZSk7XG5cbn0sIGZhbHNlKTtcblxuICAgIHZhciBkb2NrTWVtb3J5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlCdXR0b25cIik7XG5cbiAgICBkb2NrTWVtb3J5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250YWluZXJcIik7XG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5V2luZG93XCIpO1xuICAgICAgICB2YXIgdGVtcCA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuaWQgPSBcImlkLVwiICsgdGhpcy5udW1iZXIudG9TdHJpbmcoKTtcbiAgICAgICAgdGVtcC5maXJzdEVsZW1lbnRDaGlsZC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0aGlzLmlkKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRlbXApO1xuICAgICAgICB0aGlzLmVsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWQpO1xuICAgICAgICB0aGlzLm51bWJlciArPSAxO1xuICAgICAgICB2YXIgZ2FtZSA9IG5ldyBNZW1vcnkoNCwgNCwgdGhpcy5lbGUpO1xuICAgICAgICBnYW1lLm1lbW9yeSgpO1xuICAgICAgICB2YXIgZHJhZ1dpbmRvdyA9IG5ldyBXaW5kb3codGhpcy5lbGUpO1xuICAgICAgICBkcmFnV2luZG93Lm5ld1dpbmRvdygpO1xuICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gICAgdmFyIGRvY2tDaGF0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjaGF0QnV0dG9uXCIpO1xuXG4gICAgZG9ja0NoYXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRhaW5lclwiKTtcbiAgICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjaGF0V2luZG93XCIpO1xuICAgICAgICB2YXIgdGVtcCA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuaWQgPSBcImlkLVwiICsgdGhpcy5udW1iZXIudG9TdHJpbmcoKTtcbiAgICAgICAgdGVtcC5maXJzdEVsZW1lbnRDaGlsZC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0aGlzLmlkKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRlbXApO1xuICAgICAgICB0aGlzLmVsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWQpO1xuICAgICAgICB0aGlzLm51bWJlciArPSAxO1xuICAgICAgICB2YXIgTXlDaGF0ID0gbmV3IENoYXQoXCJMb2tlIVwiLCB0aGlzLmVsZSk7XG4gICAgICAgIE15Q2hhdC5zZXJ2ZXIoKTtcbiAgICAgICAgdmFyIGRyYWdXaW5kb3cgPSBuZXcgV2luZG93KHRoaXMuZWxlKTtcbiAgICAgICAgZHJhZ1dpbmRvdy5uZXdXaW5kb3coKTtcblxuICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZXNrdG9wO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogTWVtb3J5IGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0gcm93cyAtIFRoZSBhbW91bnQgb2Ygcm93c1xuICogQHBhcmFtIGNvbHMgLSBUaGUgYW1vdW50IG9mIGNvbHVtbnNcbiAqIEBwYXJhbSBlbGUgLSBDdXJyZW50IGVsZW1lbnRcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgTWVtb3J5ID0gZnVuY3Rpb24ocm93cywgY29scywgZWxlKSB7XG4gICAgdGhpcy5yb3dzID0gcm93cztcbiAgICB0aGlzLmNvbHMgPSBjb2xzO1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZTtcbiAgICB0aGlzLmFyciA9IFtdO1xuICAgIHRoaXMudHVybjEgPSBcIlwiO1xuICAgIHRoaXMudHVybjIgPSBcIlwiO1xuICAgIHRoaXMubGFzdFRpbGUgPSBcIlwiO1xuICAgIHRoaXMudHJpZXMgPSAwO1xuICAgIHRoaXMucGFpcnMgPSAwO1xufTtcblxuLyoqXG4gKiBFdmVudGxpc3RlbmVyIGZvciB0aGUgc3RhcnQgYnV0dG9uXG4gKi9cbk1lbW9yeS5wcm90b3R5cGUubWVtb3J5ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG1lbW9yeUJ1dHRvbiA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnN0YXJ0TWVtb3J5XCIpO1xuICAgIG1lbW9yeUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5zdGFydEdhbWUoKTtcbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcbn07XG5cbi8qKlxuICogU3RhcnRpbmcgcG9pbnQgb2YgdGhlIGdhbWVcbiAqL1xuTWVtb3J5LnByb3RvdHlwZS5zdGFydEdhbWUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNsZWFyKCk7XG4gICAgdGhpcy5jcmVhdGVBcnJheSgpO1xuICAgIHRoaXMuY3JlYXRlQm9hcmQoKTtcbn07XG5cbi8qKlxuICogQ2xlYXIgdGhlIG1lbW9yeSBwbGF5IGFyZWEgYW5kIHZhcmlhYmxlcyB0aGF0IHNhdmVzIGEgdmFsdWVcbiAqL1xuTWVtb3J5LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeUNvbnRhaW5lclwiKTtcbiAgICBpZiAoZWwpIHtcbiAgICAgICAgd2hpbGUgKGVsLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgZWwucmVtb3ZlQ2hpbGQoZWwubGFzdENoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYXJyID0gW107XG4gICAgdGhpcy50dXJuMSA9IFwiXCI7XG4gICAgdGhpcy50dXJuMiA9IFwiXCI7XG4gICAgdGhpcy5sYXN0VGlsZSA9IFwiXCI7XG4gICAgdGhpcy50cmllcyA9IDA7XG4gICAgdGhpcy5wYWlycyA9IDA7XG59O1xuXG4vKipcbiAqIER5bmFtaWNhbGx5IGNyZWF0ZXMgdGhlIGJvYXJkXG4gKi9cbk1lbW9yeS5wcm90b3R5cGUuY3JlYXRlQm9hcmQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29udGFpbmVyID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5Q29udGFpbmVyXCIpO1xuICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjbWVtb3J5VGVtcGxhdGVcIilbMF0uY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICB2YXIgYTtcblxuICAgIHRoaXMuYXJyLmZvckVhY2goZnVuY3Rpb24odGlsZSwgaW5kZXgpIHtcbiAgICAgICAgYSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUsIHRydWUpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYSk7XG4gICAgICAgIGlmICgoaW5kZXggKyAxKSAlIHRoaXMuY29scyA9PT0gMCkge1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJiclwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICBhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBpbWcgPSBldmVudC50YXJnZXQubm9kZU5hbWUgPT09IFwiSU1HXCIgPyBldmVudC50YXJnZXQgOiBldmVudC50YXJnZXQuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgICAgICB0aGlzLnR1cm5Ccmljayh0aWxlLCBpbmRleCwgaW1nKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxufTtcblxuLyoqXG4gKiBEeW5hbWljYWxseSBjcmVhdGVzIHRoZSBhcnJheSBmb3IgdGhlIHNlbGVjdGlvbiBvZiBpbWFnZXNcbiAqL1xuTWVtb3J5LnByb3RvdHlwZS5jcmVhdGVBcnJheSA9IGZ1bmN0aW9uKCkge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDw9ICgodGhpcy5yb3dzICogdGhpcy5jb2xzKSAvIDIpOyBpICs9IDEpIHtcbiAgICAgICAgdGhpcy5hcnIucHVzaChpKTtcbiAgICAgICAgdGhpcy5hcnIucHVzaChpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zaHVmZmxlKHRoaXMuYXJyKTtcbn07XG5cbk1lbW9yeS5wcm90b3R5cGUudHVybkJyaWNrID0gZnVuY3Rpb24odGlsZSwgaW5kZXgsIGltZykge1xuICAgIGlmICh0aGlzLnR1cm4yKSB7IHJldHVybjsgfVxuXG4gICAgaW1nLnNyYyA9IFwiaW1hZ2UvXCIgKyB0aWxlICsgXCIucG5nXCI7XG5cbiAgICBpZiAoIXRoaXMudHVybjEpIHtcbiAgICAgICAgdGhpcy50dXJuMSA9IGltZztcbiAgICAgICAgdGhpcy5sYXN0VGlsZSA9IHRpbGU7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaW1nID09PSB0aGlzLnR1cm4xKSB7IHJldHVybjsgfVxuXG4gICAgICAgIHRoaXMudHJpZXMgKz0gMTtcblxuICAgICAgICB0aGlzLnR1cm4yID0gaW1nO1xuXG4gICAgICAgIGlmICh0aWxlID09PSB0aGlzLmxhc3RUaWxlKSB7XG4gICAgICAgICAgICB0aGlzLnBhaXJzICs9IDE7XG4gICAgICAgICAgICBpZiAodGhpcy5wYWlycyA9PT0gKHRoaXMuY29scyAqIHRoaXMucm93cykgLyAyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVsID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5Q29udGFpbmVyXCIpO1xuICAgICAgICAgICAgICAgIGlmIChlbCkge1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoZWwuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5yZW1vdmVDaGlsZChlbC5sYXN0Q2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy53aW4oKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIldvbiBvbiBcIiArIHRoaXMudHJpZXMgKyBcIiBudW1iZXIgb2YgdHJpZXMhXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4xLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZChcInJlbW92ZWRcIik7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMi5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoXCJyZW1vdmVkXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjEgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjIgPSBudWxsO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCAzMDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMS5zcmMgPSBcImltYWdlLzAucG5nXCI7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMi5zcmMgPSBcImltYWdlLzAucG5nXCI7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMiA9IG51bGw7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIDUwMCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIFRoaXMgcHJvdG90eXBlIGhhbmRsZXMgdGhlIHNodWZmbGluZyBvZiB0aGUgZGVja1xuICogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNDUwOTU0L2hvdy10by1yYW5kb21pemUtc2h1ZmZsZS1hLWphdmFzY3JpcHQtYXJyYXlcbiAqIEBwYXJhbSBpbmRleEFyciAtIHRoZSBhcnJheSB0byBiZSBzaHVmZmxlZFxuICogQHJldHVybnMgeyp9XG4gKi9cbk1lbW9yeS5wcm90b3R5cGUuc2h1ZmZsZSA9IGZ1bmN0aW9uKGluZGV4QXJyKSB7XG4gICAgdmFyIGFycmF5ID0gaW5kZXhBcnI7XG4gICAgdmFyIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aDtcbiAgICB2YXIgdGVtcG9yYXJ5VmFsdWU7XG4gICAgdmFyIHJhbmRvbUluZGV4O1xuXG4gICAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xuXG4gICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcbiAgICAgICAgY3VycmVudEluZGV4IC09IDE7XG5cbiAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xuICAgICAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xuICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG5cbn07XG5cbk1lbW9yeS5wcm90b3R5cGUud2luID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeUNvbnRhaW5lclwiKTtcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI21lbW9yeVdpblwiKVswXS5jb250ZW50O1xuICAgIHZhciBhID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZSwgdHJ1ZSk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGEpO1xuXG4gICAgdmFyIG1lbW9yeVdpblRyaWVzID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5V2luVHJpZXNcIik7XG4gICAgdmFyIGIgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIldvbiBvbiBcIiArIHRoaXMudHJpZXMgKyBcIiBudW1iZXIgb2YgdHJpZXMhXCIpO1xuICAgIG1lbW9yeVdpblRyaWVzLmFwcGVuZENoaWxkKGIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZW1vcnk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERlc2t0b3AgPSByZXF1aXJlKFwiLi9EZXNrdG9wXCIpO1xudmFyIGRlc2t0b3AgPSBuZXcgRGVza3RvcCgpO1xuZGVza3RvcC5nZW5lcmF0ZSgpO1xuXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBUYXNrQmFyID0gZnVuY3Rpb24oKSB7XHJcbn07XHJcblxyXG4vKipcclxuICpcclxuICovXHJcblRhc2tCYXIucHJvdG90eXBlLmRvY2tCYXIgPSBmdW5jdGlvbigpIHtcclxuICAgIGZ1bmN0aW9uIGFkZFByZXZDbGFzcyhlKSB7XHJcbiAgICAgICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0O1xyXG4gICAgICAgIGlmICh0YXJnZXQuZ2V0QXR0cmlidXRlKFwic3JjXCIpKSB7XHJcbiAgICAgICAgICAgIHZhciBsaSA9IHRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGU7XHJcbiAgICAgICAgICAgIHZhciBwcmV2TGkgPSBsaS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgICBpZiAocHJldkxpKSB7XHJcbiAgICAgICAgICAgICAgICBwcmV2TGkuY2xhc3NOYW1lID0gXCJwcmV2XCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJldkxpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldkxpLnJlbW92ZUF0dHJpYnV0ZShcImNsYXNzXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHByZXZMaTIgPSB0YXJnZXQucHJldmlvdXNFbGVtZW50U2libGluZztcclxuICAgICAgICAgICAgaWYgKHByZXZMaTIpIHtcclxuICAgICAgICAgICAgICAgIHByZXZMaTIuY2xhc3NOYW1lID0gXCJwcmV2XCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJldkxpMikge1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZMaTIucmVtb3ZlQXR0cmlidXRlKFwiY2xhc3NcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkb2NrXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgYWRkUHJldkNsYXNzLCBmYWxzZSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRhc2tCYXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIE1vdmUgZnVuY3Rpb24gYmFzZWQgb2YgdGhpcyBzb3VyY2UgXCJodHRwOi8vY29kZXBlbi5pby90aGViYWJ5ZGluby9wZW4vQWZhbXNcIi5cbiAqL1xudmFyIFdpbmRvdyA9IGZ1bmN0aW9uKGVsZSkge1xuICAgIHRoaXMuZWxlID0gZWxlO1xufTtcblxuV2luZG93LnByb3RvdHlwZS5uZXdXaW5kb3cgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcG9pbnQgPSB0aGlzLmVsZTtcbiAgICB2YXIgcDEgPSB7XG4gICAgICAgIHg6IHBhcnNlSW50KHBvaW50LmRhdGFzZXQueCwgMTApLFxuICAgICAgICB5OiBwYXJzZUludChwb2ludC5kYXRhc2V0LnksIDEwKVxuICAgIH07XG4gICAgdmFyIHAwID0ge1xuICAgICAgICB4OiBwYXJzZUludChwb2ludC5kYXRhc2V0LngsIDEwKSxcbiAgICAgICAgeTogcGFyc2VJbnQocG9pbnQuZGF0YXNldC55LCAxMClcbiAgICB9O1xuICAgIHZhciBjb29yZHMgPSB7XG4gICAgICAgIHg6IHBhcnNlSW50KHBvaW50LmRhdGFzZXQueCwgMTApLFxuICAgICAgICB5OiBwYXJzZUludChwb2ludC5kYXRhc2V0LnksIDEwKVxuICAgIH07XG4gICAgdmFyIGZsYWc7XG5cbiAgICB2YXIgZHJhZyA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgcDEgPSB7eDogZS5jbGllbnRYLCB5OiBlLmNsaWVudFl9O1xuXG4gICAgICAgIHBvaW50LmRhdGFzZXQueCA9IGNvb3Jkcy54ICsgcDEueCAtIHAwLng7XG4gICAgICAgIHBvaW50LmRhdGFzZXQueSA9IGNvb3Jkcy55ICsgcDEueSAtIHAwLnk7XG5cbiAgICAgICAgcG9pbnQuc3R5bGVbXCItd2Via2l0LXRyYW5zZm9ybVwiXSA9XG4gICAgICAgICAgICBcInRyYW5zbGF0ZShcIiArIHBvaW50LmRhdGFzZXQueCArIFwicHgsIFwiICsgcG9pbnQuZGF0YXNldC55ICsgXCJweClcIjtcbiAgICAgICAgcG9pbnQuc3R5bGUudHJhbnNmb3JtID1cbiAgICAgICAgICAgIFwidHJhbnNsYXRlKFwiICsgcG9pbnQuZGF0YXNldC54ICsgXCJweCwgXCIgKyBwb2ludC5kYXRhc2V0LnkgKyBcInB4KVwiO1xuICAgIH07XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciB0ID0gZS50YXJnZXQ7XG5cbiAgICAgICAgaWYgKHQgPT09IHBvaW50KSB7XG4gICAgICAgICAgICBwMCA9IHt4OiBlLmNsaWVudFgsIHk6IGUuY2xpZW50WX07XG4gICAgICAgICAgICBmbGFnID0gdHJ1ZTtcblxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZHJhZywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZmxhZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChmbGFnKSB7XG4gICAgICAgICAgICBjb29yZHMueCArPSBwMS54IC0gcDAueDtcbiAgICAgICAgICAgIGNvb3Jkcy55ICs9IHAxLnkgLSBwMC55O1xuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZHJhZywgZmFsc2UpO1xuICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xufTtcblxuV2luZG93LnByb3RvdHlwZS5nZW5DaGF0ID0gZnVuY3Rpb24oKSB7XG5cbn07XG5cbldpbmRvdy5wcm90b3R5cGUuY2xlYXJBbGwgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRhaW5lclwiKTtcbiAgICBpZiAoZWwpIHtcbiAgICAgICAgd2hpbGUgKGVsLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgZWwucmVtb3ZlQ2hpbGQoZWwubGFzdENoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbldpbmRvdy5wcm90b3R5cGUucG9wdXBPcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwb3B1cFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xufTtcblxuV2luZG93LnByb3RvdHlwZS5wb3B1cENsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwb3B1cFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvdmVybGF5XCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gV2luZG93O1xuXG4iXX0=
