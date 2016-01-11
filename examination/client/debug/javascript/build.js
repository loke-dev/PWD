(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/**
 *
 * @param username - Set by the user
 * @param channel - optional channel name
 * @param element - The current opened window
 * @constructor
 */
var Chat = function(username, channel, element) {
    this.chatBox = "";
    this.socket = new WebSocket("ws://vhost3.lnu.se:20080/socket/");
    this.username = username || "Loke";
    this.channel = channel || "";
    this.key = "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd";
    this.data = {};
    this.message = undefined;
    this.textArea = undefined;
    this.element = element;
};

/**
 * Opens up communication to the server and listen if something is sent
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

/**
 * Send the text to the server
 */
Chat.prototype.send = function() {
    this.chatBox = this.element.querySelector(".chatBox");
    this.data = {
        type: "message",
        data: this.chatBox.value,
        username: this.username,
        channel: this.channel,
        key: this.key
    };
    console.log(this.data);
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

/**
 * Main desktop management for mostly eventlisteners
 * @constructor
 */
var Desktop = function() {
    this.ele = undefined;
    this.id = undefined;
    this.number = 0;
    this.username = undefined;
    this.sound = new Audio("http://5.101.100.107/bsod.wav");
    this.index = 1;
};

/**
 * Eventlisteners for the app icons on the dock bar
 */
Desktop.prototype.generate = function() {
    var Menu = new TaskBar();
    Menu.dockBar();
    var initWindow = new Window();
    initWindow.popupClose();

    // Popup for the clear desktop app
    var dockClearAll = document.querySelector("#clearAllButton");
    dockClearAll.addEventListener("click", function(event) {
    event.preventDefault();
    var dragWindow = new Window();
    dragWindow.popupOpen();

    // Close button
    var popupClose = document.querySelector(".s3-btn-close");
    popupClose.addEventListener("click", function(event) {
        event.preventDefault();
        var dragWindow = new Window();
        dragWindow.popupClose();
    }, false);

    //Cancel button
    var popupClose2 = document.querySelector(".cancelPopup");
    popupClose2.addEventListener("click", function(event) {
        event.preventDefault();
        var dragWindow = new Window();
        dragWindow.popupClose();
    }, false);

    // Confirm button
    var popupClear = document.querySelector(".confirmPopup");
    popupClear.addEventListener("click", function(event) {
        event.preventDefault();
        var dragWindow = new Window();
        dragWindow.clearAll();
        dragWindow.popupClose();
    }, false);

}, false);

    //Eventlistener for the memory app on the dock bar
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
        this.zIndex(dragWindow);
    }.bind(this), false);

    //Eventlistener for the chat app on the dock bar
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
        this.zIndex(dragWindow);
    }.bind(this), false);

    //Eventlistener for the explorer app on the dock bar
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

    //Eventlistener for the guestbook app on the dock bar
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
            this.zIndex(dragWindow);
        }
    }.bind(this), false);

    //Eventlistener for the settings app on the dock bar
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
            this.zIndex(dragWindow);
            var background = new Settings();
            background.background();
        }
    }.bind(this), false);
};

/**
 * Close function for the current window
 * @param window - The current app window
 */
Desktop.prototype.close = function(window) {
    var close = this.ele.querySelector(".close");
    close.addEventListener("click", function(event) {
        event.preventDefault();
        window.closeCurrent();
    }, false);
};

/**
 * When a window is clicked it gets the highest z-index
 * @param window - The current app window
 */
