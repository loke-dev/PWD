(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    this.clear();
    this.createArray();
    this.createBoard();
};

Memory.prototype.clear = function() {
    var el = document.querySelector("#memoryContainer");
    while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
    }
};

/**
 * Dynamically creates the board
 */
Memory.prototype.createBoard = function() {
    var container = document.querySelector("#memoryContainer");
    var template = document.querySelectorAll("#quizTemplate")[0].content.firstElementChild;
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

    //console.log(tile);
    //console.log(index);
    //console.log(img);

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

},{}],2:[function(require,module,exports){
"use strict";

var newWindow = require("./window");
var Memory = require("./Memory");
var TaskBar = require("./taskbar");

var Menu = new TaskBar();

Menu.dockBar();

var buttonStart = document.querySelector("#memoryButton");

buttonStart.addEventListener("click", function(event) {
    event.preventDefault();
    newWindow.genWindow();
    newWindow.newWindow();
    var game = new Memory(4, 4);
    game.startGame();
}, false);

},{"./Memory":1,"./taskbar":3,"./window":4}],3:[function(require,module,exports){
"use strict";

var TaskBar = function() {
};

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

},{}],4:[function(require,module,exports){
"use strict";

/**
 * Code used and modified from this source "http://codepen.io/thebabydino/pen/Afams".
 */
function newWindow() {
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

}


function genWindow() {
    var container = document.querySelector("#Container");
    var template = document.querySelector("#windowTemplate");
    var a = document.importNode(template, true);
    container.appendChild(a);
    console.log("Generating a new window");
}

module.exports = {
    newWindow: newWindow,
    genWindow: genWindow
};

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvTWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiLCJjbGllbnQvc291cmNlL2pzL3Rhc2tiYXIuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKipcclxuICogTWVtb3J5IGNvbnN0cnVjdG9yXHJcbiAqIEBwYXJhbSByb3dzIC0gVGhlIGFtb3VudCBvZiByb3dzXHJcbiAqIEBwYXJhbSBjb2xzIC0gVGhlIGFtb3VudCBvZiBjb2x1bW5zXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxudmFyIE1lbW9yeSA9IGZ1bmN0aW9uKHJvd3MsIGNvbHMpIHtcclxuICAgIHRoaXMucm93cyA9IHJvd3M7XHJcbiAgICB0aGlzLmNvbHMgPSBjb2xzO1xyXG4gICAgdGhpcy5hcnIgPSBbXTtcclxuICAgIHRoaXMudHVybjEgPSBcIlwiO1xyXG4gICAgdGhpcy50dXJuMiA9IFwiXCI7XHJcbiAgICB0aGlzLmxhc3RUaWxlID0gXCJcIjtcclxuICAgIHRoaXMudHJpZXMgPSAwO1xyXG4gICAgdGhpcy5wYWlycyA9IDA7XHJcbn07XHJcblxyXG4vKipcclxuICogU3RhcnRpbmcgcG9pbnQgb2YgdGhlIGdhbWVcclxuICovXHJcbk1lbW9yeS5wcm90b3R5cGUuc3RhcnRHYW1lID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICB0aGlzLmNyZWF0ZUFycmF5KCk7XHJcbiAgICB0aGlzLmNyZWF0ZUJvYXJkKCk7XHJcbn07XHJcblxyXG5NZW1vcnkucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeUNvbnRhaW5lclwiKTtcclxuICAgIHdoaWxlIChlbC5oYXNDaGlsZE5vZGVzKCkpIHtcclxuICAgICAgICBlbC5yZW1vdmVDaGlsZChlbC5sYXN0Q2hpbGQpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIER5bmFtaWNhbGx5IGNyZWF0ZXMgdGhlIGJvYXJkXHJcbiAqL1xyXG5NZW1vcnkucHJvdG90eXBlLmNyZWF0ZUJvYXJkID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlDb250YWluZXJcIik7XHJcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI3F1aXpUZW1wbGF0ZVwiKVswXS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkO1xyXG4gICAgdmFyIGE7XHJcblxyXG4gICAgdGhpcy5hcnIuZm9yRWFjaChmdW5jdGlvbih0aWxlLCBpbmRleCkge1xyXG4gICAgICAgIGEgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLCB0cnVlKTtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgaWYgKChpbmRleCArIDEpICUgdGhpcy5jb2xzID09PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyIGltZyA9IGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gXCJJTUdcIiA/IGV2ZW50LnRhcmdldCA6IGV2ZW50LnRhcmdldC5maXJzdEVsZW1lbnRDaGlsZDtcclxuICAgICAgICAgICAgdGhpcy50dXJuQnJpY2sodGlsZSwgaW5kZXgsIGltZyk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XHJcbiAgICB9LmJpbmQodGhpcykpO1xyXG5cclxufTtcclxuXHJcbi8qKlxyXG4gKiBEeW5hbWljYWxseSBjcmVhdGVzIHRoZSBhcnJheSBmb3IgdGhlIHNlbGVjdGlvbiBvZiBpbWFnZXNcclxuICovXHJcbk1lbW9yeS5wcm90b3R5cGUuY3JlYXRlQXJyYXkgPSBmdW5jdGlvbigpIHtcclxuICAgIGZvciAodmFyIGkgPSAxOyBpIDw9ICgodGhpcy5yb3dzICogdGhpcy5jb2xzKSAvIDIpOyBpICs9IDEpIHtcclxuICAgICAgICB0aGlzLmFyci5wdXNoKGkpO1xyXG4gICAgICAgIHRoaXMuYXJyLnB1c2goaSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuc2h1ZmZsZSh0aGlzLmFycik7XHJcbn07XHJcblxyXG5NZW1vcnkucHJvdG90eXBlLnR1cm5CcmljayA9IGZ1bmN0aW9uKHRpbGUsIGluZGV4LCBpbWcpIHtcclxuXHJcbiAgICAvL2NvbnNvbGUubG9nKHRpbGUpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhpbmRleCk7XHJcbiAgICAvL2NvbnNvbGUubG9nKGltZyk7XHJcblxyXG4gICAgaWYgKHRoaXMudHVybjIpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgaW1nLnNyYyA9IFwiaW1hZ2UvXCIgKyB0aWxlICsgXCIucG5nXCI7XHJcblxyXG4gICAgaWYgKCF0aGlzLnR1cm4xKSB7XHJcbiAgICAgICAgdGhpcy50dXJuMSA9IGltZztcclxuICAgICAgICB0aGlzLmxhc3RUaWxlID0gdGlsZTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChpbWcgPT09IHRoaXMudHVybjEpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICAgIHRoaXMudHJpZXMgKz0gMTtcclxuXHJcbiAgICAgICAgdGhpcy50dXJuMiA9IGltZztcclxuXHJcbiAgICAgICAgaWYgKHRpbGUgPT09IHRoaXMubGFzdFRpbGUpIHtcclxuICAgICAgICAgICAgdGhpcy5wYWlycyArPSAxO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wYWlycyA9PT0gKHRoaXMuY29scyAqIHRoaXMucm93cykgLyAyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIldvbiBvbiBcIiArIHRoaXMudHJpZXMgKyBcIiBudW1iZXIgb2YgdHJpZXMhXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoXCJyZW1vdmVkXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMi5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoXCJyZW1vdmVkXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4yID0gbnVsbDtcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCAzMDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMS5zcmMgPSBcImltYWdlLzAucG5nXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4yLnNyYyA9IFwiaW1hZ2UvMC5wbmdcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMudHVybjEgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMiA9IG51bGw7XHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgNTAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG4vKipcclxuICogVGhpcyBwcm90b3R5cGUgaGFuZGxlcyB0aGUgc2h1ZmZsaW5nIG9mIHRoZSBkZWNrXHJcbiAqIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjQ1MDk1NC9ob3ctdG8tcmFuZG9taXplLXNodWZmbGUtYS1qYXZhc2NyaXB0LWFycmF5XHJcbiAqIEBwYXJhbSBpbmRleEFyciAtIHRoZSBhcnJheSB0byBiZSBzaHVmZmxlZFxyXG4gKiBAcmV0dXJucyB7Kn1cclxuICovXHJcbk1lbW9yeS5wcm90b3R5cGUuc2h1ZmZsZSA9IGZ1bmN0aW9uKGluZGV4QXJyKSB7XHJcbiAgICB2YXIgYXJyYXkgPSBpbmRleEFycjtcclxuICAgIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGg7XHJcbiAgICB2YXIgdGVtcG9yYXJ5VmFsdWU7XHJcbiAgICB2YXIgcmFuZG9tSW5kZXg7XHJcblxyXG4gICAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xyXG5cclxuICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XHJcbiAgICAgICAgY3VycmVudEluZGV4IC09IDE7XHJcblxyXG4gICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgICAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xyXG4gICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhcnJheTtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBuZXdXaW5kb3cgPSByZXF1aXJlKFwiLi93aW5kb3dcIik7XG52YXIgTWVtb3J5ID0gcmVxdWlyZShcIi4vTWVtb3J5XCIpO1xudmFyIFRhc2tCYXIgPSByZXF1aXJlKFwiLi90YXNrYmFyXCIpO1xuXG52YXIgTWVudSA9IG5ldyBUYXNrQmFyKCk7XG5cbk1lbnUuZG9ja0JhcigpO1xuXG52YXIgYnV0dG9uU3RhcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeUJ1dHRvblwiKTtcblxuYnV0dG9uU3RhcnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBuZXdXaW5kb3cuZ2VuV2luZG93KCk7XG4gICAgbmV3V2luZG93Lm5ld1dpbmRvdygpO1xuICAgIHZhciBnYW1lID0gbmV3IE1lbW9yeSg0LCA0KTtcbiAgICBnYW1lLnN0YXJ0R2FtZSgpO1xufSwgZmFsc2UpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBUYXNrQmFyID0gZnVuY3Rpb24oKSB7XG59O1xuXG5UYXNrQmFyLnByb3RvdHlwZS5kb2NrQmFyID0gZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gYWRkUHJldkNsYXNzIChlKSB7XG4gICAgICAgIHZhciB0YXJnZXQgPSBlLnRhcmdldDtcbiAgICAgICAgaWYodGFyZ2V0LmdldEF0dHJpYnV0ZShcInNyY1wiKSkge1xuICAgICAgICAgICAgdmFyIGxpID0gdGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgICAgIHZhciBwcmV2TGkgPSBsaS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgaWYocHJldkxpKSB7XG4gICAgICAgICAgICAgICAgcHJldkxpLmNsYXNzTmFtZSA9IFwicHJldlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChwcmV2TGkpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldkxpLnJlbW92ZUF0dHJpYnV0ZShcImNsYXNzXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBwcmV2TGkyID0gdGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICBpZihwcmV2TGkyKSB7XG4gICAgICAgICAgICAgICAgcHJldkxpMi5jbGFzc05hbWUgPSBcInByZXZcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByZXZMaTIpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldkxpMi5yZW1vdmVBdHRyaWJ1dGUoXCJjbGFzc1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZG9ja1wiKS5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsIGFkZFByZXZDbGFzcywgZmFsc2UpO1xuICAgIH1cbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBUYXNrQmFyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQ29kZSB1c2VkIGFuZCBtb2RpZmllZCBmcm9tIHRoaXMgc291cmNlIFwiaHR0cDovL2NvZGVwZW4uaW8vdGhlYmFieWRpbm8vcGVuL0FmYW1zXCIuXG4gKi9cbmZ1bmN0aW9uIG5ld1dpbmRvdygpIHtcbiAgICB2YXIgcG9pbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvaW50XCIpO1xuICAgIHZhciBwMSA9IHtcbiAgICAgICAgeDogcGFyc2VJbnQocG9pbnQuZGF0YXNldC54LCAxMCksXG4gICAgICAgIHk6IHBhcnNlSW50KHBvaW50LmRhdGFzZXQueSwgMTApXG4gICAgfTtcbiAgICB2YXIgcDAgPSB7XG4gICAgICAgIHg6IHBhcnNlSW50KHBvaW50LmRhdGFzZXQueCwgMTApLFxuICAgICAgICB5OiBwYXJzZUludChwb2ludC5kYXRhc2V0LnksIDEwKVxuICAgIH07XG4gICAgdmFyIGNvb3JkcyA9IHtcbiAgICAgICAgeDogcGFyc2VJbnQocG9pbnQuZGF0YXNldC54LCAxMCksXG4gICAgICAgIHk6IHBhcnNlSW50KHBvaW50LmRhdGFzZXQueSwgMTApXG4gICAgfTtcbiAgICB2YXIgZmxhZztcblxuICAgIHZhciBkcmFnID0gZnVuY3Rpb24oZSkge1xuICAgICAgICBwMSA9IHt4OiBlLmNsaWVudFgsIHk6IGUuY2xpZW50WX07XG5cbiAgICAgICAgcG9pbnQuZGF0YXNldC54ID0gY29vcmRzLnggKyBwMS54IC0gcDAueDtcbiAgICAgICAgcG9pbnQuZGF0YXNldC55ID0gY29vcmRzLnkgKyBwMS55IC0gcDAueTtcblxuICAgICAgICBwb2ludC5zdHlsZVtcIi13ZWJraXQtdHJhbnNmb3JtXCJdID1cbiAgICAgICAgICAgIFwidHJhbnNsYXRlKFwiICsgcG9pbnQuZGF0YXNldC54ICsgXCJweCwgXCIgKyBwb2ludC5kYXRhc2V0LnkgKyBcInB4KVwiO1xuICAgICAgICBwb2ludC5zdHlsZS50cmFuc2Zvcm0gPVxuICAgICAgICAgICAgXCJ0cmFuc2xhdGUoXCIgKyBwb2ludC5kYXRhc2V0LnggKyBcInB4LCBcIiArIHBvaW50LmRhdGFzZXQueSArIFwicHgpXCI7XG4gICAgfTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIHQgPSBlLnRhcmdldDtcblxuICAgICAgICBpZiAodCA9PT0gcG9pbnQpIHtcbiAgICAgICAgICAgIHAwID0ge3g6IGUuY2xpZW50WCwgeTogZS5jbGllbnRZfTtcbiAgICAgICAgICAgIGZsYWcgPSB0cnVlO1xuXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBkcmFnLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmbGFnID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LCBmYWxzZSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChmbGFnKSB7XG4gICAgICAgICAgICBjb29yZHMueCArPSBwMS54IC0gcDAueDtcbiAgICAgICAgICAgIGNvb3Jkcy55ICs9IHAxLnkgLSBwMC55O1xuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZHJhZywgZmFsc2UpO1xuICAgIH0sIGZhbHNlKTtcblxufVxuXG5cbmZ1bmN0aW9uIGdlbldpbmRvdygpIHtcbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNDb250YWluZXJcIik7XG4gICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN3aW5kb3dUZW1wbGF0ZVwiKTtcbiAgICB2YXIgYSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUsIHRydWUpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChhKTtcbiAgICBjb25zb2xlLmxvZyhcIkdlbmVyYXRpbmcgYSBuZXcgd2luZG93XCIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBuZXdXaW5kb3c6IG5ld1dpbmRvdyxcbiAgICBnZW5XaW5kb3c6IGdlbldpbmRvd1xufTtcbiJdfQ==
