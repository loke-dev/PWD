(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Chat = function() {
    this.chatBox = "";
    this.socket = new WebSocket("ws://vhost3.lnu.se:20080/socket/");
    this.username = "Loke";
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
    this.socket.addEventListener("open", function () {
        var sendChat = document.querySelector(".sendChat");
        sendChat.addEventListener("click", function(event) {
            event.preventDefault();
            this.chatBox = document.querySelector(".chatBox");
            this.data = {
                "type": "message",
                "data" : this.chatBox.value,
                "username": this.username,
                "channel": this.channel,
                "key": this.key
            };
            this.socket.send(JSON.stringify(this.data));
            this.chatBox.value = "";
        }.bind(this), false);
    }.bind(this));

    this.socket.addEventListener("message", function (event) {
        this.message = JSON.parse(event.data);
        if (this.message.data !== "") {
            console.log(this.message.username + ": " + this.message.data);
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(this.message.username + ": " + this.message.data));
            this.textArea.appendChild(li);
        }

    }.bind(this));
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
    Window.newWindow();
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
    Window.newWindow();
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
 * Code based of this source "http://codepen.io/thebabydino/pen/Afams".
 */
var Window = function() {
};


Window.prototype.newWindow = function() {
    var point = document.querySelector(".point");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvTWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiLCJjbGllbnQvc291cmNlL2pzL3Rhc2tiYXIuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQ2hhdCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY2hhdEJveCA9IFwiXCI7XG4gICAgdGhpcy5zb2NrZXQgPSBuZXcgV2ViU29ja2V0KFwid3M6Ly92aG9zdDMubG51LnNlOjIwMDgwL3NvY2tldC9cIik7XG4gICAgdGhpcy51c2VybmFtZSA9IFwiTG9rZVwiO1xuICAgIHRoaXMuY2hhbm5lbCA9IFwiXCI7XG4gICAgdGhpcy5rZXkgPSBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCI7XG4gICAgdGhpcy5kYXRhID0ge307XG4gICAgdGhpcy5tZXNzYWdlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMudGV4dEFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRleHRBcmVhXCIpO1xufTtcblxuLyoqXG4gKlxuICovXG5DaGF0LnByb3RvdHlwZS5zZXJ2ZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzZW5kQ2hhdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2VuZENoYXRcIik7XG4gICAgICAgIHNlbmRDaGF0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuY2hhdEJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2hhdEJveFwiKTtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJtZXNzYWdlXCIsXG4gICAgICAgICAgICAgICAgXCJkYXRhXCIgOiB0aGlzLmNoYXRCb3gudmFsdWUsXG4gICAgICAgICAgICAgICAgXCJ1c2VybmFtZVwiOiB0aGlzLnVzZXJuYW1lLFxuICAgICAgICAgICAgICAgIFwiY2hhbm5lbFwiOiB0aGlzLmNoYW5uZWwsXG4gICAgICAgICAgICAgICAgXCJrZXlcIjogdGhpcy5rZXlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YSkpO1xuICAgICAgICAgICAgdGhpcy5jaGF0Qm94LnZhbHVlID0gXCJcIjtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICBpZiAodGhpcy5tZXNzYWdlLmRhdGEgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMubWVzc2FnZS51c2VybmFtZSArIFwiOiBcIiArIHRoaXMubWVzc2FnZS5kYXRhKTtcbiAgICAgICAgICAgIHZhciBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgICAgIGxpLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMubWVzc2FnZS51c2VybmFtZSArIFwiOiBcIiArIHRoaXMubWVzc2FnZS5kYXRhKSk7XG4gICAgICAgICAgICB0aGlzLnRleHRBcmVhLmFwcGVuZENoaWxkKGxpKTtcbiAgICAgICAgfVxuXG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBDaGF0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogTWVtb3J5IGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0gcm93cyAtIFRoZSBhbW91bnQgb2Ygcm93c1xuICogQHBhcmFtIGNvbHMgLSBUaGUgYW1vdW50IG9mIGNvbHVtbnNcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgTWVtb3J5ID0gZnVuY3Rpb24ocm93cywgY29scykge1xuICAgIHRoaXMucm93cyA9IHJvd3M7XG4gICAgdGhpcy5jb2xzID0gY29scztcbiAgICB0aGlzLmFyciA9IFtdO1xuICAgIHRoaXMudHVybjEgPSBcIlwiO1xuICAgIHRoaXMudHVybjIgPSBcIlwiO1xuICAgIHRoaXMubGFzdFRpbGUgPSBcIlwiO1xuICAgIHRoaXMudHJpZXMgPSAwO1xuICAgIHRoaXMucGFpcnMgPSAwO1xufTtcblxuLyoqXG4gKiBTdGFydGluZyBwb2ludCBvZiB0aGUgZ2FtZVxuICovXG5NZW1vcnkucHJvdG90eXBlLnN0YXJ0R2FtZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY3JlYXRlQXJyYXkoKTtcbiAgICB0aGlzLmNyZWF0ZUJvYXJkKCk7XG59O1xuXG4vKipcbiAqIENsZWFyIHRoZSBtZW1vcnkgcGxheSBhcmVhXG4gKi9cbk1lbW9yeS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeUNvbnRhaW5lclwiKTtcbiAgICBpZiAoZWwpIHtcbiAgICAgICAgd2hpbGUgKGVsLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgZWwucmVtb3ZlQ2hpbGQoZWwubGFzdENoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogRHluYW1pY2FsbHkgY3JlYXRlcyB0aGUgYm9hcmRcbiAqL1xuTWVtb3J5LnByb3RvdHlwZS5jcmVhdGVCb2FyZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeUNvbnRhaW5lclwiKTtcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI21lbW9yeVRlbXBsYXRlXCIpWzBdLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgdmFyIGE7XG5cbiAgICB0aGlzLmFyci5mb3JFYWNoKGZ1bmN0aW9uKHRpbGUsIGluZGV4KSB7XG4gICAgICAgIGEgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLCB0cnVlKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGEpO1xuICAgICAgICBpZiAoKGluZGV4ICsgMSkgJSB0aGlzLmNvbHMgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgYS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgaW1nID0gZXZlbnQudGFyZ2V0Lm5vZGVOYW1lID09PSBcIklNR1wiID8gZXZlbnQudGFyZ2V0IDogZXZlbnQudGFyZ2V0LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICAgICAgdGhpcy50dXJuQnJpY2sodGlsZSwgaW5kZXgsIGltZyk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbn07XG5cbi8qKlxuICogRHluYW1pY2FsbHkgY3JlYXRlcyB0aGUgYXJyYXkgZm9yIHRoZSBzZWxlY3Rpb24gb2YgaW1hZ2VzXG4gKi9cbk1lbW9yeS5wcm90b3R5cGUuY3JlYXRlQXJyYXkgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8PSAoKHRoaXMucm93cyAqIHRoaXMuY29scykgLyAyKTsgaSArPSAxKSB7XG4gICAgICAgIHRoaXMuYXJyLnB1c2goaSk7XG4gICAgICAgIHRoaXMuYXJyLnB1c2goaSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc2h1ZmZsZSh0aGlzLmFycik7XG59O1xuXG5NZW1vcnkucHJvdG90eXBlLnR1cm5CcmljayA9IGZ1bmN0aW9uKHRpbGUsIGluZGV4LCBpbWcpIHtcbiAgICBpZiAodGhpcy50dXJuMikgeyByZXR1cm47IH1cblxuICAgIGltZy5zcmMgPSBcImltYWdlL1wiICsgdGlsZSArIFwiLnBuZ1wiO1xuXG4gICAgaWYgKCF0aGlzLnR1cm4xKSB7XG4gICAgICAgIHRoaXMudHVybjEgPSBpbWc7XG4gICAgICAgIHRoaXMubGFzdFRpbGUgPSB0aWxlO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGltZyA9PT0gdGhpcy50dXJuMSkgeyByZXR1cm47IH1cblxuICAgICAgICB0aGlzLnRyaWVzICs9IDE7XG5cbiAgICAgICAgdGhpcy50dXJuMiA9IGltZztcblxuICAgICAgICBpZiAodGlsZSA9PT0gdGhpcy5sYXN0VGlsZSkge1xuICAgICAgICAgICAgdGhpcy5wYWlycyArPSAxO1xuICAgICAgICAgICAgaWYgKHRoaXMucGFpcnMgPT09ICh0aGlzLmNvbHMgKiB0aGlzLnJvd3MpIC8gMikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV29uIG9uIFwiICsgdGhpcy50cmllcyArIFwiIG51bWJlciBvZiB0cmllcyFcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoXCJyZW1vdmVkXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjIucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKFwicmVtb3ZlZFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4xID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4yID0gbnVsbDtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgMzAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjEuc3JjID0gXCJpbWFnZS8wLnBuZ1wiO1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjIuc3JjID0gXCJpbWFnZS8wLnBuZ1wiO1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjEgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjIgPSBudWxsO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCA1MDApO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiBUaGlzIHByb3RvdHlwZSBoYW5kbGVzIHRoZSBzaHVmZmxpbmcgb2YgdGhlIGRlY2tcbiAqIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjQ1MDk1NC9ob3ctdG8tcmFuZG9taXplLXNodWZmbGUtYS1qYXZhc2NyaXB0LWFycmF5XG4gKiBAcGFyYW0gaW5kZXhBcnIgLSB0aGUgYXJyYXkgdG8gYmUgc2h1ZmZsZWRcbiAqIEByZXR1cm5zIHsqfVxuICovXG5NZW1vcnkucHJvdG90eXBlLnNodWZmbGUgPSBmdW5jdGlvbihpbmRleEFycikge1xuICAgIHZhciBhcnJheSA9IGluZGV4QXJyO1xuICAgIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGg7XG4gICAgdmFyIHRlbXBvcmFyeVZhbHVlO1xuICAgIHZhciByYW5kb21JbmRleDtcblxuICAgIHdoaWxlIChjdXJyZW50SW5kZXggIT09IDApIHtcblxuICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XG4gICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xuXG4gICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcbiAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcbiAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbmV3V2luZG93ID0gcmVxdWlyZShcIi4vd2luZG93XCIpO1xudmFyIE1lbW9yeSA9IHJlcXVpcmUoXCIuL01lbW9yeVwiKTtcbnZhciBUYXNrQmFyID0gcmVxdWlyZShcIi4vdGFza2JhclwiKTtcbnZhciBDaGF0ID0gcmVxdWlyZShcIi4vQ2hhdFwiKTtcblxuXG5cbnZhciBNZW51ID0gbmV3IFRhc2tCYXIoKTtcbk1lbnUuZG9ja0JhcigpO1xuXG52YXIgV2luZG93ID0gbmV3IG5ld1dpbmRvdygpO1xuV2luZG93LnBvcHVwQ2xvc2UoKTtcblxudmFyIGRvY2tDbGVhckFsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2xlYXJBbGxCdXR0b25cIik7XG5kb2NrQ2xlYXJBbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB2YXIgV2luZG93ID0gbmV3IG5ld1dpbmRvdygpO1xuICAgIFdpbmRvdy5wb3B1cE9wZW4oKTtcblxuICAgIHZhciBwb3B1cENsb3NlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zMy1idG4tY2xvc2VcIik7XG4gICAgcG9wdXBDbG9zZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIFdpbmRvdyA9IG5ldyBuZXdXaW5kb3coKTtcbiAgICAgICAgV2luZG93LnBvcHVwQ2xvc2UoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB2YXIgcG9wdXBDbG9zZTIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNhbmNlbFBvcHVwXCIpO1xuICAgIHBvcHVwQ2xvc2UyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgV2luZG93ID0gbmV3IG5ld1dpbmRvdygpO1xuICAgICAgICBXaW5kb3cucG9wdXBDbG9zZSgpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHZhciBwb3B1cENsZWFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb25maXJtUG9wdXBcIik7XG4gICAgcG9wdXBDbGVhci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIFdpbmRvdyA9IG5ldyBuZXdXaW5kb3coKTtcbiAgICAgICAgV2luZG93LmNsZWFyQWxsKCk7XG4gICAgICAgIFdpbmRvdy5wb3B1cENsb3NlKCk7XG4gICAgfSwgZmFsc2UpO1xuXG59LCBmYWxzZSk7XG5cblxudmFyIGRvY2tNZW1vcnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeUJ1dHRvblwiKTtcblxuZG9ja01lbW9yeS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBXaW5kb3cgPSBuZXcgbmV3V2luZG93KCk7XG4gICAgV2luZG93LmdlbldpbmRvdygpO1xuICAgIFdpbmRvdy5uZXdXaW5kb3coKTtcbiAgICB2YXIgbmV3TWVtb3J5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdGFydE1lbW9yeVwiKTtcbiAgICBuZXdNZW1vcnkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgZ2FtZSA9IG5ldyBNZW1vcnkoNCwgNCk7XG4gICAgICAgIGdhbWUuY2xlYXIoKTtcbiAgICAgICAgZ2FtZS5zdGFydEdhbWUoKTtcbiAgICB9LCBmYWxzZSk7XG59LCBmYWxzZSk7XG5cblxudmFyIGRvY2tDaGF0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjaGF0QnV0dG9uXCIpO1xuXG5kb2NrQ2hhdC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBXaW5kb3cgPSBuZXcgbmV3V2luZG93KCk7XG4gICAgV2luZG93LmdlbkNoYXQoKTtcbiAgICBXaW5kb3cubmV3V2luZG93KCk7XG4gICAgdmFyIE15Q2hhdCA9IG5ldyBDaGF0KCk7XG4gICAgTXlDaGF0LnNlcnZlcigpO1xufSwgZmFsc2UpO1xuXG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFRhc2tCYXIgPSBmdW5jdGlvbigpIHtcbn07XG5cbi8qKlxuICpcbiAqL1xuVGFza0Jhci5wcm90b3R5cGUuZG9ja0JhciA9IGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIGFkZFByZXZDbGFzcyAoZSkge1xuICAgICAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgICAgIGlmKHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJzcmNcIikpIHtcbiAgICAgICAgICAgIHZhciBsaSA9IHRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICB2YXIgcHJldkxpID0gbGkucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICAgICAgICAgIGlmKHByZXZMaSkge1xuICAgICAgICAgICAgICAgIHByZXZMaS5jbGFzc05hbWUgPSBcInByZXZcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJldkxpKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXZMaS5yZW1vdmVBdHRyaWJ1dGUoXCJjbGFzc1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgcHJldkxpMiA9IHRhcmdldC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgaWYocHJldkxpMikge1xuICAgICAgICAgICAgICAgIHByZXZMaTIuY2xhc3NOYW1lID0gXCJwcmV2XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChwcmV2TGkyKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXZMaTIucmVtb3ZlQXR0cmlidXRlKFwiY2xhc3NcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRvY2tcIikuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLCBhZGRQcmV2Q2xhc3MsIGZhbHNlKTtcbiAgICB9XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gVGFza0JhcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENvZGUgYmFzZWQgb2YgdGhpcyBzb3VyY2UgXCJodHRwOi8vY29kZXBlbi5pby90aGViYWJ5ZGluby9wZW4vQWZhbXNcIi5cbiAqL1xudmFyIFdpbmRvdyA9IGZ1bmN0aW9uKCkge1xufTtcblxuXG5XaW5kb3cucHJvdG90eXBlLm5ld1dpbmRvdyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwb2ludCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9pbnRcIik7XG4gICAgdmFyIHAxID0ge1xuICAgICAgICB4OiBwYXJzZUludChwb2ludC5kYXRhc2V0LngsIDEwKSxcbiAgICAgICAgeTogcGFyc2VJbnQocG9pbnQuZGF0YXNldC55LCAxMClcbiAgICB9O1xuICAgIHZhciBwMCA9IHtcbiAgICAgICAgeDogcGFyc2VJbnQocG9pbnQuZGF0YXNldC54LCAxMCksXG4gICAgICAgIHk6IHBhcnNlSW50KHBvaW50LmRhdGFzZXQueSwgMTApXG4gICAgfTtcbiAgICB2YXIgY29vcmRzID0ge1xuICAgICAgICB4OiBwYXJzZUludChwb2ludC5kYXRhc2V0LngsIDEwKSxcbiAgICAgICAgeTogcGFyc2VJbnQocG9pbnQuZGF0YXNldC55LCAxMClcbiAgICB9O1xuICAgIHZhciBmbGFnO1xuXG4gICAgdmFyIGRyYWcgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIHAxID0ge3g6IGUuY2xpZW50WCwgeTogZS5jbGllbnRZfTtcblxuICAgICAgICBwb2ludC5kYXRhc2V0LnggPSBjb29yZHMueCArIHAxLnggLSBwMC54O1xuICAgICAgICBwb2ludC5kYXRhc2V0LnkgPSBjb29yZHMueSArIHAxLnkgLSBwMC55O1xuXG4gICAgICAgIHBvaW50LnN0eWxlW1wiLXdlYmtpdC10cmFuc2Zvcm1cIl0gPVxuICAgICAgICAgICAgXCJ0cmFuc2xhdGUoXCIgKyBwb2ludC5kYXRhc2V0LnggKyBcInB4LCBcIiArIHBvaW50LmRhdGFzZXQueSArIFwicHgpXCI7XG4gICAgICAgIHBvaW50LnN0eWxlLnRyYW5zZm9ybSA9XG4gICAgICAgICAgICBcInRyYW5zbGF0ZShcIiArIHBvaW50LmRhdGFzZXQueCArIFwicHgsIFwiICsgcG9pbnQuZGF0YXNldC55ICsgXCJweClcIjtcbiAgICB9O1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgdCA9IGUudGFyZ2V0O1xuXG4gICAgICAgIGlmICh0ID09PSBwb2ludCkge1xuICAgICAgICAgICAgcDAgPSB7eDogZS5jbGllbnRYLCB5OiBlLmNsaWVudFl9O1xuICAgICAgICAgICAgZmxhZyA9IHRydWU7XG5cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGRyYWcsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZsYWcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sIGZhbHNlKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGZsYWcpIHtcbiAgICAgICAgICAgIGNvb3Jkcy54ICs9IHAxLnggLSBwMC54O1xuICAgICAgICAgICAgY29vcmRzLnkgKz0gcDEueSAtIHAwLnk7XG4gICAgICAgIH1cblxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBkcmFnLCBmYWxzZSk7XG4gICAgfSwgZmFsc2UpO1xuXG59O1xuXG5cbldpbmRvdy5wcm90b3R5cGUuZ2VuV2luZG93ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGFpbmVyXCIpO1xuICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5V2luZG93XCIpO1xuICAgIHZhciBhID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYSk7XG59O1xuXG5XaW5kb3cucHJvdG90eXBlLmdlbkNoYXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250YWluZXJcIik7XG4gICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjaGF0V2luZG93XCIpO1xuICAgIHZhciBhID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYSk7XG59O1xuXG5cbldpbmRvdy5wcm90b3R5cGUuY2xlYXJBbGwgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRhaW5lclwiKTtcbiAgICBpZiAoZWwpIHtcbiAgICAgICAgd2hpbGUgKGVsLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgZWwucmVtb3ZlQ2hpbGQoZWwubGFzdENoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbldpbmRvdy5wcm90b3R5cGUucG9wdXBPcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwb3B1cFwiKS5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIjtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI292ZXJsYXlcIikuc3R5bGUuZGlzcGxheT1cImJsb2NrXCI7XG59O1xuXG5XaW5kb3cucHJvdG90eXBlLnBvcHVwQ2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BvcHVwXCIpLnN0eWxlLmRpc3BsYXk9XCJub25lXCI7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvdmVybGF5XCIpLnN0eWxlLmRpc3BsYXk9XCJub25lXCI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdpbmRvdztcbiJdfQ==
