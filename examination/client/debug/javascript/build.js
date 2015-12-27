(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Chat = function(username) {
    this.chatBox = "";
    this.socket = new WebSocket("ws://vhost3.lnu.se:20080/socket/");
    this.username = username;
    this.channel = "";
    this.key = "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd";
    this.data = {};
    this.message = undefined;
    this.textArea = document.querySelector(".textArea");
};

/**
 *
 */
Chat.prototype.server = function() {

    //EventListener for when communication is open
    this.socket.addEventListener("open", function () {
        var sendChat = document.querySelector(".sendChat");
        sendChat.addEventListener("click", function(event) {
            event.preventDefault();
            this.send();
        }.bind(this), false);

        var enterChat = document.querySelector(".chatBox");
        enterChat.addEventListener("keypress", function(e) {
            var key = e.which || e.keyCode;
            if (key === 13) { // 13 is enter
                this.send();
            }
        }.bind(this), false);
    }.bind(this));

    this.socket.addEventListener("message", function (event) {
        this.message = JSON.parse(event.data);
        if (this.message.data !== "") {
            console.log(this.message.username + ": " + this.message.data);
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(this.message.username + ": " + this.message.data));
            this.textArea.appendChild(li);

            //Scrolls down when new message is arrived
            var chatEl = document.querySelector(".textContainer");
            chatEl.scrollTop = chatEl.scrollHeight;
        }

    }.bind(this));
};


Chat.prototype.send = function() {
    this.chatBox = document.querySelector(".chatBox");
    this.data = {
        "type": "message",
        "data": this.chatBox.value,
        "username": this.username,
        "channel": this.channel,
        "key": this.key
    };
    this.socket.send(JSON.stringify(this.data));
    this.chatBox.value = "";
    this.chatBox.focus();
};