Desktop.prototype.zIndex = function(window) {
    window.ele.querySelector("nav").addEventListener("mousedown", function(event) {
        event.preventDefault();
        this.index = this.index + 1;
        window.ele.style.zIndex = this.index;
    }.bind(this), false);
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
 */

},{"./Desktop":2}],6:[function(require,module,exports){
"use strict";

var TaskBar = function() {
};

/**
 * Handles the dockbar hover effect
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


},{"./Chat":1}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvRGVza3RvcC5qcyIsImNsaWVudC9zb3VyY2UvanMvTWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9TZXR0aW5ncy5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy90YXNrYmFyLmpzIiwiY2xpZW50L3NvdXJjZS9qcy93aW5kb3cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0gdXNlcm5hbWUgLSBTZXQgYnkgdGhlIHVzZXJcbiAqIEBwYXJhbSBjaGFubmVsIC0gb3B0aW9uYWwgY2hhbm5lbCBuYW1lXG4gKiBAcGFyYW0gZWxlbWVudCAtIFRoZSBjdXJyZW50IG9wZW5lZCB3aW5kb3dcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgQ2hhdCA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBjaGFubmVsLCBlbGVtZW50KSB7XG4gICAgdGhpcy5jaGF0Qm94ID0gXCJcIjtcbiAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL3Zob3N0My5sbnUuc2U6MjAwODAvc29ja2V0L1wiKTtcbiAgICB0aGlzLnVzZXJuYW1lID0gdXNlcm5hbWUgfHwgXCJMb2tlXCI7XG4gICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbCB8fCBcIlwiO1xuICAgIHRoaXMua2V5ID0gXCJlREJFNzZkZVU3TDBIOW1FQmd4VUtWUjBWQ25xMFhCZFwiO1xuICAgIHRoaXMuZGF0YSA9IHt9O1xuICAgIHRoaXMubWVzc2FnZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnRleHRBcmVhID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG59O1xuXG4vKipcbiAqIE9wZW5zIHVwIGNvbW11bmljYXRpb24gdG8gdGhlIHNlcnZlciBhbmQgbGlzdGVuIGlmIHNvbWV0aGluZyBpcyBzZW50XG4gKi9cbkNoYXQucHJvdG90eXBlLnNlcnZlciA9IGZ1bmN0aW9uKCkge1xuXG4gICAgLy9FdmVudExpc3RlbmVyIGZvciB3aGVuIGNvbW11bmljYXRpb24gaXMgb3BlblxuICAgIHRoaXMuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VuZENoYXQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5zZW5kQ2hhdFwiKTtcbiAgICAgICAgc2VuZENoYXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gICAgICAgIHZhciBlbnRlckNoYXQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5jaGF0Qm94XCIpO1xuICAgICAgICBlbnRlckNoYXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBlLndoaWNoIHx8IGUua2V5Q29kZTtcbiAgICAgICAgICAgIGlmIChrZXkgPT09IDEzKSB7IC8vIDEzIGlzIGVudGVyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLnNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICBpZiAodGhpcy5tZXNzYWdlLmRhdGEgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMubWVzc2FnZS51c2VybmFtZSArIFwiOiBcIiArIHRoaXMubWVzc2FnZS5kYXRhKTtcbiAgICAgICAgICAgIHZhciBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgICAgIGxpLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMubWVzc2FnZS51c2VybmFtZSArIFwiOiBcIiArIHRoaXMubWVzc2FnZS5kYXRhKSk7XG4gICAgICAgICAgICB0aGlzLnRleHRBcmVhID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGV4dEFyZWFcIik7XG4gICAgICAgICAgICB0aGlzLnRleHRBcmVhLmFwcGVuZENoaWxkKGxpKTtcblxuICAgICAgICAgICAgLy9TY3JvbGxzIGRvd24gd2hlbiBuZXcgbWVzc2FnZSBpcyBhcnJpdmVkXG4gICAgICAgICAgICB2YXIgY2hhdEVsID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGV4dENvbnRhaW5lclwiKTtcbiAgICAgICAgICAgIGNoYXRFbC5zY3JvbGxUb3AgPSBjaGF0RWwuc2Nyb2xsSGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICB9LmJpbmQodGhpcykpO1xufTtcblxuLyoqXG4gKiBTZW5kIHRoZSB0ZXh0IHRvIHRoZSBzZXJ2ZXJcbiAqL1xuQ2hhdC5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY2hhdEJveCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmNoYXRCb3hcIik7XG4gICAgdGhpcy5kYXRhID0ge1xuICAgICAgICB0eXBlOiBcIm1lc3NhZ2VcIixcbiAgICAgICAgZGF0YTogdGhpcy5jaGF0Qm94LnZhbHVlLFxuICAgICAgICB1c2VybmFtZTogdGhpcy51c2VybmFtZSxcbiAgICAgICAgY2hhbm5lbDogdGhpcy5jaGFubmVsLFxuICAgICAgICBrZXk6IHRoaXMua2V5XG4gICAgfTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLmRhdGEpO1xuICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhKSk7XG4gICAgdGhpcy5jaGF0Qm94LnZhbHVlID0gXCJcIjtcbiAgICB0aGlzLmNoYXRCb3guZm9jdXMoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hhdDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV2luZG93ID0gcmVxdWlyZShcIi4vd2luZG93XCIpO1xudmFyIE1lbW9yeSA9IHJlcXVpcmUoXCIuL01lbW9yeVwiKTtcbnZhciBUYXNrQmFyID0gcmVxdWlyZShcIi4vdGFza2JhclwiKTtcbnZhciBTZXR0aW5ncyA9IHJlcXVpcmUoXCIuL1NldHRpbmdzXCIpO1xuXG4vKipcbiAqIE1haW4gZGVza3RvcCBtYW5hZ2VtZW50IGZvciBtb3N0bHkgZXZlbnRsaXN0ZW5lcnNcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgRGVza3RvcCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZWxlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuaWQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5udW1iZXIgPSAwO1xuICAgIHRoaXMudXNlcm5hbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zb3VuZCA9IG5ldyBBdWRpbyhcImh0dHA6Ly81LjEwMS4xMDAuMTA3L2Jzb2Qud2F2XCIpO1xuICAgIHRoaXMuaW5kZXggPSAxO1xufTtcblxuLyoqXG4gKiBFdmVudGxpc3RlbmVycyBmb3IgdGhlIGFwcCBpY29ucyBvbiB0aGUgZG9jayBiYXJcbiAqL1xuRGVza3RvcC5wcm90b3R5cGUuZ2VuZXJhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgTWVudSA9IG5ldyBUYXNrQmFyKCk7XG4gICAgTWVudS5kb2NrQmFyKCk7XG4gICAgdmFyIGluaXRXaW5kb3cgPSBuZXcgV2luZG93KCk7XG4gICAgaW5pdFdpbmRvdy5wb3B1cENsb3NlKCk7XG5cbiAgICAvLyBQb3B1cCBmb3IgdGhlIGNsZWFyIGRlc2t0b3AgYXBwXG4gICAgdmFyIGRvY2tDbGVhckFsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2xlYXJBbGxCdXR0b25cIik7XG4gICAgZG9ja0NsZWFyQWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyIGRyYWdXaW5kb3cgPSBuZXcgV2luZG93KCk7XG4gICAgZHJhZ1dpbmRvdy5wb3B1cE9wZW4oKTtcblxuICAgIC8vIENsb3NlIGJ1dHRvblxuICAgIHZhciBwb3B1cENsb3NlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zMy1idG4tY2xvc2VcIik7XG4gICAgcG9wdXBDbG9zZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIGRyYWdXaW5kb3cgPSBuZXcgV2luZG93KCk7XG4gICAgICAgIGRyYWdXaW5kb3cucG9wdXBDbG9zZSgpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIC8vQ2FuY2VsIGJ1dHRvblxuICAgIHZhciBwb3B1cENsb3NlMiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2FuY2VsUG9wdXBcIik7XG4gICAgcG9wdXBDbG9zZTIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBkcmFnV2luZG93ID0gbmV3IFdpbmRvdygpO1xuICAgICAgICBkcmFnV2luZG93LnBvcHVwQ2xvc2UoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICAvLyBDb25maXJtIGJ1dHRvblxuICAgIHZhciBwb3B1cENsZWFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb25maXJtUG9wdXBcIik7XG4gICAgcG9wdXBDbGVhci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIGRyYWdXaW5kb3cgPSBuZXcgV2luZG93KCk7XG4gICAgICAgIGRyYWdXaW5kb3cuY2xlYXJBbGwoKTtcbiAgICAgICAgZHJhZ1dpbmRvdy5wb3B1cENsb3NlKCk7XG4gICAgfSwgZmFsc2UpO1xuXG59LCBmYWxzZSk7XG5cbiAgICAvL0V2ZW50bGlzdGVuZXIgZm9yIHRoZSBtZW1vcnkgYXBwIG9uIHRoZSBkb2NrIGJhclxuICAgIHZhciBkb2NrTWVtb3J5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlCdXR0b25cIik7XG4gICAgZG9ja01lbW9yeS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGFpbmVyXCIpO1xuICAgICAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2luaXRpYWxNZW1vcnlcIik7XG4gICAgICAgIHZhciB0ZW1wID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgICAgdGhpcy5pZCA9IFwiaWQtXCIgKyB0aGlzLm51bWJlci50b1N0cmluZygpO1xuICAgICAgICB0ZW1wLmZpcnN0RWxlbWVudENoaWxkLnNldEF0dHJpYnV0ZShcImlkXCIsIHRoaXMuaWQpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGVtcCk7XG4gICAgICAgIHRoaXMuZWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCk7XG4gICAgICAgIHRoaXMubnVtYmVyICs9IDE7XG4gICAgICAgIHZhciBnYW1lID0gbmV3IE1lbW9yeSh0aGlzLmVsZSk7XG4gICAgICAgIGdhbWUubWVtb3J5KCk7XG4gICAgICAgIHZhciBkcmFnV2luZG93ID0gbmV3IFdpbmRvdyh0aGlzLmVsZSk7XG4gICAgICAgIGRyYWdXaW5kb3cubmV3V2luZG93KCk7XG4gICAgICAgIHRoaXMuY2xvc2UoZHJhZ1dpbmRvdyk7XG4gICAgICAgIHRoaXMuekluZGV4KGRyYWdXaW5kb3cpO1xuICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gICAgLy9FdmVudGxpc3RlbmVyIGZvciB0aGUgY2hhdCBhcHAgb24gdGhlIGRvY2sgYmFyXG4gICAgdmFyIGRvY2tDaGF0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjaGF0QnV0dG9uXCIpO1xuICAgIGRvY2tDaGF0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250YWluZXJcIik7XG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjaW5pdGlhbENoYXRcIik7XG4gICAgICAgIHZhciB0ZW1wID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgICAgdGhpcy5pZCA9IFwiaWQtXCIgKyB0aGlzLm51bWJlci50b1N0cmluZygpO1xuICAgICAgICB0ZW1wLmZpcnN0RWxlbWVudENoaWxkLnNldEF0dHJpYnV0ZShcImlkXCIsIHRoaXMuaWQpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGVtcCk7XG4gICAgICAgIHRoaXMuZWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCk7XG4gICAgICAgIHRoaXMubnVtYmVyICs9IDE7XG4gICAgICAgIHZhciBkcmFnV2luZG93ID0gbmV3IFdpbmRvdyh0aGlzLmVsZSk7XG4gICAgICAgIGRyYWdXaW5kb3cubmV3V2luZG93KCk7XG4gICAgICAgIGRyYWdXaW5kb3cuZ2VuQ2hhdCgpO1xuICAgICAgICB0aGlzLmNsb3NlKGRyYWdXaW5kb3cpO1xuICAgICAgICB0aGlzLnpJbmRleChkcmFnV2luZG93KTtcbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcblxuICAgIC8vRXZlbnRsaXN0ZW5lciBmb3IgdGhlIGV4cGxvcmVyIGFwcCBvbiB0aGUgZG9jayBiYXJcbiAgICB2YXIgZG9ja0V4cGxvcmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNleHBsb3JlckJ1dHRvblwiKTtcbiAgICBkb2NrRXhwbG9yZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuc291bmQucGxheSgpO1xuICAgICAgICB2YXIgYnNvZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYnNvZFwiKTtcbiAgICAgICAgYnNvZC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYnNvZC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgICAvL0V2ZW50bGlzdGVuZXIgZm9yIHRoZSBndWVzdGJvb2sgYXBwIG9uIHRoZSBkb2NrIGJhclxuICAgIHZhciBndWVzdGJvb2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2d1ZXN0Qm9va0J1dHRvblwiKTtcbiAgICBndWVzdGJvb2suYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBjbGlja09uY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmd1ZXN0Ym9va1wiKTtcbiAgICAgICAgaWYgKCFjbGlja09uY2UpIHtcbiAgICAgICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRhaW5lclwiKTtcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZ3Vlc3Rib29rXCIpO1xuICAgICAgICAgICAgdmFyIHRlbXAgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5pZCA9IFwiaWQtXCIgKyB0aGlzLm51bWJlci50b1N0cmluZygpO1xuICAgICAgICAgICAgdGVtcC5maXJzdEVsZW1lbnRDaGlsZC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0aGlzLmlkKTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ZW1wKTtcbiAgICAgICAgICAgIHRoaXMuZWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCk7XG4gICAgICAgICAgICB0aGlzLm51bWJlciArPSAxO1xuICAgICAgICAgICAgdmFyIGRyYWdXaW5kb3cgPSBuZXcgV2luZG93KHRoaXMuZWxlKTtcbiAgICAgICAgICAgIGRyYWdXaW5kb3cubmV3V2luZG93KCk7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKGRyYWdXaW5kb3cpO1xuICAgICAgICAgICAgdGhpcy56SW5kZXgoZHJhZ1dpbmRvdyk7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcblxuICAgIC8vRXZlbnRsaXN0ZW5lciBmb3IgdGhlIHNldHRpbmdzIGFwcCBvbiB0aGUgZG9jayBiYXJcbiAgICB2YXIgc2V0dGluZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NldHRpbmdzQnV0dG9uXCIpO1xuICAgIHNldHRpbmdzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgY2xpY2tPbmNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zZXR0aW5nc1wiKTtcbiAgICAgICAgaWYgKCFjbGlja09uY2UpIHtcbiAgICAgICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRhaW5lclwiKTtcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2V0dGluZ3NcIik7XG4gICAgICAgICAgICB2YXIgdGVtcCA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmlkID0gXCJpZC1cIiArIHRoaXMubnVtYmVyLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB0ZW1wLmZpcnN0RWxlbWVudENoaWxkLnNldEF0dHJpYnV0ZShcImlkXCIsIHRoaXMuaWQpO1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRlbXApO1xuICAgICAgICAgICAgdGhpcy5lbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkKTtcbiAgICAgICAgICAgIHRoaXMubnVtYmVyICs9IDE7XG4gICAgICAgICAgICB2YXIgZHJhZ1dpbmRvdyA9IG5ldyBXaW5kb3codGhpcy5lbGUpO1xuICAgICAgICAgICAgZHJhZ1dpbmRvdy5uZXdXaW5kb3coKTtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoZHJhZ1dpbmRvdyk7XG4gICAgICAgICAgICB0aGlzLnpJbmRleChkcmFnV2luZG93KTtcbiAgICAgICAgICAgIHZhciBiYWNrZ3JvdW5kID0gbmV3IFNldHRpbmdzKCk7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLmJhY2tncm91bmQoKTtcbiAgICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xufTtcblxuLyoqXG4gKiBDbG9zZSBmdW5jdGlvbiBmb3IgdGhlIGN1cnJlbnQgd2luZG93XG4gKiBAcGFyYW0gd2luZG93IC0gVGhlIGN1cnJlbnQgYXBwIHdpbmRvd1xuICovXG5EZXNrdG9wLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKHdpbmRvdykge1xuICAgIHZhciBjbG9zZSA9IHRoaXMuZWxlLnF1ZXJ5U2VsZWN0b3IoXCIuY2xvc2VcIik7XG4gICAgY2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHdpbmRvdy5jbG9zZUN1cnJlbnQoKTtcbiAgICB9LCBmYWxzZSk7XG59O1xuXG4vKipcbiAqIFdoZW4gYSB3aW5kb3cgaXMgY2xpY2tlZCBpdCBnZXRzIHRoZSBoaWdoZXN0IHotaW5kZXhcbiAqIEBwYXJhbSB3aW5kb3cgLSBUaGUgY3VycmVudCBhcHAgd2luZG93XG4gKi9cbkRlc2t0b3AucHJvdG90eXBlLnpJbmRleCA9IGZ1bmN0aW9uKHdpbmRvdykge1xuICAgIHdpbmRvdy5lbGUucXVlcnlTZWxlY3RvcihcIm5hdlwiKS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuaW5kZXggPSB0aGlzLmluZGV4ICsgMTtcbiAgICAgICAgd2luZG93LmVsZS5zdHlsZS56SW5kZXggPSB0aGlzLmluZGV4O1xuICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZXNrdG9wO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogTWVtb3J5IGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0gZWxlIC0gQ3VycmVudCBlbGVtZW50XG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIE1lbW9yeSA9IGZ1bmN0aW9uKGVsZSkge1xuICAgIHRoaXMucm93cyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmNvbHMgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlO1xuICAgIHRoaXMuYXJyID0gW107XG4gICAgdGhpcy50dXJuMSA9IFwiXCI7XG4gICAgdGhpcy50dXJuMiA9IFwiXCI7XG4gICAgdGhpcy5sYXN0VGlsZSA9IFwiXCI7XG4gICAgdGhpcy50cmllcyA9IDA7XG4gICAgdGhpcy5wYWlycyA9IDA7XG59O1xuXG4vKipcbiAqIEV2ZW50bGlzdGVuZXIgZm9yIHRoZSBzdGFydCBidXR0b25cbiAqL1xuTWVtb3J5LnByb3RvdHlwZS5tZW1vcnkgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbWVtb3J5QnV0dG9uID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3RhcnRNZW1vcnlcIik7XG4gICAgbWVtb3J5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgbWVtb3J5U2l6ZSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeVNpemVcIik7XG4gICAgICAgIHZhciBjaG9zZW5TaXplID0gbWVtb3J5U2l6ZS5vcHRpb25zW21lbW9yeVNpemUuc2VsZWN0ZWRJbmRleF0udmFsdWU7XG5cbiAgICAgICAgaWYgKGNob3NlblNpemUgPT09IFwiMTZcIikge1xuICAgICAgICAgICAgdGhpcy5yb3dzID0gNDtcbiAgICAgICAgICAgIHRoaXMuY29scyA9IDQ7XG4gICAgICAgIH0gZWxzZSBpZiAoY2hvc2VuU2l6ZSA9PT0gXCI4XCIpIHtcbiAgICAgICAgICAgIHRoaXMucm93cyA9IDI7XG4gICAgICAgICAgICB0aGlzLmNvbHMgPSA0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yb3dzID0gMjtcbiAgICAgICAgICAgIHRoaXMuY29scyA9IDI7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0YXJ0R2FtZSgpO1xuICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xufTtcblxuLyoqXG4gKiBTdGFydGluZyBwb2ludCBvZiB0aGUgZ2FtZVxuICovXG5NZW1vcnkucHJvdG90eXBlLnN0YXJ0R2FtZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY2xlYXIoKTtcbiAgICB0aGlzLmNyZWF0ZUFycmF5KCk7XG4gICAgdGhpcy5jcmVhdGVCb2FyZCgpO1xufTtcblxuLyoqXG4gKiBDbGVhciB0aGUgbWVtb3J5IHBsYXkgYXJlYSBhbmQgdmFyaWFibGVzIHRoYXQgc2F2ZXMgYSB2YWx1ZVxuICovXG5NZW1vcnkucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGVsID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5Q29udGFpbmVyXCIpO1xuICAgIGlmIChlbCkge1xuICAgICAgICB3aGlsZSAoZWwuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICBlbC5yZW1vdmVDaGlsZChlbC5sYXN0Q2hpbGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hcnIgPSBbXTtcbiAgICB0aGlzLnR1cm4xID0gXCJcIjtcbiAgICB0aGlzLnR1cm4yID0gXCJcIjtcbiAgICB0aGlzLmxhc3RUaWxlID0gXCJcIjtcbiAgICB0aGlzLnRyaWVzID0gMDtcbiAgICB0aGlzLnBhaXJzID0gMDtcbn07XG5cbi8qKlxuICogRHluYW1pY2FsbHkgY3JlYXRlcyB0aGUgYm9hcmRcbiAqL1xuTWVtb3J5LnByb3RvdHlwZS5jcmVhdGVCb2FyZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb250YWluZXIgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW1vcnlDb250YWluZXJcIik7XG4gICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNtZW1vcnlUZW1wbGF0ZVwiKVswXS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkO1xuICAgIHZhciBhO1xuXG4gICAgdGhpcy5hcnIuZm9yRWFjaChmdW5jdGlvbih0aWxlLCBpbmRleCkge1xuICAgICAgICBhID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZSwgdHJ1ZSk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChhKTtcbiAgICAgICAgaWYgKChpbmRleCArIDEpICUgdGhpcy5jb2xzID09PSAwKSB7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdmFyIGltZyA9IGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gXCJJTUdcIiA/IGV2ZW50LnRhcmdldCA6IGV2ZW50LnRhcmdldC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgICAgIHRoaXMudHVybkJyaWNrKHRpbGUsIGluZGV4LCBpbWcpO1xuICAgICAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG59O1xuXG4vKipcbiAqIER5bmFtaWNhbGx5IGNyZWF0ZXMgdGhlIGFycmF5IGZvciB0aGUgc2VsZWN0aW9uIG9mIGltYWdlc1xuICovXG5NZW1vcnkucHJvdG90eXBlLmNyZWF0ZUFycmF5ID0gZnVuY3Rpb24oKSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gKCh0aGlzLnJvd3MgKiB0aGlzLmNvbHMpIC8gMik7IGkgKz0gMSkge1xuICAgICAgICB0aGlzLmFyci5wdXNoKGkpO1xuICAgICAgICB0aGlzLmFyci5wdXNoKGkpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnNodWZmbGUodGhpcy5hcnIpO1xufTtcblxuTWVtb3J5LnByb3RvdHlwZS50dXJuQnJpY2sgPSBmdW5jdGlvbih0aWxlLCBpbmRleCwgaW1nKSB7XG4gICAgaWYgKHRoaXMudHVybjIpIHsgcmV0dXJuOyB9XG5cbiAgICBpbWcuc3JjID0gXCJpbWFnZS9cIiArIHRpbGUgKyBcIi5wbmdcIjtcblxuICAgIGlmICghdGhpcy50dXJuMSkge1xuICAgICAgICB0aGlzLnR1cm4xID0gaW1nO1xuICAgICAgICB0aGlzLmxhc3RUaWxlID0gdGlsZTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpbWcgPT09IHRoaXMudHVybjEpIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgdGhpcy50cmllcyArPSAxO1xuXG4gICAgICAgIHRoaXMudHVybjIgPSBpbWc7XG5cbiAgICAgICAgaWYgKHRpbGUgPT09IHRoaXMubGFzdFRpbGUpIHtcbiAgICAgICAgICAgIHRoaXMucGFpcnMgKz0gMTtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhaXJzID09PSAodGhpcy5jb2xzICogdGhpcy5yb3dzKSAvIDIpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWwgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW1vcnlDb250YWluZXJcIik7XG4gICAgICAgICAgICAgICAgaWYgKGVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChlbC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLnJlbW92ZUNoaWxkKGVsLmxhc3RDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLndpbigpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV29uIG9uIFwiICsgdGhpcy50cmllcyArIFwiIG51bWJlciBvZiB0cmllcyFcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjEucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKFwicmVtb3ZlZFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4yLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZChcInJlbW92ZWRcIik7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMiA9IG51bGw7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIDMwMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4xLnNyYyA9IFwiaW1hZ2UvMC5wbmdcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4yLnNyYyA9IFwiaW1hZ2UvMC5wbmdcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4xID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4yID0gbnVsbDtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgNTAwKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogVGhpcyBwcm90b3R5cGUgaGFuZGxlcyB0aGUgc2h1ZmZsaW5nIG9mIHRoZSBkZWNrXG4gKiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI0NTA5NTQvaG93LXRvLXJhbmRvbWl6ZS1zaHVmZmxlLWEtamF2YXNjcmlwdC1hcnJheVxuICogQHBhcmFtIGluZGV4QXJyIC0gdGhlIGFycmF5IHRvIGJlIHNodWZmbGVkXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuTWVtb3J5LnByb3RvdHlwZS5zaHVmZmxlID0gZnVuY3Rpb24oaW5kZXhBcnIpIHtcbiAgICB2YXIgYXJyYXkgPSBpbmRleEFycjtcbiAgICB2YXIgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoO1xuICAgIHZhciB0ZW1wb3JhcnlWYWx1ZTtcbiAgICB2YXIgcmFuZG9tSW5kZXg7XG5cbiAgICB3aGlsZSAoY3VycmVudEluZGV4ICE9PSAwKSB7XG5cbiAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xuICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcblxuICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XG4gICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcblxufTtcblxuTWVtb3J5LnByb3RvdHlwZS53aW4gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29udGFpbmVyID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5Q29udGFpbmVyXCIpO1xuICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjbWVtb3J5V2luXCIpWzBdLmNvbnRlbnQ7XG4gICAgdmFyIGEgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLCB0cnVlKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYSk7XG5cbiAgICB2YXIgbWVtb3J5V2luVHJpZXMgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW1vcnlXaW5Ucmllc1wiKTtcbiAgICB2YXIgYiA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiV29uIG9uIFwiICsgdGhpcy50cmllcyArIFwiIG51bWJlciBvZiB0cmllcyFcIik7XG4gICAgbWVtb3J5V2luVHJpZXMuYXBwZW5kQ2hpbGQoYik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgU2V0dGluZ3MgPSBmdW5jdGlvbigpIHtcbn07XG5cbi8qKlxuICogQ2hhbmdlIHRoZSBiYWNrZ3JvdW5kIGltYWdlXG4gKi9cblNldHRpbmdzLnByb3RvdHlwZS5iYWNrZ3JvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJhY2tncm91bmQxID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5iYWNrZ3JvdW5kMVwiKTtcbiAgICBiYWNrZ3JvdW5kMS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJodG1sXCIpLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcvaW1hZ2UvYmFja2dyb3VuZC5qcGcnKVwiO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHZhciBiYWNrZ3JvdW5kMiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmFja2dyb3VuZDJcIik7XG4gICAgYmFja2dyb3VuZDIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaHRtbFwiKS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnL2ltYWdlL2JhY2tncm91bmQxLmpwZycpXCI7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgdmFyIGJhY2tncm91bmQzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5iYWNrZ3JvdW5kM1wiKTtcbiAgICBiYWNrZ3JvdW5kMy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJodG1sXCIpLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcvaW1hZ2UvYmFja2dyb3VuZDIuanBnJylcIjtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB2YXIgYmFja2dyb3VuZDQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJhY2tncm91bmQ0XCIpO1xuICAgIGJhY2tncm91bmQ0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImh0bWxcIikuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy9pbWFnZS9iYWNrZ3JvdW5kMy5qcGcnKVwiO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHZhciBiYWNrZ3JvdW5kNSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmFja2dyb3VuZDVcIik7XG4gICAgYmFja2dyb3VuZDUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaHRtbFwiKS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnL2ltYWdlL2JhY2tncm91bmQ0LmpwZycpXCI7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgdmFyIGJhY2tncm91bmQ2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5iYWNrZ3JvdW5kNlwiKTtcbiAgICBiYWNrZ3JvdW5kNi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJodG1sXCIpLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcvaW1hZ2UvYmFja2dyb3VuZDUuanBnJylcIjtcbiAgICB9LCBmYWxzZSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNldHRpbmdzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBEZXNrdG9wID0gcmVxdWlyZShcIi4vRGVza3RvcFwiKTtcbnZhciBkZXNrdG9wID0gbmV3IERlc2t0b3AoKTtcbmRlc2t0b3AuZ2VuZXJhdGUoKTtcblxuLypcblRPRE86IDMncmQgYXBwOiBOb3RlcGFkP1xuICovXG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFRhc2tCYXIgPSBmdW5jdGlvbigpIHtcbn07XG5cbi8qKlxuICogSGFuZGxlcyB0aGUgZG9ja2JhciBob3ZlciBlZmZlY3RcbiAqL1xuVGFza0Jhci5wcm90b3R5cGUuZG9ja0JhciA9IGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIGFkZFByZXZDbGFzcyhlKSB7XG4gICAgICAgIHZhciB0YXJnZXQgPSBlLnRhcmdldDtcbiAgICAgICAgaWYgKHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJzcmNcIikpIHtcbiAgICAgICAgICAgIHZhciBsaSA9IHRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICB2YXIgcHJldkxpID0gbGkucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICAgICAgICAgIGlmIChwcmV2TGkpIHtcbiAgICAgICAgICAgICAgICBwcmV2TGkuY2xhc3NOYW1lID0gXCJwcmV2XCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByZXZMaSkge1xuICAgICAgICAgICAgICAgICAgICBwcmV2TGkucmVtb3ZlQXR0cmlidXRlKFwiY2xhc3NcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHByZXZMaTIgPSB0YXJnZXQucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICAgICAgICAgIGlmIChwcmV2TGkyKSB7XG4gICAgICAgICAgICAgICAgcHJldkxpMi5jbGFzc05hbWUgPSBcInByZXZcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJldkxpMikge1xuICAgICAgICAgICAgICAgICAgICBwcmV2TGkyLnJlbW92ZUF0dHJpYnV0ZShcImNsYXNzXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRvY2tcIikuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLCBhZGRQcmV2Q2xhc3MsIGZhbHNlKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRhc2tCYXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIENoYXQgPSByZXF1aXJlKFwiLi9DaGF0XCIpO1xuXG4vKipcbiAqIE1vdmUgZnVuY3Rpb24gYmFzZWQgb2YgdGhpcyBzb3VyY2UgXCJodHRwOi8vY29kZXBlbi5pby90aGViYWJ5ZGluby9wZW4vQWZhbXNcIi5cbiAqIEBwYXJhbSBlbGUgLSBUaGUgY3VycmVudCB3aW5kb3dcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgV2luZG93ID0gZnVuY3Rpb24oZWxlKSB7XG4gICAgdGhpcy5lbGUgPSBlbGU7XG4gICAgdGhpcy51c2VybmFtZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmNoYW5uZWwgPSB1bmRlZmluZWQ7XG59O1xuXG4vKipcbiAqIENsb3NlIHRoZSB3aW5kb3cgdGhhdCBjbG9zZSBidXR0b24gaGFzIGJlZW4gcHJlc3NlZCBvblxuICovXG5XaW5kb3cucHJvdG90eXBlLmNsb3NlQ3VycmVudCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZWxlLnJlbW92ZSgpO1xufTtcblxuLyoqXG4gKiBEcmFnIGxvZ2ljIGZvciB0aGUgd2luZG93c1xuICovXG5XaW5kb3cucHJvdG90eXBlLm5ld1dpbmRvdyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbGVtZW50ID0gdGhpcy5lbGU7XG4gICAgdmFyIHAxID0ge1xuICAgICAgICB4OiBwYXJzZUludChlbGVtZW50LmRhdGFzZXQueCwgMTApLFxuICAgICAgICB5OiBwYXJzZUludChlbGVtZW50LmRhdGFzZXQueSwgMTApXG4gICAgfTtcbiAgICB2YXIgcDAgPSB7XG4gICAgICAgIHg6IHBhcnNlSW50KGVsZW1lbnQuZGF0YXNldC54LCAxMCksXG4gICAgICAgIHk6IHBhcnNlSW50KGVsZW1lbnQuZGF0YXNldC55LCAxMClcbiAgICB9O1xuICAgIHZhciBjb29yZHMgPSB7XG4gICAgICAgIHg6IHBhcnNlSW50KGVsZW1lbnQuZGF0YXNldC54LCAxMCksXG4gICAgICAgIHk6IHBhcnNlSW50KGVsZW1lbnQuZGF0YXNldC55LCAxMClcbiAgICB9O1xuICAgIHZhciBmbGFnO1xuXG4gICAgdmFyIGRyYWcgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIHAxID0ge3g6IGUuY2xpZW50WCwgeTogZS5jbGllbnRZfTtcblxuICAgICAgICBlbGVtZW50LmRhdGFzZXQueCA9IGNvb3Jkcy54ICsgcDEueCAtIHAwLng7XG4gICAgICAgIGVsZW1lbnQuZGF0YXNldC55ID0gY29vcmRzLnkgKyBwMS55IC0gcDAueTtcblxuICAgICAgICBlbGVtZW50LnN0eWxlW1wiLXdlYmtpdC10cmFuc2Zvcm1cIl0gPVxuICAgICAgICAgICAgXCJ0cmFuc2xhdGUoXCIgKyBlbGVtZW50LmRhdGFzZXQueCArIFwicHgsIFwiICsgZWxlbWVudC5kYXRhc2V0LnkgKyBcInB4KVwiO1xuICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9XG4gICAgICAgICAgICBcInRyYW5zbGF0ZShcIiArIGVsZW1lbnQuZGF0YXNldC54ICsgXCJweCwgXCIgKyBlbGVtZW50LmRhdGFzZXQueSArIFwicHgpXCI7XG4gICAgfTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIHQgPSBlLnRhcmdldDtcblxuICAgICAgICBpZiAodCA9PT0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDFcIikpIHtcbiAgICAgICAgICAgIHAwID0ge3g6IGUuY2xpZW50WCwgeTogZS5jbGllbnRZfTtcbiAgICAgICAgICAgIGZsYWcgPSB0cnVlO1xuXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBkcmFnLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmbGFnID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGZsYWcpIHtcbiAgICAgICAgICAgIGNvb3Jkcy54ICs9IHAxLnggLSBwMC54O1xuICAgICAgICAgICAgY29vcmRzLnkgKz0gcDEueSAtIHAwLnk7XG4gICAgICAgIH1cblxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBkcmFnLCBmYWxzZSk7XG4gICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgZXZlcnl0aGluZyBpbnNpZGUgdGhlIGNvbnRhaW5lclxuICovXG5XaW5kb3cucHJvdG90eXBlLmNsZWFyQWxsID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250YWluZXJcIik7XG4gICAgaWYgKGVsKSB7XG4gICAgICAgIHdoaWxlIChlbC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUNoaWxkKGVsLmxhc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIENsZWFyIGV2ZXJ5dGhpbmcgaW5zaWRlIHRoZSBlbGVtZW50IHRoYXQgaXMgcGFzc2VkIHRvIHRoaXMgZnVuY3Rpb25cbiAqIEBwYXJhbSBlbGVtZW50IC0gQ3VycmVudCBlbGVtZW50XG4gKi9cbldpbmRvdy5wcm90b3R5cGUuY2xlYXJXaW5kb3cgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgdmFyIGVsID0gZWxlbWVudDtcbiAgICBpZiAoZWwpIHtcbiAgICAgICAgd2hpbGUgKGVsLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgZWwucmVtb3ZlQ2hpbGQoZWwubGFzdENoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogR2VuZXJhdGVzIHRoZSBjaGF0IHdpbmRvdyB3aGVuIHVzZXIgZW50ZXJzIGEgbmlja25hbWVcbiAqL1xuV2luZG93LnByb3RvdHlwZS5nZW5DaGF0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGluaXRDaGF0ID0gdGhpcy5lbGUucXVlcnlTZWxlY3RvcihcIi5idXR0b25cIik7XG4gICAgaW5pdENoYXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuc2V0Q2hhbm5lbCgpO1xuICAgICAgICB0aGlzLnNldFVzZXJuYW1lKCk7XG4gICAgICAgIHRoaXMuc2V0UGxhY2Vob2xkZXIoKTtcbiAgICAgICAgdGhpcy5jaGF0RnVuYygpO1xuICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gICAgdmFyIGluaXRDaGF0RW50ZXIgPSB0aGlzLmVsZS5xdWVyeVNlbGVjdG9yKFwiLnVzZXJOYW1lXCIpO1xuICAgIGluaXRDaGF0RW50ZXIuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIGtleSA9IGUud2hpY2ggfHwgZS5rZXlDb2RlO1xuICAgICAgICBpZiAoa2V5ID09PSAxMykgeyAvLyAxMyBpcyBlbnRlclxuICAgICAgICAgICAgdGhpcy5zZXRDaGFubmVsKCk7XG4gICAgICAgICAgICB0aGlzLnNldFVzZXJuYW1lKCk7XG4gICAgICAgICAgICB0aGlzLmNoYXRGdW5jKCk7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcbn07XG5cbi8qKlxuICogR2VuZXJhdGVzIHRoZSBuZXcgY2hhdCB3aW5kb3cgYWZ0ZXIgdXNlciBoYXMgc2V0IG5pY2tuYW1lXG4gKi9cbldpbmRvdy5wcm90b3R5cGUuY2hhdEZ1bmMgPSBmdW5jdGlvbigpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuc2F2ZVVzZXJuYW1lKCk7XG4gICAgdmFyIHdpbmRvd0NvbnRhaW5lciA9IHRoaXMuZWxlLnF1ZXJ5U2VsZWN0b3IoXCIud2luZG93Q29udGFpbmVyXCIpO1xuICAgIHZhciBjaGF0VGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXRXaW5kb3dcIik7XG4gICAgdmFyIHRlbXBXaW5kb3cgPSBkb2N1bWVudC5pbXBvcnROb2RlKGNoYXRUZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICB0aGlzLmNsZWFyV2luZG93KHdpbmRvd0NvbnRhaW5lcik7XG4gICAgd2luZG93Q29udGFpbmVyLmFwcGVuZENoaWxkKHRlbXBXaW5kb3cpO1xuICAgIHZhciBNeUNoYXQgPSBuZXcgQ2hhdCh0aGlzLnVzZXJuYW1lLCB0aGlzLmNoYW5uZWwsIHRoaXMuZWxlKTtcbiAgICBNeUNoYXQuc2VydmVyKCk7XG4gICAgdGhpcy5lbGUucXVlcnlTZWxlY3RvcihcIi5jaGF0Qm94XCIpLmZvY3VzKCk7XG59O1xuXG4vKipcbiAqIEhhbmRsZXMgaG93IHRoZSB1c2VybmFtZSBpcyBzZXRcbiAqL1xuV2luZG93LnByb3RvdHlwZS5zZXRVc2VybmFtZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsb2NhbFVzZXI7XG4gICAgdmFyIHVzZXJuYW1lID0gdGhpcy5lbGUucXVlcnlTZWxlY3RvcihcIi51c2VyTmFtZVwiKS52YWx1ZTtcblxuICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInVzZXJuYW1lXCIpICE9PSBudWxsKSB7XG4gICAgICAgIGxvY2FsVXNlciA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ1c2VybmFtZVwiKSk7XG4gICAgfVxuXG4gICAgaWYgKHVzZXJuYW1lKSB7XG4gICAgICAgIHRoaXMudXNlcm5hbWUgPSB1c2VybmFtZTtcbiAgICAgICAgY29uc29sZS5sb2coXCJ1c2luZyB0ZXh0IGZpZWxkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudXNlcm5hbWUgPSBsb2NhbFVzZXIgfHwgXCJMb2tlXCI7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidXNpbmcgbG9jYWwgc3RvcmFnZSBvciBkZWZhdWx0XCIpO1xuICAgIH1cbn07XG5cbi8qKlxuICogU2F2ZXMgdGhlIHVzZXJuYW1lIHRvIGxvY2Fsc3RvcmFnZVxuICovXG5XaW5kb3cucHJvdG90eXBlLnNhdmVVc2VybmFtZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB1c2VybmFtZSA9IHRoaXMuZWxlLnF1ZXJ5U2VsZWN0b3IoXCIudXNlck5hbWVcIik7XG4gICAgaWYgKHVzZXJuYW1lLnZhbHVlKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidXNlcm5hbWVcIiwgSlNPTi5zdHJpbmdpZnkodXNlcm5hbWUudmFsdWUpKTtcbiAgICAgICAgdGhpcy5zZXRQbGFjZWhvbGRlcigpO1xuICAgIH1cbn07XG5cbi8qKlxuICogSWYgZGVmaW5lZCwgdXNlIGNoYW5uZWxcbiAqL1xuV2luZG93LnByb3RvdHlwZS5zZXRDaGFubmVsID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNoYW5uZWwgPSB0aGlzLmVsZS5xdWVyeVNlbGVjdG9yKFwiLmNoYW5uZWxcIik7XG4gICAgaWYgKGNoYW5uZWwudmFsdWUpIHtcbiAgICAgICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbC52YWx1ZTtcbiAgICB9XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIHVzZXJuYW1lIHRvIHRoZSBwbGFjZWhvbGRlclxuICovXG5XaW5kb3cucHJvdG90eXBlLnNldFBsYWNlaG9sZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51c2VyTmFtZVwiKS5wbGFjZWhvbGRlciA9IHRoaXMudXNlcm5hbWU7XG4gICAgY29uc29sZS5sb2codGhpcy51c2VybmFtZSk7XG59O1xuXG4vKipcbiAqIERpc3BsYXlzIHRoZSBwb3B1cCBjbGVhciBkZXNrdG9wXG4gKi9cbldpbmRvdy5wcm90b3R5cGUucG9wdXBPcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwb3B1cFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xufTtcblxuLyoqXG4gKiBDbG9zZXMgdGhlIHBvcHVwIGNsZWFyIGRlc2t0b3BcbiAqL1xuV2luZG93LnByb3RvdHlwZS5wb3B1cENsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwb3B1cFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvdmVybGF5XCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gV2luZG93O1xuXG4iXX0=
