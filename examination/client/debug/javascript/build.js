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

    if (this.channel === undefined || this.channel === "") {
        var channelNameEmpty = document.createTextNode(" (no channel)");
        this.element.querySelector("h1").appendChild(channelNameEmpty);
    } else {
        var channelName = document.createTextNode(" (" + this.channel + ")");
        this.element.querySelector("h1").appendChild(channelName);
    }

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
            if (this.channel === this.message.channel) {
                this.print();
            } else if (this.channel === undefined || this.channel === "") {
                this.print();
            }
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
    this.socket.send(JSON.stringify(this.data));
    this.chatBox.value = "";
    this.chatBox.focus();
};

/**
 * Print the text recieved from the server
 */
Chat.prototype.print = function() {
    console.log(this.message.username + ": " + this.message.data);
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(this.message.username + ": " + this.message.data));
    this.textArea = this.element.querySelector(".textArea");
    this.textArea.appendChild(li);

    //Scrolls down when new message is arrived
    var chatEl = this.element.querySelector(".textContainer");
    chatEl.scrollTop = chatEl.scrollHeight;
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
    } else {
        this.username = localUser || "Loke";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvRGVza3RvcC5qcyIsImNsaWVudC9zb3VyY2UvanMvTWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9TZXR0aW5ncy5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy90YXNrYmFyLmpzIiwiY2xpZW50L3NvdXJjZS9qcy93aW5kb3cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0gdXNlcm5hbWUgLSBTZXQgYnkgdGhlIHVzZXJcbiAqIEBwYXJhbSBjaGFubmVsIC0gb3B0aW9uYWwgY2hhbm5lbCBuYW1lXG4gKiBAcGFyYW0gZWxlbWVudCAtIFRoZSBjdXJyZW50IG9wZW5lZCB3aW5kb3dcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgQ2hhdCA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBjaGFubmVsLCBlbGVtZW50KSB7XG4gICAgdGhpcy5jaGF0Qm94ID0gXCJcIjtcbiAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL3Zob3N0My5sbnUuc2U6MjAwODAvc29ja2V0L1wiKTtcbiAgICB0aGlzLnVzZXJuYW1lID0gdXNlcm5hbWUgfHwgXCJMb2tlXCI7XG4gICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbCB8fCBcIlwiO1xuICAgIHRoaXMua2V5ID0gXCJlREJFNzZkZVU3TDBIOW1FQmd4VUtWUjBWQ25xMFhCZFwiO1xuICAgIHRoaXMuZGF0YSA9IHt9O1xuICAgIHRoaXMubWVzc2FnZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnRleHRBcmVhID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG59O1xuXG4vKipcbiAqIE9wZW5zIHVwIGNvbW11bmljYXRpb24gdG8gdGhlIHNlcnZlciBhbmQgbGlzdGVuIGlmIHNvbWV0aGluZyBpcyBzZW50XG4gKi9cbkNoYXQucHJvdG90eXBlLnNlcnZlciA9IGZ1bmN0aW9uKCkge1xuXG4gICAgaWYgKHRoaXMuY2hhbm5lbCA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuY2hhbm5lbCA9PT0gXCJcIikge1xuICAgICAgICB2YXIgY2hhbm5lbE5hbWVFbXB0eSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiIChubyBjaGFubmVsKVwiKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoMVwiKS5hcHBlbmRDaGlsZChjaGFubmVsTmFtZUVtcHR5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgY2hhbm5lbE5hbWUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIiAoXCIgKyB0aGlzLmNoYW5uZWwgKyBcIilcIik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaDFcIikuYXBwZW5kQ2hpbGQoY2hhbm5lbE5hbWUpO1xuICAgIH1cblxuICAgIC8vRXZlbnRMaXN0ZW5lciBmb3Igd2hlbiBjb21tdW5pY2F0aW9uIGlzIG9wZW5cbiAgICB0aGlzLnNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbmRDaGF0ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2VuZENoYXRcIik7XG4gICAgICAgIHNlbmRDaGF0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuc2VuZCgpO1xuICAgICAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcblxuICAgICAgICB2YXIgZW50ZXJDaGF0ID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2hhdEJveFwiKTtcbiAgICAgICAgZW50ZXJDaGF0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0gZS53aGljaCB8fCBlLmtleUNvZGU7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAxMykgeyAvLyAxMyBpcyBlbnRlclxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5zb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgaWYgKHRoaXMubWVzc2FnZS5kYXRhICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGFubmVsID09PSB0aGlzLm1lc3NhZ2UuY2hhbm5lbCkge1xuICAgICAgICAgICAgICAgIHRoaXMucHJpbnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFubmVsID09PSB1bmRlZmluZWQgfHwgdGhpcy5jaGFubmVsID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmludCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcbn07XG5cbi8qKlxuICogU2VuZCB0aGUgdGV4dCB0byB0aGUgc2VydmVyXG4gKi9cbkNoYXQucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNoYXRCb3ggPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5jaGF0Qm94XCIpO1xuICAgIHRoaXMuZGF0YSA9IHtcbiAgICAgICAgdHlwZTogXCJtZXNzYWdlXCIsXG4gICAgICAgIGRhdGE6IHRoaXMuY2hhdEJveC52YWx1ZSxcbiAgICAgICAgdXNlcm5hbWU6IHRoaXMudXNlcm5hbWUsXG4gICAgICAgIGNoYW5uZWw6IHRoaXMuY2hhbm5lbCxcbiAgICAgICAga2V5OiB0aGlzLmtleVxuICAgIH07XG4gICAgdGhpcy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGEpKTtcbiAgICB0aGlzLmNoYXRCb3gudmFsdWUgPSBcIlwiO1xuICAgIHRoaXMuY2hhdEJveC5mb2N1cygpO1xufTtcblxuLyoqXG4gKiBQcmludCB0aGUgdGV4dCByZWNpZXZlZCBmcm9tIHRoZSBzZXJ2ZXJcbiAqL1xuQ2hhdC5wcm90b3R5cGUucHJpbnQgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLm1lc3NhZ2UudXNlcm5hbWUgKyBcIjogXCIgKyB0aGlzLm1lc3NhZ2UuZGF0YSk7XG4gICAgdmFyIGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgIGxpLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMubWVzc2FnZS51c2VybmFtZSArIFwiOiBcIiArIHRoaXMubWVzc2FnZS5kYXRhKSk7XG4gICAgdGhpcy50ZXh0QXJlYSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnRleHRBcmVhXCIpO1xuICAgIHRoaXMudGV4dEFyZWEuYXBwZW5kQ2hpbGQobGkpO1xuXG4gICAgLy9TY3JvbGxzIGRvd24gd2hlbiBuZXcgbWVzc2FnZSBpcyBhcnJpdmVkXG4gICAgdmFyIGNoYXRFbCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnRleHRDb250YWluZXJcIik7XG4gICAgY2hhdEVsLnNjcm9sbFRvcCA9IGNoYXRFbC5zY3JvbGxIZWlnaHQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdpbmRvdyA9IHJlcXVpcmUoXCIuL3dpbmRvd1wiKTtcbnZhciBNZW1vcnkgPSByZXF1aXJlKFwiLi9NZW1vcnlcIik7XG52YXIgVGFza0JhciA9IHJlcXVpcmUoXCIuL3Rhc2tiYXJcIik7XG52YXIgU2V0dGluZ3MgPSByZXF1aXJlKFwiLi9TZXR0aW5nc1wiKTtcblxuLyoqXG4gKiBNYWluIGRlc2t0b3AgbWFuYWdlbWVudCBmb3IgbW9zdGx5IGV2ZW50bGlzdGVuZXJzXG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIERlc2t0b3AgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVsZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmlkID0gdW5kZWZpbmVkO1xuICAgIHRoaXMubnVtYmVyID0gMDtcbiAgICB0aGlzLnVzZXJuYW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuc291bmQgPSBuZXcgQXVkaW8oXCJodHRwOi8vNS4xMDEuMTAwLjEwNy9ic29kLndhdlwiKTtcbiAgICB0aGlzLmluZGV4ID0gMTtcbn07XG5cbi8qKlxuICogRXZlbnRsaXN0ZW5lcnMgZm9yIHRoZSBhcHAgaWNvbnMgb24gdGhlIGRvY2sgYmFyXG4gKi9cbkRlc2t0b3AucHJvdG90eXBlLmdlbmVyYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIE1lbnUgPSBuZXcgVGFza0JhcigpO1xuICAgIE1lbnUuZG9ja0JhcigpO1xuICAgIHZhciBpbml0V2luZG93ID0gbmV3IFdpbmRvdygpO1xuICAgIGluaXRXaW5kb3cucG9wdXBDbG9zZSgpO1xuXG4gICAgLy8gUG9wdXAgZm9yIHRoZSBjbGVhciBkZXNrdG9wIGFwcFxuICAgIHZhciBkb2NrQ2xlYXJBbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NsZWFyQWxsQnV0dG9uXCIpO1xuICAgIGRvY2tDbGVhckFsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBkcmFnV2luZG93ID0gbmV3IFdpbmRvdygpO1xuICAgIGRyYWdXaW5kb3cucG9wdXBPcGVuKCk7XG5cbiAgICAvLyBDbG9zZSBidXR0b25cbiAgICB2YXIgcG9wdXBDbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuczMtYnRuLWNsb3NlXCIpO1xuICAgIHBvcHVwQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBkcmFnV2luZG93ID0gbmV3IFdpbmRvdygpO1xuICAgICAgICBkcmFnV2luZG93LnBvcHVwQ2xvc2UoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICAvL0NhbmNlbCBidXR0b25cbiAgICB2YXIgcG9wdXBDbG9zZTIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNhbmNlbFBvcHVwXCIpO1xuICAgIHBvcHVwQ2xvc2UyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgZHJhZ1dpbmRvdyA9IG5ldyBXaW5kb3coKTtcbiAgICAgICAgZHJhZ1dpbmRvdy5wb3B1cENsb3NlKCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgLy8gQ29uZmlybSBidXR0b25cbiAgICB2YXIgcG9wdXBDbGVhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29uZmlybVBvcHVwXCIpO1xuICAgIHBvcHVwQ2xlYXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBkcmFnV2luZG93ID0gbmV3IFdpbmRvdygpO1xuICAgICAgICBkcmFnV2luZG93LmNsZWFyQWxsKCk7XG4gICAgICAgIGRyYWdXaW5kb3cucG9wdXBDbG9zZSgpO1xuICAgIH0sIGZhbHNlKTtcblxufSwgZmFsc2UpO1xuXG4gICAgLy9FdmVudGxpc3RlbmVyIGZvciB0aGUgbWVtb3J5IGFwcCBvbiB0aGUgZG9jayBiYXJcbiAgICB2YXIgZG9ja01lbW9yeSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5QnV0dG9uXCIpO1xuICAgIGRvY2tNZW1vcnkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRhaW5lclwiKTtcbiAgICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNpbml0aWFsTWVtb3J5XCIpO1xuICAgICAgICB2YXIgdGVtcCA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuaWQgPSBcImlkLVwiICsgdGhpcy5udW1iZXIudG9TdHJpbmcoKTtcbiAgICAgICAgdGVtcC5maXJzdEVsZW1lbnRDaGlsZC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0aGlzLmlkKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRlbXApO1xuICAgICAgICB0aGlzLmVsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWQpO1xuICAgICAgICB0aGlzLm51bWJlciArPSAxO1xuICAgICAgICB2YXIgZ2FtZSA9IG5ldyBNZW1vcnkodGhpcy5lbGUpO1xuICAgICAgICBnYW1lLm1lbW9yeSgpO1xuICAgICAgICB2YXIgZHJhZ1dpbmRvdyA9IG5ldyBXaW5kb3codGhpcy5lbGUpO1xuICAgICAgICBkcmFnV2luZG93Lm5ld1dpbmRvdygpO1xuICAgICAgICB0aGlzLmNsb3NlKGRyYWdXaW5kb3cpO1xuICAgICAgICB0aGlzLnpJbmRleChkcmFnV2luZG93KTtcbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcblxuICAgIC8vRXZlbnRsaXN0ZW5lciBmb3IgdGhlIGNoYXQgYXBwIG9uIHRoZSBkb2NrIGJhclxuICAgIHZhciBkb2NrQ2hhdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhdEJ1dHRvblwiKTtcbiAgICBkb2NrQ2hhdC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGFpbmVyXCIpO1xuICAgICAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2luaXRpYWxDaGF0XCIpO1xuICAgICAgICB2YXIgdGVtcCA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuaWQgPSBcImlkLVwiICsgdGhpcy5udW1iZXIudG9TdHJpbmcoKTtcbiAgICAgICAgdGVtcC5maXJzdEVsZW1lbnRDaGlsZC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0aGlzLmlkKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRlbXApO1xuICAgICAgICB0aGlzLmVsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWQpO1xuICAgICAgICB0aGlzLm51bWJlciArPSAxO1xuICAgICAgICB2YXIgZHJhZ1dpbmRvdyA9IG5ldyBXaW5kb3codGhpcy5lbGUpO1xuICAgICAgICBkcmFnV2luZG93Lm5ld1dpbmRvdygpO1xuICAgICAgICBkcmFnV2luZG93LmdlbkNoYXQoKTtcbiAgICAgICAgdGhpcy5jbG9zZShkcmFnV2luZG93KTtcbiAgICAgICAgdGhpcy56SW5kZXgoZHJhZ1dpbmRvdyk7XG4gICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgICAvL0V2ZW50bGlzdGVuZXIgZm9yIHRoZSBleHBsb3JlciBhcHAgb24gdGhlIGRvY2sgYmFyXG4gICAgdmFyIGRvY2tFeHBsb3JlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZXhwbG9yZXJCdXR0b25cIik7XG4gICAgZG9ja0V4cGxvcmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLnNvdW5kLnBsYXkoKTtcbiAgICAgICAgdmFyIGJzb2QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJzb2RcIik7XG4gICAgICAgIGJzb2QuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGJzb2QuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuXG4gICAgLy9FdmVudGxpc3RlbmVyIGZvciB0aGUgZ3Vlc3Rib29rIGFwcCBvbiB0aGUgZG9jayBiYXJcbiAgICB2YXIgZ3Vlc3Rib29rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNndWVzdEJvb2tCdXR0b25cIik7XG4gICAgZ3Vlc3Rib29rLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgY2xpY2tPbmNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ndWVzdGJvb2tcIik7XG4gICAgICAgIGlmICghY2xpY2tPbmNlKSB7XG4gICAgICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250YWluZXJcIik7XG4gICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2d1ZXN0Ym9va1wiKTtcbiAgICAgICAgICAgIHZhciB0ZW1wID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBcImlkLVwiICsgdGhpcy5udW1iZXIudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIHRlbXAuZmlyc3RFbGVtZW50Q2hpbGQuc2V0QXR0cmlidXRlKFwiaWRcIiwgdGhpcy5pZCk7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGVtcCk7XG4gICAgICAgICAgICB0aGlzLmVsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWQpO1xuICAgICAgICAgICAgdGhpcy5udW1iZXIgKz0gMTtcbiAgICAgICAgICAgIHZhciBkcmFnV2luZG93ID0gbmV3IFdpbmRvdyh0aGlzLmVsZSk7XG4gICAgICAgICAgICBkcmFnV2luZG93Lm5ld1dpbmRvdygpO1xuICAgICAgICAgICAgdGhpcy5jbG9zZShkcmFnV2luZG93KTtcbiAgICAgICAgICAgIHRoaXMuekluZGV4KGRyYWdXaW5kb3cpO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgICAvL0V2ZW50bGlzdGVuZXIgZm9yIHRoZSBzZXR0aW5ncyBhcHAgb24gdGhlIGRvY2sgYmFyXG4gICAgdmFyIHNldHRpbmdzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzZXR0aW5nc0J1dHRvblwiKTtcbiAgICBzZXR0aW5ncy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIGNsaWNrT25jZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2V0dGluZ3NcIik7XG4gICAgICAgIGlmICghY2xpY2tPbmNlKSB7XG4gICAgICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250YWluZXJcIik7XG4gICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NldHRpbmdzXCIpO1xuICAgICAgICAgICAgdmFyIHRlbXAgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5pZCA9IFwiaWQtXCIgKyB0aGlzLm51bWJlci50b1N0cmluZygpO1xuICAgICAgICAgICAgdGVtcC5maXJzdEVsZW1lbnRDaGlsZC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0aGlzLmlkKTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ZW1wKTtcbiAgICAgICAgICAgIHRoaXMuZWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCk7XG4gICAgICAgICAgICB0aGlzLm51bWJlciArPSAxO1xuICAgICAgICAgICAgdmFyIGRyYWdXaW5kb3cgPSBuZXcgV2luZG93KHRoaXMuZWxlKTtcbiAgICAgICAgICAgIGRyYWdXaW5kb3cubmV3V2luZG93KCk7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKGRyYWdXaW5kb3cpO1xuICAgICAgICAgICAgdGhpcy56SW5kZXgoZHJhZ1dpbmRvdyk7XG4gICAgICAgICAgICB2YXIgYmFja2dyb3VuZCA9IG5ldyBTZXR0aW5ncygpO1xuICAgICAgICAgICAgYmFja2dyb3VuZC5iYWNrZ3JvdW5kKCk7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcbn07XG5cbi8qKlxuICogQ2xvc2UgZnVuY3Rpb24gZm9yIHRoZSBjdXJyZW50IHdpbmRvd1xuICogQHBhcmFtIHdpbmRvdyAtIFRoZSBjdXJyZW50IGFwcCB3aW5kb3dcbiAqL1xuRGVza3RvcC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbih3aW5kb3cpIHtcbiAgICB2YXIgY2xvc2UgPSB0aGlzLmVsZS5xdWVyeVNlbGVjdG9yKFwiLmNsb3NlXCIpO1xuICAgIGNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB3aW5kb3cuY2xvc2VDdXJyZW50KCk7XG4gICAgfSwgZmFsc2UpO1xufTtcblxuLyoqXG4gKiBXaGVuIGEgd2luZG93IGlzIGNsaWNrZWQgaXQgZ2V0cyB0aGUgaGlnaGVzdCB6LWluZGV4XG4gKiBAcGFyYW0gd2luZG93IC0gVGhlIGN1cnJlbnQgYXBwIHdpbmRvd1xuICovXG5EZXNrdG9wLnByb3RvdHlwZS56SW5kZXggPSBmdW5jdGlvbih3aW5kb3cpIHtcbiAgICB3aW5kb3cuZWxlLnF1ZXJ5U2VsZWN0b3IoXCJuYXZcIikuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmluZGV4ID0gdGhpcy5pbmRleCArIDE7XG4gICAgICAgIHdpbmRvdy5lbGUuc3R5bGUuekluZGV4ID0gdGhpcy5pbmRleDtcbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGVza3RvcDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIE1lbW9yeSBjb25zdHJ1Y3RvclxuICogQHBhcmFtIGVsZSAtIEN1cnJlbnQgZWxlbWVudFxuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBNZW1vcnkgPSBmdW5jdGlvbihlbGUpIHtcbiAgICB0aGlzLnJvd3MgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jb2xzID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZTtcbiAgICB0aGlzLmFyciA9IFtdO1xuICAgIHRoaXMudHVybjEgPSBcIlwiO1xuICAgIHRoaXMudHVybjIgPSBcIlwiO1xuICAgIHRoaXMubGFzdFRpbGUgPSBcIlwiO1xuICAgIHRoaXMudHJpZXMgPSAwO1xuICAgIHRoaXMucGFpcnMgPSAwO1xufTtcblxuLyoqXG4gKiBFdmVudGxpc3RlbmVyIGZvciB0aGUgc3RhcnQgYnV0dG9uXG4gKi9cbk1lbW9yeS5wcm90b3R5cGUubWVtb3J5ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG1lbW9yeUJ1dHRvbiA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnN0YXJ0TWVtb3J5XCIpO1xuICAgIG1lbW9yeUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIG1lbW9yeVNpemUgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW1vcnlTaXplXCIpO1xuICAgICAgICB2YXIgY2hvc2VuU2l6ZSA9IG1lbW9yeVNpemUub3B0aW9uc1ttZW1vcnlTaXplLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xuXG4gICAgICAgIGlmIChjaG9zZW5TaXplID09PSBcIjE2XCIpIHtcbiAgICAgICAgICAgIHRoaXMucm93cyA9IDQ7XG4gICAgICAgICAgICB0aGlzLmNvbHMgPSA0O1xuICAgICAgICB9IGVsc2UgaWYgKGNob3NlblNpemUgPT09IFwiOFwiKSB7XG4gICAgICAgICAgICB0aGlzLnJvd3MgPSAyO1xuICAgICAgICAgICAgdGhpcy5jb2xzID0gNDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucm93cyA9IDI7XG4gICAgICAgICAgICB0aGlzLmNvbHMgPSAyO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdGFydEdhbWUoKTtcbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcbn07XG5cbi8qKlxuICogU3RhcnRpbmcgcG9pbnQgb2YgdGhlIGdhbWVcbiAqL1xuTWVtb3J5LnByb3RvdHlwZS5zdGFydEdhbWUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNsZWFyKCk7XG4gICAgdGhpcy5jcmVhdGVBcnJheSgpO1xuICAgIHRoaXMuY3JlYXRlQm9hcmQoKTtcbn07XG5cbi8qKlxuICogQ2xlYXIgdGhlIG1lbW9yeSBwbGF5IGFyZWEgYW5kIHZhcmlhYmxlcyB0aGF0IHNhdmVzIGEgdmFsdWVcbiAqL1xuTWVtb3J5LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeUNvbnRhaW5lclwiKTtcbiAgICBpZiAoZWwpIHtcbiAgICAgICAgd2hpbGUgKGVsLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgZWwucmVtb3ZlQ2hpbGQoZWwubGFzdENoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYXJyID0gW107XG4gICAgdGhpcy50dXJuMSA9IFwiXCI7XG4gICAgdGhpcy50dXJuMiA9IFwiXCI7XG4gICAgdGhpcy5sYXN0VGlsZSA9IFwiXCI7XG4gICAgdGhpcy50cmllcyA9IDA7XG4gICAgdGhpcy5wYWlycyA9IDA7XG59O1xuXG4vKipcbiAqIER5bmFtaWNhbGx5IGNyZWF0ZXMgdGhlIGJvYXJkXG4gKi9cbk1lbW9yeS5wcm90b3R5cGUuY3JlYXRlQm9hcmQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29udGFpbmVyID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5Q29udGFpbmVyXCIpO1xuICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjbWVtb3J5VGVtcGxhdGVcIilbMF0uY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICB2YXIgYTtcblxuICAgIHRoaXMuYXJyLmZvckVhY2goZnVuY3Rpb24odGlsZSwgaW5kZXgpIHtcbiAgICAgICAgYSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUsIHRydWUpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYSk7XG4gICAgICAgIGlmICgoaW5kZXggKyAxKSAlIHRoaXMuY29scyA9PT0gMCkge1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJiclwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICBhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBpbWcgPSBldmVudC50YXJnZXQubm9kZU5hbWUgPT09IFwiSU1HXCIgPyBldmVudC50YXJnZXQgOiBldmVudC50YXJnZXQuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgICAgICB0aGlzLnR1cm5Ccmljayh0aWxlLCBpbmRleCwgaW1nKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxufTtcblxuLyoqXG4gKiBEeW5hbWljYWxseSBjcmVhdGVzIHRoZSBhcnJheSBmb3IgdGhlIHNlbGVjdGlvbiBvZiBpbWFnZXNcbiAqL1xuTWVtb3J5LnByb3RvdHlwZS5jcmVhdGVBcnJheSA9IGZ1bmN0aW9uKCkge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDw9ICgodGhpcy5yb3dzICogdGhpcy5jb2xzKSAvIDIpOyBpICs9IDEpIHtcbiAgICAgICAgdGhpcy5hcnIucHVzaChpKTtcbiAgICAgICAgdGhpcy5hcnIucHVzaChpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zaHVmZmxlKHRoaXMuYXJyKTtcbn07XG5cbk1lbW9yeS5wcm90b3R5cGUudHVybkJyaWNrID0gZnVuY3Rpb24odGlsZSwgaW5kZXgsIGltZykge1xuICAgIGlmICh0aGlzLnR1cm4yKSB7IHJldHVybjsgfVxuXG4gICAgaW1nLnNyYyA9IFwiaW1hZ2UvXCIgKyB0aWxlICsgXCIucG5nXCI7XG5cbiAgICBpZiAoIXRoaXMudHVybjEpIHtcbiAgICAgICAgdGhpcy50dXJuMSA9IGltZztcbiAgICAgICAgdGhpcy5sYXN0VGlsZSA9IHRpbGU7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaW1nID09PSB0aGlzLnR1cm4xKSB7IHJldHVybjsgfVxuXG4gICAgICAgIHRoaXMudHJpZXMgKz0gMTtcblxuICAgICAgICB0aGlzLnR1cm4yID0gaW1nO1xuXG4gICAgICAgIGlmICh0aWxlID09PSB0aGlzLmxhc3RUaWxlKSB7XG4gICAgICAgICAgICB0aGlzLnBhaXJzICs9IDE7XG4gICAgICAgICAgICBpZiAodGhpcy5wYWlycyA9PT0gKHRoaXMuY29scyAqIHRoaXMucm93cykgLyAyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVsID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5Q29udGFpbmVyXCIpO1xuICAgICAgICAgICAgICAgIGlmIChlbCkge1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoZWwuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5yZW1vdmVDaGlsZChlbC5sYXN0Q2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy53aW4oKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIldvbiBvbiBcIiArIHRoaXMudHJpZXMgKyBcIiBudW1iZXIgb2YgdHJpZXMhXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4xLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZChcInJlbW92ZWRcIik7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMi5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoXCJyZW1vdmVkXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjEgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjIgPSBudWxsO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCAzMDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMS5zcmMgPSBcImltYWdlLzAucG5nXCI7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMi5zcmMgPSBcImltYWdlLzAucG5nXCI7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMiA9IG51bGw7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIDUwMCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIFRoaXMgcHJvdG90eXBlIGhhbmRsZXMgdGhlIHNodWZmbGluZyBvZiB0aGUgZGVja1xuICogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNDUwOTU0L2hvdy10by1yYW5kb21pemUtc2h1ZmZsZS1hLWphdmFzY3JpcHQtYXJyYXlcbiAqIEBwYXJhbSBpbmRleEFyciAtIHRoZSBhcnJheSB0byBiZSBzaHVmZmxlZFxuICogQHJldHVybnMgeyp9XG4gKi9cbk1lbW9yeS5wcm90b3R5cGUuc2h1ZmZsZSA9IGZ1bmN0aW9uKGluZGV4QXJyKSB7XG4gICAgdmFyIGFycmF5ID0gaW5kZXhBcnI7XG4gICAgdmFyIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aDtcbiAgICB2YXIgdGVtcG9yYXJ5VmFsdWU7XG4gICAgdmFyIHJhbmRvbUluZGV4O1xuXG4gICAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xuXG4gICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcbiAgICAgICAgY3VycmVudEluZGV4IC09IDE7XG5cbiAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xuICAgICAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xuICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG5cbn07XG5cbk1lbW9yeS5wcm90b3R5cGUud2luID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbW9yeUNvbnRhaW5lclwiKTtcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI21lbW9yeVdpblwiKVswXS5jb250ZW50O1xuICAgIHZhciBhID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZSwgdHJ1ZSk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGEpO1xuXG4gICAgdmFyIG1lbW9yeVdpblRyaWVzID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVtb3J5V2luVHJpZXNcIik7XG4gICAgdmFyIGIgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIldvbiBvbiBcIiArIHRoaXMudHJpZXMgKyBcIiBudW1iZXIgb2YgdHJpZXMhXCIpO1xuICAgIG1lbW9yeVdpblRyaWVzLmFwcGVuZENoaWxkKGIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZW1vcnk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFNldHRpbmdzID0gZnVuY3Rpb24oKSB7XG59O1xuXG4vKipcbiAqIENoYW5nZSB0aGUgYmFja2dyb3VuZCBpbWFnZVxuICovXG5TZXR0aW5ncy5wcm90b3R5cGUuYmFja2dyb3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBiYWNrZ3JvdW5kMSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmFja2dyb3VuZDFcIik7XG4gICAgYmFja2dyb3VuZDEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaHRtbFwiKS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnL2ltYWdlL2JhY2tncm91bmQuanBnJylcIjtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB2YXIgYmFja2dyb3VuZDIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJhY2tncm91bmQyXCIpO1xuICAgIGJhY2tncm91bmQyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImh0bWxcIikuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy9pbWFnZS9iYWNrZ3JvdW5kMS5qcGcnKVwiO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHZhciBiYWNrZ3JvdW5kMyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmFja2dyb3VuZDNcIik7XG4gICAgYmFja2dyb3VuZDMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaHRtbFwiKS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnL2ltYWdlL2JhY2tncm91bmQyLmpwZycpXCI7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgdmFyIGJhY2tncm91bmQ0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5iYWNrZ3JvdW5kNFwiKTtcbiAgICBiYWNrZ3JvdW5kNC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJodG1sXCIpLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcvaW1hZ2UvYmFja2dyb3VuZDMuanBnJylcIjtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB2YXIgYmFja2dyb3VuZDUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJhY2tncm91bmQ1XCIpO1xuICAgIGJhY2tncm91bmQ1LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImh0bWxcIikuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy9pbWFnZS9iYWNrZ3JvdW5kNC5qcGcnKVwiO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHZhciBiYWNrZ3JvdW5kNiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmFja2dyb3VuZDZcIik7XG4gICAgYmFja2dyb3VuZDYuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaHRtbFwiKS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnL2ltYWdlL2JhY2tncm91bmQ1LmpwZycpXCI7XG4gICAgfSwgZmFsc2UpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZXR0aW5ncztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRGVza3RvcCA9IHJlcXVpcmUoXCIuL0Rlc2t0b3BcIik7XG52YXIgZGVza3RvcCA9IG5ldyBEZXNrdG9wKCk7XG5kZXNrdG9wLmdlbmVyYXRlKCk7XG5cbi8qXG5UT0RPOiAzJ3JkIGFwcDogTm90ZXBhZD9cbiAqL1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBUYXNrQmFyID0gZnVuY3Rpb24oKSB7XG59O1xuXG4vKipcbiAqIEhhbmRsZXMgdGhlIGRvY2tiYXIgaG92ZXIgZWZmZWN0XG4gKi9cblRhc2tCYXIucHJvdG90eXBlLmRvY2tCYXIgPSBmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBhZGRQcmV2Q2xhc3MoZSkge1xuICAgICAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgICAgIGlmICh0YXJnZXQuZ2V0QXR0cmlidXRlKFwic3JjXCIpKSB7XG4gICAgICAgICAgICB2YXIgbGkgPSB0YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgdmFyIHByZXZMaSA9IGxpLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICBpZiAocHJldkxpKSB7XG4gICAgICAgICAgICAgICAgcHJldkxpLmNsYXNzTmFtZSA9IFwicHJldlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChwcmV2TGkpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldkxpLnJlbW92ZUF0dHJpYnV0ZShcImNsYXNzXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBwcmV2TGkyID0gdGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICBpZiAocHJldkxpMikge1xuICAgICAgICAgICAgICAgIHByZXZMaTIuY2xhc3NOYW1lID0gXCJwcmV2XCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByZXZMaTIpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldkxpMi5yZW1vdmVBdHRyaWJ1dGUoXCJjbGFzc1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAod2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkb2NrXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgYWRkUHJldkNsYXNzLCBmYWxzZSk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUYXNrQmFyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBDaGF0ID0gcmVxdWlyZShcIi4vQ2hhdFwiKTtcblxuLyoqXG4gKiBNb3ZlIGZ1bmN0aW9uIGJhc2VkIG9mIHRoaXMgc291cmNlIFwiaHR0cDovL2NvZGVwZW4uaW8vdGhlYmFieWRpbm8vcGVuL0FmYW1zXCIuXG4gKiBAcGFyYW0gZWxlIC0gVGhlIGN1cnJlbnQgd2luZG93XG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIFdpbmRvdyA9IGZ1bmN0aW9uKGVsZSkge1xuICAgIHRoaXMuZWxlID0gZWxlO1xuICAgIHRoaXMudXNlcm5hbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jaGFubmVsID0gdW5kZWZpbmVkO1xufTtcblxuLyoqXG4gKiBDbG9zZSB0aGUgd2luZG93IHRoYXQgY2xvc2UgYnV0dG9uIGhhcyBiZWVuIHByZXNzZWQgb25cbiAqL1xuV2luZG93LnByb3RvdHlwZS5jbG9zZUN1cnJlbnQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVsZS5yZW1vdmUoKTtcbn07XG5cbi8qKlxuICogRHJhZyBsb2dpYyBmb3IgdGhlIHdpbmRvd3NcbiAqL1xuV2luZG93LnByb3RvdHlwZS5uZXdXaW5kb3cgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZWxlbWVudCA9IHRoaXMuZWxlO1xuICAgIHZhciBwMSA9IHtcbiAgICAgICAgeDogcGFyc2VJbnQoZWxlbWVudC5kYXRhc2V0LngsIDEwKSxcbiAgICAgICAgeTogcGFyc2VJbnQoZWxlbWVudC5kYXRhc2V0LnksIDEwKVxuICAgIH07XG4gICAgdmFyIHAwID0ge1xuICAgICAgICB4OiBwYXJzZUludChlbGVtZW50LmRhdGFzZXQueCwgMTApLFxuICAgICAgICB5OiBwYXJzZUludChlbGVtZW50LmRhdGFzZXQueSwgMTApXG4gICAgfTtcbiAgICB2YXIgY29vcmRzID0ge1xuICAgICAgICB4OiBwYXJzZUludChlbGVtZW50LmRhdGFzZXQueCwgMTApLFxuICAgICAgICB5OiBwYXJzZUludChlbGVtZW50LmRhdGFzZXQueSwgMTApXG4gICAgfTtcbiAgICB2YXIgZmxhZztcblxuICAgIHZhciBkcmFnID0gZnVuY3Rpb24oZSkge1xuICAgICAgICBwMSA9IHt4OiBlLmNsaWVudFgsIHk6IGUuY2xpZW50WX07XG5cbiAgICAgICAgZWxlbWVudC5kYXRhc2V0LnggPSBjb29yZHMueCArIHAxLnggLSBwMC54O1xuICAgICAgICBlbGVtZW50LmRhdGFzZXQueSA9IGNvb3Jkcy55ICsgcDEueSAtIHAwLnk7XG5cbiAgICAgICAgZWxlbWVudC5zdHlsZVtcIi13ZWJraXQtdHJhbnNmb3JtXCJdID1cbiAgICAgICAgICAgIFwidHJhbnNsYXRlKFwiICsgZWxlbWVudC5kYXRhc2V0LnggKyBcInB4LCBcIiArIGVsZW1lbnQuZGF0YXNldC55ICsgXCJweClcIjtcbiAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPVxuICAgICAgICAgICAgXCJ0cmFuc2xhdGUoXCIgKyBlbGVtZW50LmRhdGFzZXQueCArIFwicHgsIFwiICsgZWxlbWVudC5kYXRhc2V0LnkgKyBcInB4KVwiO1xuICAgIH07XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciB0ID0gZS50YXJnZXQ7XG5cbiAgICAgICAgaWYgKHQgPT09IGVsZW1lbnQucXVlcnlTZWxlY3RvcihcImgxXCIpKSB7XG4gICAgICAgICAgICBwMCA9IHt4OiBlLmNsaWVudFgsIHk6IGUuY2xpZW50WX07XG4gICAgICAgICAgICBmbGFnID0gdHJ1ZTtcblxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZHJhZywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZmxhZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChmbGFnKSB7XG4gICAgICAgICAgICBjb29yZHMueCArPSBwMS54IC0gcDAueDtcbiAgICAgICAgICAgIGNvb3Jkcy55ICs9IHAxLnkgLSBwMC55O1xuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZHJhZywgZmFsc2UpO1xuICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIGV2ZXJ5dGhpbmcgaW5zaWRlIHRoZSBjb250YWluZXJcbiAqL1xuV2luZG93LnByb3RvdHlwZS5jbGVhckFsbCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGFpbmVyXCIpO1xuICAgIGlmIChlbCkge1xuICAgICAgICB3aGlsZSAoZWwuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICBlbC5yZW1vdmVDaGlsZChlbC5sYXN0Q2hpbGQpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiBDbGVhciBldmVyeXRoaW5nIGluc2lkZSB0aGUgZWxlbWVudCB0aGF0IGlzIHBhc3NlZCB0byB0aGlzIGZ1bmN0aW9uXG4gKiBAcGFyYW0gZWxlbWVudCAtIEN1cnJlbnQgZWxlbWVudFxuICovXG5XaW5kb3cucHJvdG90eXBlLmNsZWFyV2luZG93ID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgIHZhciBlbCA9IGVsZW1lbnQ7XG4gICAgaWYgKGVsKSB7XG4gICAgICAgIHdoaWxlIChlbC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUNoaWxkKGVsLmxhc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIEdlbmVyYXRlcyB0aGUgY2hhdCB3aW5kb3cgd2hlbiB1c2VyIGVudGVycyBhIG5pY2tuYW1lXG4gKi9cbldpbmRvdy5wcm90b3R5cGUuZ2VuQ2hhdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbml0Q2hhdCA9IHRoaXMuZWxlLnF1ZXJ5U2VsZWN0b3IoXCIuYnV0dG9uXCIpO1xuICAgIGluaXRDaGF0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLnNldENoYW5uZWwoKTtcbiAgICAgICAgdGhpcy5zZXRVc2VybmFtZSgpO1xuICAgICAgICB0aGlzLnNldFBsYWNlaG9sZGVyKCk7XG4gICAgICAgIHRoaXMuY2hhdEZ1bmMoKTtcbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcblxuICAgIHZhciBpbml0Q2hhdEVudGVyID0gdGhpcy5lbGUucXVlcnlTZWxlY3RvcihcIi51c2VyTmFtZVwiKTtcbiAgICBpbml0Q2hhdEVudGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciBrZXkgPSBlLndoaWNoIHx8IGUua2V5Q29kZTtcbiAgICAgICAgaWYgKGtleSA9PT0gMTMpIHsgLy8gMTMgaXMgZW50ZXJcbiAgICAgICAgICAgIHRoaXMuc2V0Q2hhbm5lbCgpO1xuICAgICAgICAgICAgdGhpcy5zZXRVc2VybmFtZSgpO1xuICAgICAgICAgICAgdGhpcy5jaGF0RnVuYygpO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cbiAgICB2YXIgaW5pdENoYXRFbnRlck5pY2sgPSB0aGlzLmVsZS5xdWVyeVNlbGVjdG9yKFwiLmNoYW5uZWxcIik7XG4gICAgaW5pdENoYXRFbnRlck5pY2suYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIGtleSA9IGUud2hpY2ggfHwgZS5rZXlDb2RlO1xuICAgICAgICBpZiAoa2V5ID09PSAxMykgeyAvLyAxMyBpcyBlbnRlclxuICAgICAgICAgICAgdGhpcy5zZXRDaGFubmVsKCk7XG4gICAgICAgICAgICB0aGlzLnNldFVzZXJuYW1lKCk7XG4gICAgICAgICAgICB0aGlzLmNoYXRGdW5jKCk7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcbn07XG5cbi8qKlxuICogR2VuZXJhdGVzIHRoZSBuZXcgY2hhdCB3aW5kb3cgYWZ0ZXIgdXNlciBoYXMgc2V0IG5pY2tuYW1lXG4gKi9cbldpbmRvdy5wcm90b3R5cGUuY2hhdEZ1bmMgPSBmdW5jdGlvbigpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuc2F2ZVVzZXJuYW1lKCk7XG4gICAgdmFyIHdpbmRvd0NvbnRhaW5lciA9IHRoaXMuZWxlLnF1ZXJ5U2VsZWN0b3IoXCIud2luZG93Q29udGFpbmVyXCIpO1xuICAgIHZhciBjaGF0VGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXRXaW5kb3dcIik7XG4gICAgdmFyIHRlbXBXaW5kb3cgPSBkb2N1bWVudC5pbXBvcnROb2RlKGNoYXRUZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICB0aGlzLmNsZWFyV2luZG93KHdpbmRvd0NvbnRhaW5lcik7XG4gICAgd2luZG93Q29udGFpbmVyLmFwcGVuZENoaWxkKHRlbXBXaW5kb3cpO1xuICAgIHZhciBNeUNoYXQgPSBuZXcgQ2hhdCh0aGlzLnVzZXJuYW1lLCB0aGlzLmNoYW5uZWwsIHRoaXMuZWxlKTtcbiAgICBNeUNoYXQuc2VydmVyKCk7XG4gICAgdGhpcy5lbGUucXVlcnlTZWxlY3RvcihcIi5jaGF0Qm94XCIpLmZvY3VzKCk7XG59O1xuXG4vKipcbiAqIEhhbmRsZXMgaG93IHRoZSB1c2VybmFtZSBpcyBzZXRcbiAqL1xuV2luZG93LnByb3RvdHlwZS5zZXRVc2VybmFtZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsb2NhbFVzZXI7XG4gICAgdmFyIHVzZXJuYW1lID0gdGhpcy5lbGUucXVlcnlTZWxlY3RvcihcIi51c2VyTmFtZVwiKS52YWx1ZTtcblxuICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInVzZXJuYW1lXCIpICE9PSBudWxsKSB7XG4gICAgICAgIGxvY2FsVXNlciA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ1c2VybmFtZVwiKSk7XG4gICAgfVxuXG4gICAgaWYgKHVzZXJuYW1lKSB7XG4gICAgICAgIHRoaXMudXNlcm5hbWUgPSB1c2VybmFtZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnVzZXJuYW1lID0gbG9jYWxVc2VyIHx8IFwiTG9rZVwiO1xuICAgIH1cbn07XG5cbi8qKlxuICogU2F2ZXMgdGhlIHVzZXJuYW1lIHRvIGxvY2Fsc3RvcmFnZVxuICovXG5XaW5kb3cucHJvdG90eXBlLnNhdmVVc2VybmFtZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB1c2VybmFtZSA9IHRoaXMuZWxlLnF1ZXJ5U2VsZWN0b3IoXCIudXNlck5hbWVcIik7XG4gICAgaWYgKHVzZXJuYW1lLnZhbHVlKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidXNlcm5hbWVcIiwgSlNPTi5zdHJpbmdpZnkodXNlcm5hbWUudmFsdWUpKTtcbiAgICAgICAgdGhpcy5zZXRQbGFjZWhvbGRlcigpO1xuICAgIH1cbn07XG5cbi8qKlxuICogSWYgZGVmaW5lZCwgdXNlIGNoYW5uZWxcbiAqL1xuV2luZG93LnByb3RvdHlwZS5zZXRDaGFubmVsID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNoYW5uZWwgPSB0aGlzLmVsZS5xdWVyeVNlbGVjdG9yKFwiLmNoYW5uZWxcIik7XG4gICAgaWYgKGNoYW5uZWwudmFsdWUpIHtcbiAgICAgICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbC52YWx1ZTtcbiAgICB9XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIHVzZXJuYW1lIHRvIHRoZSBwbGFjZWhvbGRlclxuICovXG5XaW5kb3cucHJvdG90eXBlLnNldFBsYWNlaG9sZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51c2VyTmFtZVwiKS5wbGFjZWhvbGRlciA9IHRoaXMudXNlcm5hbWU7XG59O1xuXG4vKipcbiAqIERpc3BsYXlzIHRoZSBwb3B1cCBjbGVhciBkZXNrdG9wXG4gKi9cbldpbmRvdy5wcm90b3R5cGUucG9wdXBPcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwb3B1cFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3ZlcmxheVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xufTtcblxuLyoqXG4gKiBDbG9zZXMgdGhlIHBvcHVwIGNsZWFyIGRlc2t0b3BcbiAqL1xuV2luZG93LnByb3RvdHlwZS5wb3B1cENsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwb3B1cFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvdmVybGF5XCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gV2luZG93O1xuXG4iXX0=
