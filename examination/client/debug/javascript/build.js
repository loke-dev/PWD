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

},{"./Memory":3,"./Settings":4,"./taskbar":6,"./window":7}],3:[function(require,module,exports){
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

var Settings = function() {
};

/**
 * Change the background image
 */
Settings.prototype.background = function() {
    var background1 = document.querySelector(".background1");
    background1.addEventListener("click", function() {
        document.querySelector("html").style.backgroundImage = "url('/image/background.jpg')";
    }, false);

    var background2 = document.querySelector(".background2");
    background2.addEventListener("click", function() {
        document.querySelector("html").style.backgroundImage = "url('/image/background1.jpg')";
    }, false);

    var background3 = document.querySelector(".background3");
    background3.addEventListener("click", function() {
        document.querySelector("html").style.backgroundImage = "url('/image/background2.jpg')";
    }, false);

    var background4 = document.querySelector(".background4");
    background4.addEventListener("click", function() {
        document.querySelector("html").style.backgroundImage = "url('/image/background3.jpg')";
    }, false);

    var background5 = document.querySelector(".background5");
    background5.addEventListener("click", function() {
        document.querySelector("html").style.backgroundImage = "url('/image/background4.jpg')";
    }, false);

    var background6 = document.querySelector(".background6");
    background6.addEventListener("click", function() {
        document.querySelector("html").style.backgroundImage = "url('/image/background5.jpg')";
    }, false);
};

module.exports = Settings;

},{}],5:[function(require,module,exports){
"use strict";

var Desktop = require("./Desktop");
var desktop = new Desktop();
desktop.generate();

/*
TODO: 3'rd app: Notepad?
TODO: Settings app
 */

},{"./Desktop":2}],6:[function(require,module,exports){
"use strict";

var TaskBar = function() {
};

/**
 * Handles the dockbar
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

},{}],7:[function(require,module,exports){
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


},{"./Chat":1}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvRGVza3RvcC5qcyIsImNsaWVudC9zb3VyY2UvanMvTWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9TZXR0aW5ncy5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy90YXNrYmFyLmpzIiwiY2xpZW50L3NvdXJjZS9qcy93aW5kb3cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBDaGF0ID0gZnVuY3Rpb24odXNlcm5hbWUsIGVsZW1lbnQpIHtcbiAgICB0aGlzLmNoYXRCb3ggPSBcIlwiO1xuICAgIHRoaXMuc29ja2V0ID0gbmV3IFdlYlNvY2tldChcIndzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvXCIpO1xuICAgIHRoaXMudXNlcm5hbWUgPSB1c2VybmFtZSB8fCBcIkxva2VcIjtcbiAgICB0aGlzLmNoYW5uZWwgPSBcIlwiO1xuICAgIHRoaXMua2V5ID0gXCJlREJFNzZkZVU3TDBIOW1FQmd4VUtWUjBWQ25xMFhCZFwiO1xuICAgIHRoaXMuZGF0YSA9IHt9O1xuICAgIHRoaXMubWVzc2FnZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnRleHRBcmVhID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG59O1xuXG4vKipcbiAqXG4gKi9cbkNoYXQucHJvdG90eXBlLnNlcnZlciA9IGZ1bmN0aW9uKCkge1xuXG4gICAgLy9FdmVudExpc3RlbmVyIGZvciB3aGVuIGNvbW11bmljYXRpb24gaXMgb3BlblxuICAgIHRoaXMuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VuZENoYXQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5zZW5kQ2hhdFwiKTtcbiAgICAgICAgc2VuZENoYXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gICAgICAgIHZhciBlbnRlckNoYXQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5jaGF0Qm94XCIpO1xuICAgICAgICBlbnRlckNoYXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBlLndoaWNoIHx8IGUua2V5Q29kZTtcbiAgICAgICAgICAgIGlmIChrZXkgPT09IDEzKSB7IC8vIDEzIGlzIGVudGVyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLnNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICBpZiAodGhpcy5tZXNzYWdlLmRhdGEgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMubWVzc2FnZS51c2VybmFtZSArIFwiOiBcIiArIHRoaXMubWVzc2FnZS5kYXRhKTtcbiAgICAgICAgICAgIHZhciBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgICAgIGxpLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMubWVzc2FnZS51c2VybmFtZSArIFwiOiBcIiArIHRoaXMubWVzc2FnZS5kYXRhKSk7XG4gICAgICAgICAgICB0aGlzLnRleHRBcmVhID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGV4dEFyZWFcIik7XG4gICAgICAgICAgICB0aGlzLnRleHRBcmVhLmFwcGVuZENoaWxkKGxpKTtcblxuICAgICAgICAgICAgLy9TY3JvbGxzIGRvd24gd2hlbiBuZXcgbWVzc2FnZSBpcyBhcnJpdmVkXG4gICAgICAgICAgICB2YXIgY2hhdEVsID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGV4dENvbnRhaW5lclwiKTtcbiAgICAgICAgICAgIGNoYXRFbC5zY3JvbGxUb3AgPSBjaGF0RWwuc2Nyb2xsSGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuQ2hhdC5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY2hhdEJveCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmNoYXRCb3hcIik7XG4gICAgdGhpcy5kYXRhID0ge1xuICAgICAgICB0eXBlOiBcIm1lc3NhZ2VcIixcbiAgICAgICAgZGF0YTogdGhpcy5jaGF0Qm94LnZhbHVlLFxuICAgICAgICB1c2VybmFtZTogdGhpcy51c2VybmFtZSxcbiAgICAgICAgY2hhbm5lbDogdGhpcy5jaGFubmVsLFxuICAgICAgICBrZXk6IHRoaXMua2V5XG4gICAgfTtcbiAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YSkpO1xuICAgIHRoaXMuY2hhdEJveC52YWx1ZSA9IFwiXCI7XG4gICAgdGhpcy5jaGF0Qm94LmZvY3VzKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdpbmRvdyA9IHJlcXVpcmUoXCIuL3dpbmRvd1wiKTtcbnZhciBNZW1vcnkgPSByZXF1aXJlKFwiLi9NZW1vcnlcIik7XG52YXIgVGFza0JhciA9IHJlcXVpcmUoXCIuL3Rhc2tiYXJcIik7XG52YXIgU2V0dGluZ3MgPSByZXF1aXJlKFwiLi9TZXR0aW5nc1wiKTtcblxudmFyIERlc2t0b3AgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVsZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmlkID0gdW5kZWZpbmVkO1xuICAgIHRoaXMubnVtYmVyID0gMDtcbiAgICB0aGlzLnVzZXJuYW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuc291bmQgPSBuZXcgQXVkaW8oXCJodHRwOi8vNS4xMDEuMTAwLjEwNy9ic29kLndhdlwiKTtcbn07XG5cbkRlc2t0b3AucHJvdG90eXBlLmdlbmVyYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIE1lbnUgPSBuZXcgVGFza0JhcigpO1xuICAgIE1lbnUuZG9ja0JhcigpO1xuICAgIHZhciBpbml0V2luZG93ID0gbmV3IFdpbmRvdygpO1xuICAgIGluaXRXaW5kb3cucG9wdXBDbG9zZSgpO1xuXG4gICAgdmFyIGRvY2tDbGVhckFsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2xlYXJBbGxCdXR0b25cIik7XG4gICAgZG9ja0NsZWFyQWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyIGRyYWdXaW5kb3cgPSBuZXcgV2luZG93KCk7XG4gICAgZHJhZ1dpbmRvdy5wb3B1cE9wZW4oKTtcblxuICAgIHZhciBwb3B1cENsb3NlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zMy1idG4tY2xvc2VcIik7XG4gICAgcG9wdXBDbG9zZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIGRyYWdXaW5kb3cgPSBuZXcgV2luZG93KCk7XG4gICAgICAgIGRyYWdXaW5kb3cucG9wdXBDbG9zZSgpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHZhciBwb3B1cENsb3NlMiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2FuY2VsUG9wdXBcIik7XG4gICAgcG9wdXBDbG9zZTIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBkcmFnV2luZG93ID0gbmV3IFdpbmRvdygpO1xuICAgICAgICBkcmFnV2luZG93LnBvcHVwQ2xvc2UoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB2YXIgcG9wdXBDbGVhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29uZmlybVBvcHVwXCIpO1xuICAgIHBvcHVwQ2xlYXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBkcmFnV2luZG93ID0gbmV3IFdpbmRvdygpO1xuICAgICAgICBkcmFnV2luZG93LmNsZWFyQWxsKCk7XG4gICAgICAgIGRyYWdXaW5kb3cucG9wdXBDbG9zZSgpO1xuICAgIH0sIGZhbHNlKTtcblxufSwgZmFsc2UpO1xuXG4gICAgdmFyIGRvY2tNZW1vcnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeUJ1dHRvblwiKTtcblxuICAgIGRvY2tNZW1vcnkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRhaW5lclwiKTtcbiAgICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNpbml0aWFsTWVtb3J5XCIpO1xuICAgICAgICB2YXIgdGVtcCA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuaWQgPSBcImlkLVwiICsgdGhpcy5udW1iZXIudG9TdHJpbmcoKTtcbiAgICAgICAgdGVtcC5maXJzdEVsZW1lbnRDaGlsZC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0aGlzLmlkKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRlbXApO1xuICAgICAgICB0aGlzLmVsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWQpO1xuICAgICAgICB0aGlzLm51bWJlciArPSAxO1xuICAgICAgICB2YXIgZ2FtZSA9IG5ldyBNZW1vcnkodGhpcy5lbGUpO1xuICAgICAgICBnYW1lLm1lbW9yeSgpO1xuICAgICAgICB2YXIgZHJhZ1dpbmRvdyA9IG5ldyBXaW5kb3codGhpcy5lbGUpO1xuICAgICAgICBkcmFnV2luZG93Lm5ld1dpbmRvdygpO1xuICAgICAgICB0aGlzLmNsb3NlKGRyYWdXaW5kb3cpO1xuICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gICAgdmFyIGRvY2tDaGF0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjaGF0QnV0dG9uXCIpO1xuXG4gICAgZG9ja0NoYXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRhaW5lclwiKTtcbiAgICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNpbml0aWFsQ2hhdFwiKTtcbiAgICAgICAgdmFyIHRlbXAgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICB0aGlzLmlkID0gXCJpZC1cIiArIHRoaXMubnVtYmVyLnRvU3RyaW5nKCk7XG4gICAgICAgIHRlbXAuZmlyc3RFbGVtZW50Q2hpbGQuc2V0QXR0cmlidXRlKFwiaWRcIiwgdGhpcy5pZCk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ZW1wKTtcbiAgICAgICAgdGhpcy5lbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkKTtcbiAgICAgICAgdGhpcy5udW1iZXIgKz0gMTtcbiAgICAgICAgdmFyIGRyYWdXaW5kb3cgPSBuZXcgV2luZG93KHRoaXMuZWxlKTtcbiAgICAgICAgZHJhZ1dpbmRvdy5uZXdXaW5kb3coKTtcbiAgICAgICAgZHJhZ1dpbmRvdy5nZW5DaGF0KCk7XG4gICAgICAgIHRoaXMuY2xvc2UoZHJhZ1dpbmRvdyk7XG4gICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgICB2YXIgZG9ja0V4cGxvcmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNleHBsb3JlckJ1dHRvblwiKTtcblxuICAgIGRvY2tFeHBsb3Jlci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5zb3VuZC5wbGF5KCk7XG4gICAgICAgIHZhciBic29kID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ic29kXCIpO1xuICAgICAgICBic29kLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBic29kLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcblxuICAgIHZhciBndWVzdGJvb2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2d1ZXN0Qm9va0J1dHRvblwiKTtcblxuICAgIGd1ZXN0Ym9vay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIGNsaWNrT25jZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ3Vlc3Rib29rXCIpO1xuICAgICAgICBpZiAoIWNsaWNrT25jZSkge1xuICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNndWVzdGJvb2tcIik7XG4gICAgICAgICAgICB2YXIgdGVtcCA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmlkID0gXCJpZC1cIiArIHRoaXMubnVtYmVyLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB0ZW1wLmZpcnN0RWxlbWVudENoaWxkLnNldEF0dHJpYnV0ZShcImlkXCIsIHRoaXMuaWQpO1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRlbXApO1xuICAgICAgICAgICAgdGhpcy5lbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkKTtcbiAgICAgICAgICAgIHRoaXMubnVtYmVyICs9IDE7XG4gICAgICAgICAgICB2YXIgZHJhZ1dpbmRvdyA9IG5ldyBXaW5kb3codGhpcy5lbGUpO1xuICAgICAgICAgICAgZHJhZ1dpbmRvdy5uZXdXaW5kb3coKTtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoZHJhZ1dpbmRvdyk7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcblxuICAgIHZhciBzZXR0aW5ncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2V0dGluZ3NCdXR0b25cIik7XG5cbiAgICBzZXR0aW5ncy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIGNsaWNrT25jZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2V0dGluZ3NcIik7XG4gICAgICAgIGlmICghY2xpY2tPbmNlKSB7XG4gICAgICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250YWluZXJcIik7XG4gICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NldHRpbmdzXCIpO1xuICAgICAgICAgICAgdmFyIHRlbXAgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5pZCA9IFwiaWQtXCIgKyB0aGlzLm51bWJlci50b1N0cmluZygpO1xuICAgICAgICAgICAgdGVtcC5maXJzdEVsZW1lbnRDaGlsZC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0aGlzLmlkKTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ZW1wKTtcbiAgICAgICAgICAgIHRoaXMuZWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCk7XG4gICAgICAgICAgICB0aGlzLm51bWJlciArPSAxO1xuICAgICAgICAgICAgdmFyIGRyYWdXaW5kb3cgPSBuZXcgV2luZG93KHRoaXMuZWxlKTtcbiAgICAgICAgICAgIGRyYWdXaW5kb3cubmV3V2luZG93KCk7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKGRyYWdXaW5kb3cpO1xuICAgICAgICAgICAgdmFyIGJhY2tncm91bmQgPSBuZXcgU2V0dGluZ3MoKTtcbiAgICAgICAgICAgIGJhY2tncm91bmQuYmFja2dyb3VuZCgpO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG59O1xuXG5EZXNrdG9wLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKHdpbmRvdykge1xuICAgIHZhciBjbG9zZSA9IHRoaXMuZWxlLnF1ZXJ5U2VsZWN0b3IoXCIuY2xvc2VcIik7XG4gICAgY2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHdpbmRvdy5jbG9zZUN1cnJlbnQoKTtcbiAgICB9LCBmYWxzZSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERlc2t0b3A7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBNZW1vcnkgY29uc3RydWN0b3JcbiAqIEBwYXJhbSBlbGUgLSBDdXJyZW50IGVsZW1lbnRcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgTWVtb3J5ID0gZnVuY3Rpb24oZWxlKSB7XG4gICAgdGhpcy5yb3dzID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuY29scyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGU7XG4gICAgdGhpcy5hcnIgPSBbXTtcbiAgICB0aGlzLnR1cm4xID0gXCJcIjtcbiAgICB0aGlzLnR1cm4yID0gXCJcIjtcbiAgICB0aGlzLmxhc3RUaWxlID0gXCJcIjtcbiAgICB0aGlzLnRyaWVzID0gMDtcbiAgICB0aGlzLnBhaXJzID0gMDtcbn07XG5cbi8qKlxuICogRXZlbnRsaXN0ZW5lciBmb3IgdGhlIHN0YXJ0IGJ1dHRvblxuICovXG5NZW1vcnkucHJvdG90eXBlLm1lbW9yeSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBtZW1vcnlCdXR0b24gPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdGFydE1lbW9yeVwiKTtcbiAgICBtZW1vcnlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBtZW1vcnlTaXplID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5U2l6ZVwiKTtcbiAgICAgICAgdmFyIGNob3NlblNpemUgPSBtZW1vcnlTaXplLm9wdGlvbnNbbWVtb3J5U2l6ZS5zZWxlY3RlZEluZGV4XS52YWx1ZTtcblxuICAgICAgICBpZiAoY2hvc2VuU2l6ZSA9PT0gXCIxNlwiKSB7XG4gICAgICAgICAgICB0aGlzLnJvd3MgPSA0O1xuICAgICAgICAgICAgdGhpcy5jb2xzID0gNDtcbiAgICAgICAgfSBlbHNlIGlmIChjaG9zZW5TaXplID09PSBcIjhcIikge1xuICAgICAgICAgICAgdGhpcy5yb3dzID0gMjtcbiAgICAgICAgICAgIHRoaXMuY29scyA9IDQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJvd3MgPSAyO1xuICAgICAgICAgICAgdGhpcy5jb2xzID0gMjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RhcnRHYW1lKCk7XG4gICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG59O1xuXG4vKipcbiAqIFN0YXJ0aW5nIHBvaW50IG9mIHRoZSBnYW1lXG4gKi9cbk1lbW9yeS5wcm90b3R5cGUuc3RhcnRHYW1lID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5jbGVhcigpO1xuICAgIHRoaXMuY3JlYXRlQXJyYXkoKTtcbiAgICB0aGlzLmNyZWF0ZUJvYXJkKCk7XG59O1xuXG4vKipcbiAqIENsZWFyIHRoZSBtZW1vcnkgcGxheSBhcmVhIGFuZCB2YXJpYWJsZXMgdGhhdCBzYXZlcyBhIHZhbHVlXG4gKi9cbk1lbW9yeS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW1vcnlDb250YWluZXJcIik7XG4gICAgaWYgKGVsKSB7XG4gICAgICAgIHdoaWxlIChlbC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUNoaWxkKGVsLmxhc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFyciA9IFtdO1xuICAgIHRoaXMudHVybjEgPSBcIlwiO1xuICAgIHRoaXMudHVybjIgPSBcIlwiO1xuICAgIHRoaXMubGFzdFRpbGUgPSBcIlwiO1xuICAgIHRoaXMudHJpZXMgPSAwO1xuICAgIHRoaXMucGFpcnMgPSAwO1xufTtcblxuLyoqXG4gKiBEeW5hbWljYWxseSBjcmVhdGVzIHRoZSBib2FyZFxuICovXG5NZW1vcnkucHJvdG90eXBlLmNyZWF0ZUJvYXJkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeUNvbnRhaW5lclwiKTtcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI21lbW9yeVRlbXBsYXRlXCIpWzBdLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgdmFyIGE7XG5cbiAgICB0aGlzLmFyci5mb3JFYWNoKGZ1bmN0aW9uKHRpbGUsIGluZGV4KSB7XG4gICAgICAgIGEgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLCB0cnVlKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGEpO1xuICAgICAgICBpZiAoKGluZGV4ICsgMSkgJSB0aGlzLmNvbHMgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgYS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgaW1nID0gZXZlbnQudGFyZ2V0Lm5vZGVOYW1lID09PSBcIklNR1wiID8gZXZlbnQudGFyZ2V0IDogZXZlbnQudGFyZ2V0LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICAgICAgdGhpcy50dXJuQnJpY2sodGlsZSwgaW5kZXgsIGltZyk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbn07XG5cbi8qKlxuICogRHluYW1pY2FsbHkgY3JlYXRlcyB0aGUgYXJyYXkgZm9yIHRoZSBzZWxlY3Rpb24gb2YgaW1hZ2VzXG4gKi9cbk1lbW9yeS5wcm90b3R5cGUuY3JlYXRlQXJyYXkgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8PSAoKHRoaXMucm93cyAqIHRoaXMuY29scykgLyAyKTsgaSArPSAxKSB7XG4gICAgICAgIHRoaXMuYXJyLnB1c2goaSk7XG4gICAgICAgIHRoaXMuYXJyLnB1c2goaSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc2h1ZmZsZSh0aGlzLmFycik7XG59O1xuXG5NZW1vcnkucHJvdG90eXBlLnR1cm5CcmljayA9IGZ1bmN0aW9uKHRpbGUsIGluZGV4LCBpbWcpIHtcbiAgICBpZiAodGhpcy50dXJuMikgeyByZXR1cm47IH1cblxuICAgIGltZy5zcmMgPSBcImltYWdlL1wiICsgdGlsZSArIFwiLnBuZ1wiO1xuXG4gICAgaWYgKCF0aGlzLnR1cm4xKSB7XG4gICAgICAgIHRoaXMudHVybjEgPSBpbWc7XG4gICAgICAgIHRoaXMubGFzdFRpbGUgPSB0aWxlO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGltZyA9PT0gdGhpcy50dXJuMSkgeyByZXR1cm47IH1cblxuICAgICAgICB0aGlzLnRyaWVzICs9IDE7XG5cbiAgICAgICAgdGhpcy50dXJuMiA9IGltZztcblxuICAgICAgICBpZiAodGlsZSA9PT0gdGhpcy5sYXN0VGlsZSkge1xuICAgICAgICAgICAgdGhpcy5wYWlycyArPSAxO1xuICAgICAgICAgICAgaWYgKHRoaXMucGFpcnMgPT09ICh0aGlzLmNvbHMgKiB0aGlzLnJvd3MpIC8gMikge1xuICAgICAgICAgICAgICAgIHZhciBlbCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeUNvbnRhaW5lclwiKTtcbiAgICAgICAgICAgICAgICBpZiAoZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGVsLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWwucmVtb3ZlQ2hpbGQoZWwubGFzdENoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMud2luKCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJXb24gb24gXCIgKyB0aGlzLnRyaWVzICsgXCIgbnVtYmVyIG9mIHRyaWVzIVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoXCJyZW1vdmVkXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjIucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKFwicmVtb3ZlZFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4xID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4yID0gbnVsbDtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgMzAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjEuc3JjID0gXCJpbWFnZS8wLnBuZ1wiO1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjIuc3JjID0gXCJpbWFnZS8wLnBuZ1wiO1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjEgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjIgPSBudWxsO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCA1MDApO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiBUaGlzIHByb3RvdHlwZSBoYW5kbGVzIHRoZSBzaHVmZmxpbmcgb2YgdGhlIGRlY2tcbiAqIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjQ1MDk1NC9ob3ctdG8tcmFuZG9taXplLXNodWZmbGUtYS1qYXZhc2NyaXB0LWFycmF5XG4gKiBAcGFyYW0gaW5kZXhBcnIgLSB0aGUgYXJyYXkgdG8gYmUgc2h1ZmZsZWRcbiAqIEByZXR1cm5zIHsqfVxuICovXG5NZW1vcnkucHJvdG90eXBlLnNodWZmbGUgPSBmdW5jdGlvbihpbmRleEFycikge1xuICAgIHZhciBhcnJheSA9IGluZGV4QXJyO1xuICAgIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGg7XG4gICAgdmFyIHRlbXBvcmFyeVZhbHVlO1xuICAgIHZhciByYW5kb21JbmRleDtcblxuICAgIHdoaWxlIChjdXJyZW50SW5kZXggIT09IDApIHtcblxuICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XG4gICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xuXG4gICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcbiAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcbiAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5O1xuXG59O1xuXG5NZW1vcnkucHJvdG90eXBlLndpbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb250YWluZXIgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW1vcnlDb250YWluZXJcIik7XG4gICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNtZW1vcnlXaW5cIilbMF0uY29udGVudDtcbiAgICB2YXIgYSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUsIHRydWUpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChhKTtcblxuICAgIHZhciBtZW1vcnlXaW5UcmllcyA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeVdpblRyaWVzXCIpO1xuICAgIHZhciBiID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJXb24gb24gXCIgKyB0aGlzLnRyaWVzICsgXCIgbnVtYmVyIG9mIHRyaWVzIVwiKTtcbiAgICBtZW1vcnlXaW5Ucmllcy5hcHBlbmRDaGlsZChiKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWVtb3J5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBTZXR0aW5ncyA9IGZ1bmN0aW9uKCkge1xufTtcblxuLyoqXG4gKiBDaGFuZ2UgdGhlIGJhY2tncm91bmQgaW1hZ2VcbiAqL1xuU2V0dGluZ3MucHJvdG90eXBlLmJhY2tncm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYmFja2dyb3VuZDEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJhY2tncm91bmQxXCIpO1xuICAgIGJhY2tncm91bmQxLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImh0bWxcIikuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy9pbWFnZS9iYWNrZ3JvdW5kLmpwZycpXCI7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgdmFyIGJhY2tncm91bmQyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5iYWNrZ3JvdW5kMlwiKTtcbiAgICBiYWNrZ3JvdW5kMi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJodG1sXCIpLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcvaW1hZ2UvYmFja2dyb3VuZDEuanBnJylcIjtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB2YXIgYmFja2dyb3VuZDMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJhY2tncm91bmQzXCIpO1xuICAgIGJhY2tncm91bmQzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImh0bWxcIikuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy9pbWFnZS9iYWNrZ3JvdW5kMi5qcGcnKVwiO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHZhciBiYWNrZ3JvdW5kNCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmFja2dyb3VuZDRcIik7XG4gICAgYmFja2dyb3VuZDQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaHRtbFwiKS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnL2ltYWdlL2JhY2tncm91bmQzLmpwZycpXCI7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgdmFyIGJhY2tncm91bmQ1ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5iYWNrZ3JvdW5kNVwiKTtcbiAgICBiYWNrZ3JvdW5kNS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJodG1sXCIpLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcvaW1hZ2UvYmFja2dyb3VuZDQuanBnJylcIjtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB2YXIgYmFja2dyb3VuZDYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJhY2tncm91bmQ2XCIpO1xuICAgIGJhY2tncm91bmQ2LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImh0bWxcIikuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy9pbWFnZS9iYWNrZ3JvdW5kNS5qcGcnKVwiO1xuICAgIH0sIGZhbHNlKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0dGluZ3M7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERlc2t0b3AgPSByZXF1aXJlKFwiLi9EZXNrdG9wXCIpO1xudmFyIGRlc2t0b3AgPSBuZXcgRGVza3RvcCgpO1xuZGVza3RvcC5nZW5lcmF0ZSgpO1xuXG4vKlxuVE9ETzogMydyZCBhcHA6IE5vdGVwYWQ/XG5UT0RPOiBTZXR0aW5ncyBhcHBcbiAqL1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBUYXNrQmFyID0gZnVuY3Rpb24oKSB7XG59O1xuXG4vKipcbiAqIEhhbmRsZXMgdGhlIGRvY2tiYXJcbiAqL1xuVGFza0Jhci5wcm90b3R5cGUuZG9ja0JhciA9IGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIGFkZFByZXZDbGFzcyhlKSB7XG4gICAgICAgIHZhciB0YXJnZXQgPSBlLnRhcmdldDtcbiAgICAgICAgaWYgKHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJzcmNcIikpIHtcbiAgICAgICAgICAgIHZhciBsaSA9IHRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICB2YXIgcHJldkxpID0gbGkucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICAgICAgICAgIGlmIChwcmV2TGkpIHtcbiAgICAgICAgICAgICAgICBwcmV2TGkuY2xhc3NOYW1lID0gXCJwcmV2XCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByZXZMaSkge1xuICAgICAgICAgICAgICAgICAgICBwcmV2TGkucmVtb3ZlQXR0cmlidXRlKFwiY2xhc3NcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHByZXZMaTIgPSB0YXJnZXQucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICAgICAgICAgIGlmIChwcmV2TGkyKSB7XG4gICAgICAgICAgICAgICAgcHJldkxpMi5jbGFzc05hbWUgPSBcInByZXZcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJldkxpMikge1xuICAgICAgICAgICAgICAgICAgICBwcmV2TGkyLnJlbW92ZUF0dHJpYnV0ZShcImNsYXNzXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRvY2tcIikuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLCBhZGRQcmV2Q2xhc3MsIGZhbHNlKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRhc2tCYXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIENoYXQgPSByZXF1aXJlKFwiLi9DaGF0XCIpO1xuXG4vKipcbiAqIE1vdmUgZnVuY3Rpb24gYmFzZWQgb2YgdGhpcyBzb3VyY2UgXCJodHRwOi8vY29kZXBlbi5pby90aGViYWJ5ZGluby9wZW4vQWZhbXNcIi5cbiAqL1xudmFyIFdpbmRvdyA9IGZ1bmN0aW9uKGVsZSkge1xuICAgIHRoaXMuZWxlID0gZWxlO1xuICAgIHRoaXMudXNlcm5hbWUgPSB1bmRlZmluZWQ7XG59O1xuXG5XaW5kb3cucHJvdG90eXBlLmNsb3NlQ3VycmVudCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZWxlLnJlbW92ZSgpO1xufTtcblxuV2luZG93LnByb3RvdHlwZS5uZXdXaW5kb3cgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZWxlbWVudCA9IHRoaXMuZWxlO1xuICAgIHZhciBwMSA9IHtcbiAgICAgICAgeDogcGFyc2VJbnQoZWxlbWVudC5kYXRhc2V0LngsIDEwKSxcbiAgICAgICAgeTogcGFyc2VJbnQoZWxlbWVudC5kYXRhc2V0LnksIDEwKVxuICAgIH07XG4gICAgdmFyIHAwID0ge1xuICAgICAgICB4OiBwYXJzZUludChlbGVtZW50LmRhdGFzZXQueCwgMTApLFxuICAgICAgICB5OiBwYXJzZUludChlbGVtZW50LmRhdGFzZXQueSwgMTApXG4gICAgfTtcbiAgICB2YXIgY29vcmRzID0ge1xuICAgICAgICB4OiBwYXJzZUludChlbGVtZW50LmRhdGFzZXQueCwgMTApLFxuICAgICAgICB5OiBwYXJzZUludChlbGVtZW50LmRhdGFzZXQueSwgMTApXG4gICAgfTtcbiAgICB2YXIgZmxhZztcblxuICAgIHZhciBkcmFnID0gZnVuY3Rpb24oZSkge1xuICAgICAgICBwMSA9IHt4OiBlLmNsaWVudFgsIHk6IGUuY2xpZW50WX07XG5cbiAgICAgICAgZWxlbWVudC5kYXRhc2V0LnggPSBjb29yZHMueCArIHAxLnggLSBwMC54O1xuICAgICAgICBlbGVtZW50LmRhdGFzZXQueSA9IGNvb3Jkcy55ICsgcDEueSAtIHAwLnk7XG5cbiAgICAgICAgZWxlbWVudC5zdHlsZVtcIi13ZWJraXQtdHJhbnNmb3JtXCJdID1cbiAgICAgICAgICAgIFwidHJhbnNsYXRlKFwiICsgZWxlbWVudC5kYXRhc2V0LnggKyBcInB4LCBcIiArIGVsZW1lbnQuZGF0YXNldC55ICsgXCJweClcIjtcbiAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPVxuICAgICAgICAgICAgXCJ0cmFuc2xhdGUoXCIgKyBlbGVtZW50LmRhdGFzZXQueCArIFwicHgsIFwiICsgZWxlbWVudC5kYXRhc2V0LnkgKyBcInB4KVwiO1xuICAgIH07XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciB0ID0gZS50YXJnZXQ7XG5cbiAgICAgICAgaWYgKHQgPT09IGVsZW1lbnQucXVlcnlTZWxlY3RvcihcImgxXCIpKSB7XG4gICAgICAgICAgICBwMCA9IHt4OiBlLmNsaWVudFgsIHk6IGUuY2xpZW50WX07XG4gICAgICAgICAgICBmbGFnID0gdHJ1ZTtcblxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZHJhZywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZmxhZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChmbGFnKSB7XG4gICAgICAgICAgICBjb29yZHMueCArPSBwMS54IC0gcDAueDtcbiAgICAgICAgICAgIGNvb3Jkcy55ICs9IHAxLnkgLSBwMC55O1xuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZHJhZywgZmFsc2UpO1xuICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xufTtcblxuV2luZG93LnByb3RvdHlwZS5jbGVhckFsbCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGFpbmVyXCIpO1xuICAgIGlmIChlbCkge1xuICAgICAgICB3aGlsZSAoZWwuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICBlbC5yZW1vdmVDaGlsZChlbC5sYXN0Q2hpbGQpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuV2luZG93LnByb3RvdHlwZS5jbGVhcldpbmRvdyA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICB2YXIgZWwgPSBlbGVtZW50O1xuICAgIGlmIChlbCkge1xuICAgICAgICB3aGlsZSAoZWwuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICBlbC5yZW1vdmVDaGlsZChlbC5sYXN0Q2hpbGQpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuV2luZG93LnByb3RvdHlwZS5nZW5DaGF0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGluaXRDaGF0ID0gdGhpcy5lbGUucXVlcnlTZWxlY3RvcihcIi5idXR0b25cIik7XG4gICAgaW5pdENoYXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuc2V0VXNlcm5hbWUoKTtcbiAgICAgICAgdGhpcy5zZXRQbGFjZWhvbGRlcigpO1xuICAgICAgICB0aGlzLmNoYXRGdW5jKCk7XG4gICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgICB2YXIgaW5pdENoYXRFbnRlciA9IHRoaXMuZWxlLnF1ZXJ5U2VsZWN0b3IoXCIudXNlck5hbWVcIik7XG4gICAgaW5pdENoYXRFbnRlci5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIga2V5ID0gZS53aGljaCB8fCBlLmtleUNvZGU7XG4gICAgICAgIGlmIChrZXkgPT09IDEzKSB7IC8vIDEzIGlzIGVudGVyXG4gICAgICAgICAgICB0aGlzLnNldFVzZXJuYW1lKCk7XG4gICAgICAgICAgICB0aGlzLnNldFBsYWNlaG9sZGVyKCk7XG4gICAgICAgICAgICB0aGlzLmNoYXRGdW5jKCk7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcbn07XG5cbldpbmRvdy5wcm90b3R5cGUuY2hhdEZ1bmMgPSBmdW5jdGlvbigpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciB3aW5kb3dDb250YWluZXIgPSB0aGlzLmVsZS5xdWVyeVNlbGVjdG9yKFwiLndpbmRvd0NvbnRhaW5lclwiKTtcbiAgICB2YXIgY2hhdFRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjaGF0V2luZG93XCIpO1xuICAgIHZhciB0ZW1wV2luZG93ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShjaGF0VGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgdGhpcy5jbGVhcldpbmRvdyh3aW5kb3dDb250YWluZXIpO1xuICAgIHdpbmRvd0NvbnRhaW5lci5hcHBlbmRDaGlsZCh0ZW1wV2luZG93KTtcbiAgICB2YXIgTXlDaGF0ID0gbmV3IENoYXQodGhpcy51c2VybmFtZSwgdGhpcy5lbGUpO1xuICAgIE15Q2hhdC5zZXJ2ZXIoKTtcbiAgICB0aGlzLmVsZS5xdWVyeVNlbGVjdG9yKFwiLmNoYXRCb3hcIikuZm9jdXMoKTtcbiAgICB0aGlzLnNhdmVVc2VybmFtZSgpO1xufTtcblxuV2luZG93LnByb3RvdHlwZS5zZXRVc2VybmFtZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsb2NhbFVzZXI7XG4gICAgdmFyIHVzZXJuYW1lID0gdGhpcy5lbGUucXVlcnlTZWxlY3RvcihcIi51c2VyTmFtZVwiKS52YWx1ZTtcblxuICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInVzZXJuYW1lXCIpICE9PSBudWxsKSB7XG4gICAgICAgIGxvY2FsVXNlciA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ1c2VybmFtZVwiKSk7XG4gICAgfVxuXG4gICAgaWYgKHVzZXJuYW1lKSB7XG4gICAgICAgIHRoaXMudXNlcm5hbWUgPSB1c2VybmFtZTtcbiAgICAgICAgY29uc29sZS5sb2coXCJ1c2luZyB0ZXh0IGZpZWxkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudXNlcm5hbWUgPSBsb2NhbFVzZXIgfHwgXCJMb2tlXCI7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidXNpbmcgbG9jYWwgc3RvcmFnZSBvciBkZWZhdWx0XCIpO1xuICAgIH1cbn07XG5cbldpbmRvdy5wcm90b3R5cGUuc2F2ZVVzZXJuYW1lID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHVzZXJuYW1lID0gdGhpcy5lbGUucXVlcnlTZWxlY3RvcihcIi51c2VyTmFtZVwiKTtcbiAgICBpZiAodXNlcm5hbWUudmFsdWUpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ1c2VybmFtZVwiLCBKU09OLnN0cmluZ2lmeSh1c2VybmFtZS52YWx1ZSkpO1xuICAgIH1cbn07XG5cbldpbmRvdy5wcm90b3R5cGUuc2V0UGxhY2Vob2xkZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVsZS5xdWVyeVNlbGVjdG9yKFwiLnVzZXJOYW1lXCIpLnBsYWNlaG9sZGVyID0gdGhpcy51c2VybmFtZTtcbn07XG5cbldpbmRvdy5wcm90b3R5cGUucG9wdXBPcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwb3B1cFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xufTtcblxuV2luZG93LnByb3RvdHlwZS5wb3B1cENsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwb3B1cFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvdmVybGF5XCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gV2luZG93O1xuXG4iXX0=