module.exports = Chat;

},{}],2:[function(require,module,exports){
"use strict";

/**
 * Memory constructor
 * @param rows - The amount of rows
 * @param cols - The amount of columns
 * @constructor
 */
var Memory = function(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.arr = [];
    this.turn1 = "";
    this.turn2 = "";
    this.lastTile = "";
    this.tries = 0;
    this.pairs = 0;
};

/**
 * Starting point of the game
 */
Memory.prototype.startGame = function() {
    this.createArray();
    this.createBoard();
};

/**
 * Clear the memory play area
 */
Memory.prototype.clear = function() {
    var el = document.querySelector(".memoryContainer");
    if (el) {
        while (el.hasChildNodes()) {
            el.removeChild(el.lastChild);
        }
    }
};

/**
 * Dynamically creates the board
 */
Memory.prototype.createBoard = function() {
    var container = document.querySelector(".memoryContainer");
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
                console.log("Won on " + this.tries + " number of tries!");
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

module.exports = Memory;

},{}],3:[function(require,module,exports){
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
    var memoryWindow = document.querySelectorAll(".memoryWindow");
    var memoryButton = document.querySelector(".startMemory");
    for (var j = 0; j < memoryWindow.length; j += 1) {
        memoryButton.addEventListener("click", function() {
            event.preventDefault();
            var game = new Memory(4, 4);
            game.clear();
            game.startGame();
        }, false);
    }
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

},{"./Chat":1,"./Memory":2,"./taskbar":4,"./window":5}],4:[function(require,module,exports){
"use strict";

var TaskBar = function() {
};

/**
 *
 */
TaskBar.prototype.dockBar = function() {
    function addPrevClass (e) {
        var target = e.target;
        if(target.getAttribute("src")) {
            var li = target.parentNode.parentNode;
            var prevLi = li.previousElementSibling;
            if(prevLi) {
                prevLi.className = "prev";
            }

            target.addEventListener("mouseout", function() {
                if (prevLi) {
                    prevLi.removeAttribute("class");
                }
            }, false);
        } else {
            var prevLi2 = target.previousElementSibling;
            if(prevLi2) {
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

},{}],5:[function(require,module,exports){
"use strict";

/**
 * Move function based of this source "http://codepen.io/thebabydino/pen/Afams".
 */
var Window = function() {
};


Window.prototype.newWindow = function(e) {
    var point = e;
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
    }, false);

    window.addEventListener("mouseup", function() {
        if (flag) {
            coords.x += p1.x - p0.x;
            coords.y += p1.y - p0.y;
        }

        window.removeEventListener("mousemove", drag, false);
    }, false);
};

Window.prototype.genWindow = function() {
    var container = document.querySelector("#container");
    var template = document.querySelector("#memoryWindow");
    var a = document.importNode(template.content, true);
    container.appendChild(a);
};

Window.prototype.genChat = function() {
    var container = document.querySelector("#container");
    var template = document.querySelector("#chatWindow");
    var a = document.importNode(template.content, true);
    container.appendChild(a);
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
    document.querySelector("#popup").style.display="block";
    document.querySelector("#overlay").style.display="block";
};

Window.prototype.popupClose = function() {
    document.querySelector("#popup").style.display="none";
    document.querySelector("#overlay").style.display="none";
};





module.exports = Window;



},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvTWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiLCJjbGllbnQvc291cmNlL2pzL3Rhc2tiYXIuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIENoYXQgPSBmdW5jdGlvbih1c2VybmFtZSkge1xuICAgIHRoaXMuY2hhdEJveCA9IFwiXCI7XG4gICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KFwid3M6Ly92aG9zdDMubG51LnNlOjIwMDgwL3NvY2tldC9cIik7XG4gICAgdGhpcy51c2VybmFtZSA9IHVzZXJuYW1lO1xuICAgIHRoaXMuY2hhbm5lbCA9IFwiXCI7XG4gICAgdGhpcy5rZXkgPSBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCI7XG4gICAgdGhpcy5kYXRhID0ge307XG4gICAgdGhpcy5tZXNzYWdlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMudGV4dEFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRleHRBcmVhXCIpO1xufTtcblxuLyoqXG4gKlxuICovXG5DaGF0LnByb3RvdHlwZS5zZXJ2ZXIgPSBmdW5jdGlvbigpIHtcblxuICAgIC8vRXZlbnRMaXN0ZW5lciBmb3Igd2hlbiBjb21tdW5pY2F0aW9uIGlzIG9wZW5cbiAgICB0aGlzLnNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzZW5kQ2hhdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2VuZENoYXRcIik7XG4gICAgICAgIHNlbmRDaGF0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuc2VuZCgpO1xuICAgICAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcblxuICAgICAgICB2YXIgZW50ZXJDaGF0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jaGF0Qm94XCIpO1xuICAgICAgICBlbnRlckNoYXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBlLndoaWNoIHx8IGUua2V5Q29kZTtcbiAgICAgICAgICAgIGlmIChrZXkgPT09IDEzKSB7IC8vIDEzIGlzIGVudGVyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLnNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgaWYgKHRoaXMubWVzc2FnZS5kYXRhICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLm1lc3NhZ2UudXNlcm5hbWUgKyBcIjogXCIgKyB0aGlzLm1lc3NhZ2UuZGF0YSk7XG4gICAgICAgICAgICB2YXIgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgICAgICBsaS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGlzLm1lc3NhZ2UudXNlcm5hbWUgKyBcIjogXCIgKyB0aGlzLm1lc3NhZ2UuZGF0YSkpO1xuICAgICAgICAgICAgdGhpcy50ZXh0QXJlYS5hcHBlbmRDaGlsZChsaSk7XG5cbiAgICAgICAgICAgIC8vU2Nyb2xscyBkb3duIHdoZW4gbmV3IG1lc3NhZ2UgaXMgYXJyaXZlZFxuICAgICAgICAgICAgdmFyIGNoYXRFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGV4dENvbnRhaW5lclwiKTtcbiAgICAgICAgICAgIGNoYXRFbC5zY3JvbGxUb3AgPSBjaGF0RWwuc2Nyb2xsSGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuXG5DaGF0LnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5jaGF0Qm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jaGF0Qm94XCIpO1xuICAgIHRoaXMuZGF0YSA9IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwibWVzc2FnZVwiLFxuICAgICAgICBcImRhdGFcIjogdGhpcy5jaGF0Qm94LnZhbHVlLFxuICAgICAgICBcInVzZXJuYW1lXCI6IHRoaXMudXNlcm5hbWUsXG4gICAgICAgIFwiY2hhbm5lbFwiOiB0aGlzLmNoYW5uZWwsXG4gICAgICAgIFwia2V5XCI6IHRoaXMua2V5XG4gICAgfTtcbiAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YSkpO1xuICAgIHRoaXMuY2hhdEJveC52YWx1ZSA9IFwiXCI7XG4gICAgdGhpcy5jaGF0Qm94LmZvY3VzKCk7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDaGF0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogTWVtb3J5IGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0gcm93cyAtIFRoZSBhbW91bnQgb2Ygcm93c1xuICogQHBhcmFtIGNvbHMgLSBUaGUgYW1vdW50IG9mIGNvbHVtbnNcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgTWVtb3J5ID0gZnVuY3Rpb24ocm93cywgY29scykge1xuICAgIHRoaXMucm93cyA9IHJvd3M7XG4gICAgdGhpcy5jb2xzID0gY29scztcbiAgICB0aGlzLmFyciA9IFtdO1xuICAgIHRoaXMudHVybjEgPSBcIlwiO1xuICAgIHRoaXMudHVybjIgPSBcIlwiO1xuICAgIHRoaXMubGFzdFRpbGUgPSBcIlwiO1xuICAgIHRoaXMudHJpZXMgPSAwO1xuICAgIHRoaXMucGFpcnMgPSAwO1xufTtcblxuLyoqXG4gKiBTdGFydGluZyBwb2ludCBvZiB0aGUgZ2FtZVxuICovXG5NZW1vcnkucHJvdG90eXBlLnN0YXJ0R2FtZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY3JlYXRlQXJyYXkoKTtcbiAgICB0aGlzLmNyZWF0ZUJvYXJkKCk7XG59O1xuXG4vKipcbiAqIENsZWFyIHRoZSBtZW1vcnkgcGxheSBhcmVhXG4gKi9cbk1lbW9yeS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeUNvbnRhaW5lclwiKTtcbiAgICBpZiAoZWwpIHtcbiAgICAgICAgd2hpbGUgKGVsLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgZWwucmVtb3ZlQ2hpbGQoZWwubGFzdENoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogRHluYW1pY2FsbHkgY3JlYXRlcyB0aGUgYm9hcmRcbiAqL1xuTWVtb3J5LnByb3RvdHlwZS5jcmVhdGVCb2FyZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeUNvbnRhaW5lclwiKTtcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI21lbW9yeVRlbXBsYXRlXCIpWzBdLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgdmFyIGE7XG5cbiAgICB0aGlzLmFyci5mb3JFYWNoKGZ1bmN0aW9uKHRpbGUsIGluZGV4KSB7XG4gICAgICAgIGEgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLCB0cnVlKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGEpO1xuICAgICAgICBpZiAoKGluZGV4ICsgMSkgJSB0aGlzLmNvbHMgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgYS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgaW1nID0gZXZlbnQudGFyZ2V0Lm5vZGVOYW1lID09PSBcIklNR1wiID8gZXZlbnQudGFyZ2V0IDogZXZlbnQudGFyZ2V0LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICAgICAgdGhpcy50dXJuQnJpY2sodGlsZSwgaW5kZXgsIGltZyk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbn07XG5cbi8qKlxuICogRHluYW1pY2FsbHkgY3JlYXRlcyB0aGUgYXJyYXkgZm9yIHRoZSBzZWxlY3Rpb24gb2YgaW1hZ2VzXG4gKi9cbk1lbW9yeS5wcm90b3R5cGUuY3JlYXRlQXJyYXkgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8PSAoKHRoaXMucm93cyAqIHRoaXMuY29scykgLyAyKTsgaSArPSAxKSB7XG4gICAgICAgIHRoaXMuYXJyLnB1c2goaSk7XG4gICAgICAgIHRoaXMuYXJyLnB1c2goaSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc2h1ZmZsZSh0aGlzLmFycik7XG59O1xuXG5NZW1vcnkucHJvdG90eXBlLnR1cm5CcmljayA9IGZ1bmN0aW9uKHRpbGUsIGluZGV4LCBpbWcpIHtcbiAgICBpZiAodGhpcy50dXJuMikgeyByZXR1cm47IH1cblxuICAgIGltZy5zcmMgPSBcImltYWdlL1wiICsgdGlsZSArIFwiLnBuZ1wiO1xuXG4gICAgaWYgKCF0aGlzLnR1cm4xKSB7XG4gICAgICAgIHRoaXMudHVybjEgPSBpbWc7XG4gICAgICAgIHRoaXMubGFzdFRpbGUgPSB0aWxlO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGltZyA9PT0gdGhpcy50dXJuMSkgeyByZXR1cm47IH1cblxuICAgICAgICB0aGlzLnRyaWVzICs9IDE7XG5cbiAgICAgICAgdGhpcy50dXJuMiA9IGltZztcblxuICAgICAgICBpZiAodGlsZSA9PT0gdGhpcy5sYXN0VGlsZSkge1xuICAgICAgICAgICAgdGhpcy5wYWlycyArPSAxO1xuICAgICAgICAgICAgaWYgKHRoaXMucGFpcnMgPT09ICh0aGlzLmNvbHMgKiB0aGlzLnJvd3MpIC8gMikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV29uIG9uIFwiICsgdGhpcy50cmllcyArIFwiIG51bWJlciBvZiB0cmllcyFcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoXCJyZW1vdmVkXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjIucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKFwicmVtb3ZlZFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4xID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4yID0gbnVsbDtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgMzAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjEuc3JjID0gXCJpbWFnZS8wLnBuZ1wiO1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjIuc3JjID0gXCJpbWFnZS8wLnBuZ1wiO1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjEgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjIgPSBudWxsO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCA1MDApO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiBUaGlzIHByb3RvdHlwZSBoYW5kbGVzIHRoZSBzaHVmZmxpbmcgb2YgdGhlIGRlY2tcbiAqIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjQ1MDk1NC9ob3ctdG8tcmFuZG9taXplLXNodWZmbGUtYS1qYXZhc2NyaXB0LWFycmF5XG4gKiBAcGFyYW0gaW5kZXhBcnIgLSB0aGUgYXJyYXkgdG8gYmUgc2h1ZmZsZWRcbiAqIEByZXR1cm5zIHsqfVxuICovXG5NZW1vcnkucHJvdG90eXBlLnNodWZmbGUgPSBmdW5jdGlvbihpbmRleEFycikge1xuICAgIHZhciBhcnJheSA9IGluZGV4QXJyO1xuICAgIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGg7XG4gICAgdmFyIHRlbXBvcmFyeVZhbHVlO1xuICAgIHZhciByYW5kb21JbmRleDtcblxuICAgIHdoaWxlIChjdXJyZW50SW5kZXggIT09IDApIHtcblxuICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XG4gICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xuXG4gICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcbiAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcbiAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbmV3V2luZG93ID0gcmVxdWlyZShcIi4vd2luZG93XCIpO1xudmFyIE1lbW9yeSA9IHJlcXVpcmUoXCIuL01lbW9yeVwiKTtcbnZhciBUYXNrQmFyID0gcmVxdWlyZShcIi4vdGFza2JhclwiKTtcbnZhciBDaGF0ID0gcmVxdWlyZShcIi4vQ2hhdFwiKTtcblxuXG5cbnZhciBNZW51ID0gbmV3IFRhc2tCYXIoKTtcbk1lbnUuZG9ja0JhcigpO1xuXG52YXIgV2luZG93ID0gbmV3IG5ld1dpbmRvdygpO1xuV2luZG93LnBvcHVwQ2xvc2UoKTtcblxudmFyIGRvY2tDbGVhckFsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2xlYXJBbGxCdXR0b25cIik7XG5kb2NrQ2xlYXJBbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB2YXIgV2luZG93ID0gbmV3IG5ld1dpbmRvdygpO1xuICAgIFdpbmRvdy5wb3B1cE9wZW4oKTtcblxuICAgIHZhciBwb3B1cENsb3NlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zMy1idG4tY2xvc2VcIik7XG4gICAgcG9wdXBDbG9zZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIFdpbmRvdyA9IG5ldyBuZXdXaW5kb3coKTtcbiAgICAgICAgV2luZG93LnBvcHVwQ2xvc2UoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB2YXIgcG9wdXBDbG9zZTIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNhbmNlbFBvcHVwXCIpO1xuICAgIHBvcHVwQ2xvc2UyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgV2luZG93ID0gbmV3IG5ld1dpbmRvdygpO1xuICAgICAgICBXaW5kb3cucG9wdXBDbG9zZSgpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHZhciBwb3B1cENsZWFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb25maXJtUG9wdXBcIik7XG4gICAgcG9wdXBDbGVhci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIFdpbmRvdyA9IG5ldyBuZXdXaW5kb3coKTtcbiAgICAgICAgV2luZG93LmNsZWFyQWxsKCk7XG4gICAgICAgIFdpbmRvdy5wb3B1cENsb3NlKCk7XG4gICAgfSwgZmFsc2UpO1xuXG59LCBmYWxzZSk7XG5cblxudmFyIGRvY2tNZW1vcnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeUJ1dHRvblwiKTtcblxuZG9ja01lbW9yeS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBXaW5kb3cgPSBuZXcgbmV3V2luZG93KCk7XG4gICAgV2luZG93LmdlbldpbmRvdygpO1xuICAgIHZhciB3aW5kb3dEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBvaW50XCIpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd2luZG93RGl2Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIFdpbmRvdy5uZXdXaW5kb3cod2luZG93RGl2W2ldKTtcbiAgICB9XG4gICAgdmFyIG1lbW9yeVdpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubWVtb3J5V2luZG93XCIpO1xuICAgIHZhciBtZW1vcnlCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN0YXJ0TWVtb3J5XCIpO1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgbWVtb3J5V2luZG93Lmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgIG1lbW9yeUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdmFyIGdhbWUgPSBuZXcgTWVtb3J5KDQsIDQpO1xuICAgICAgICAgICAgZ2FtZS5jbGVhcigpO1xuICAgICAgICAgICAgZ2FtZS5zdGFydEdhbWUoKTtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgIH1cbn0sIGZhbHNlKTtcblxudmFyIGRvY2tDaGF0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjaGF0QnV0dG9uXCIpO1xuXG5kb2NrQ2hhdC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBXaW5kb3cgPSBuZXcgbmV3V2luZG93KCk7XG4gICAgV2luZG93LmdlbkNoYXQoKTtcbiAgICB2YXIgd2luZG93RGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wb2ludFwiKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdpbmRvd0Rpdi5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBXaW5kb3cubmV3V2luZG93KHdpbmRvd0RpdltpXSk7XG4gICAgfVxuICAgIHZhciBNeUNoYXQgPSBuZXcgQ2hhdCgpO1xuICAgIE15Q2hhdC5zZXJ2ZXIoKTtcbn0sIGZhbHNlKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgVGFza0JhciA9IGZ1bmN0aW9uKCkge1xufTtcblxuLyoqXG4gKlxuICovXG5UYXNrQmFyLnByb3RvdHlwZS5kb2NrQmFyID0gZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gYWRkUHJldkNsYXNzIChlKSB7XG4gICAgICAgIHZhciB0YXJnZXQgPSBlLnRhcmdldDtcbiAgICAgICAgaWYodGFyZ2V0LmdldEF0dHJpYnV0ZShcInNyY1wiKSkge1xuICAgICAgICAgICAgdmFyIGxpID0gdGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgICAgIHZhciBwcmV2TGkgPSBsaS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgaWYocHJldkxpKSB7XG4gICAgICAgICAgICAgICAgcHJldkxpLmNsYXNzTmFtZSA9IFwicHJldlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChwcmV2TGkpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldkxpLnJlbW92ZUF0dHJpYnV0ZShcImNsYXNzXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBwcmV2TGkyID0gdGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICBpZihwcmV2TGkyKSB7XG4gICAgICAgICAgICAgICAgcHJldkxpMi5jbGFzc05hbWUgPSBcInByZXZcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByZXZMaTIpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldkxpMi5yZW1vdmVBdHRyaWJ1dGUoXCJjbGFzc1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZG9ja1wiKS5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsIGFkZFByZXZDbGFzcywgZmFsc2UpO1xuICAgIH1cbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBUYXNrQmFyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogTW92ZSBmdW5jdGlvbiBiYXNlZCBvZiB0aGlzIHNvdXJjZSBcImh0dHA6Ly9jb2RlcGVuLmlvL3RoZWJhYnlkaW5vL3Blbi9BZmFtc1wiLlxuICovXG52YXIgV2luZG93ID0gZnVuY3Rpb24oKSB7XG59O1xuXG5cbldpbmRvdy5wcm90b3R5cGUubmV3V2luZG93ID0gZnVuY3Rpb24oZSkge1xuICAgIHZhciBwb2ludCA9IGU7XG4gICAgdmFyIHAxID0ge1xuICAgICAgICB4OiBwYXJzZUludChwb2ludC5kYXRhc2V0LngsIDEwKSxcbiAgICAgICAgeTogcGFyc2VJbnQocG9pbnQuZGF0YXNldC55LCAxMClcbiAgICB9O1xuICAgIHZhciBwMCA9IHtcbiAgICAgICAgeDogcGFyc2VJbnQocG9pbnQuZGF0YXNldC54LCAxMCksXG4gICAgICAgIHk6IHBhcnNlSW50KHBvaW50LmRhdGFzZXQueSwgMTApXG4gICAgfTtcbiAgICB2YXIgY29vcmRzID0ge1xuICAgICAgICB4OiBwYXJzZUludChwb2ludC5kYXRhc2V0LngsIDEwKSxcbiAgICAgICAgeTogcGFyc2VJbnQocG9pbnQuZGF0YXNldC55LCAxMClcbiAgICB9O1xuICAgIHZhciBmbGFnO1xuXG4gICAgdmFyIGRyYWcgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIHAxID0ge3g6IGUuY2xpZW50WCwgeTogZS5jbGllbnRZfTtcblxuICAgICAgICBwb2ludC5kYXRhc2V0LnggPSBjb29yZHMueCArIHAxLnggLSBwMC54O1xuICAgICAgICBwb2ludC5kYXRhc2V0LnkgPSBjb29yZHMueSArIHAxLnkgLSBwMC55O1xuXG4gICAgICAgIHBvaW50LnN0eWxlW1wiLXdlYmtpdC10cmFuc2Zvcm1cIl0gPVxuICAgICAgICAgICAgXCJ0cmFuc2xhdGUoXCIgKyBwb2ludC5kYXRhc2V0LnggKyBcInB4LCBcIiArIHBvaW50LmRhdGFzZXQueSArIFwicHgpXCI7XG4gICAgICAgIHBvaW50LnN0eWxlLnRyYW5zZm9ybSA9XG4gICAgICAgICAgICBcInRyYW5zbGF0ZShcIiArIHBvaW50LmRhdGFzZXQueCArIFwicHgsIFwiICsgcG9pbnQuZGF0YXNldC55ICsgXCJweClcIjtcbiAgICB9O1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgdCA9IGUudGFyZ2V0O1xuXG4gICAgICAgIGlmICh0ID09PSBwb2ludCkge1xuICAgICAgICAgICAgcDAgPSB7eDogZS5jbGllbnRYLCB5OiBlLmNsaWVudFl9O1xuICAgICAgICAgICAgZmxhZyA9IHRydWU7XG5cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGRyYWcsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZsYWcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sIGZhbHNlKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGZsYWcpIHtcbiAgICAgICAgICAgIGNvb3Jkcy54ICs9IHAxLnggLSBwMC54O1xuICAgICAgICAgICAgY29vcmRzLnkgKz0gcDEueSAtIHAwLnk7XG4gICAgICAgIH1cblxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBkcmFnLCBmYWxzZSk7XG4gICAgfSwgZmFsc2UpO1xufTtcblxuV2luZG93LnByb3RvdHlwZS5nZW5XaW5kb3cgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250YWluZXJcIik7XG4gICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlXaW5kb3dcIik7XG4gICAgdmFyIGEgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChhKTtcbn07XG5cbldpbmRvdy5wcm90b3R5cGUuZ2VuQ2hhdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRhaW5lclwiKTtcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXRXaW5kb3dcIik7XG4gICAgdmFyIGEgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChhKTtcbn07XG5cblxuV2luZG93LnByb3RvdHlwZS5jbGVhckFsbCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGFpbmVyXCIpO1xuICAgIGlmIChlbCkge1xuICAgICAgICB3aGlsZSAoZWwuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICBlbC5yZW1vdmVDaGlsZChlbC5sYXN0Q2hpbGQpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuV2luZG93LnByb3RvdHlwZS5wb3B1cE9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BvcHVwXCIpLnN0eWxlLmRpc3BsYXk9XCJibG9ja1wiO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIjtcbn07XG5cbldpbmRvdy5wcm90b3R5cGUucG9wdXBDbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcG9wdXBcIikuc3R5bGUuZGlzcGxheT1cIm5vbmVcIjtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI292ZXJsYXlcIikuc3R5bGUuZGlzcGxheT1cIm5vbmVcIjtcbn07XG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3c7XG5cblxuIl19
