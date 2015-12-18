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

newWindow.newWindow();

var buttonStart = document.querySelector(".startMemory");

buttonStart.addEventListener("click", function(event) {
    event.preventDefault();
    var game = new Memory(4, 4);
    game.startGame();
}, false);

},{"./Memory":1,"./window":3}],3:[function(require,module,exports){
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

module.exports = {
    newWindow: newWindow
};

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMy4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvTWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLyoqXHJcbiAqIE1lbW9yeSBjb25zdHJ1Y3RvclxyXG4gKiBAcGFyYW0gcm93cyAtIFRoZSBhbW91bnQgb2Ygcm93c1xyXG4gKiBAcGFyYW0gY29scyAtIFRoZSBhbW91bnQgb2YgY29sdW1uc1xyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbnZhciBNZW1vcnkgPSBmdW5jdGlvbihyb3dzLCBjb2xzKSB7XHJcbiAgICB0aGlzLnJvd3MgPSByb3dzO1xyXG4gICAgdGhpcy5jb2xzID0gY29scztcclxuICAgIHRoaXMuYXJyID0gW107XHJcbiAgICB0aGlzLnR1cm4xID0gXCJcIjtcclxuICAgIHRoaXMudHVybjIgPSBcIlwiO1xyXG4gICAgdGhpcy5sYXN0VGlsZSA9IFwiXCI7XHJcbiAgICB0aGlzLnRyaWVzID0gMDtcclxuICAgIHRoaXMucGFpcnMgPSAwO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFN0YXJ0aW5nIHBvaW50IG9mIHRoZSBnYW1lXHJcbiAqL1xyXG5NZW1vcnkucHJvdG90eXBlLnN0YXJ0R2FtZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5jbGVhcigpO1xyXG4gICAgdGhpcy5jcmVhdGVBcnJheSgpO1xyXG4gICAgdGhpcy5jcmVhdGVCb2FyZCgpO1xyXG59O1xyXG5cclxuTWVtb3J5LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlDb250YWluZXJcIik7XHJcbiAgICB3aGlsZSAoZWwuaGFzQ2hpbGROb2RlcygpKSB7XHJcbiAgICAgICAgZWwucmVtb3ZlQ2hpbGQoZWwubGFzdENoaWxkKTtcclxuICAgIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBEeW5hbWljYWxseSBjcmVhdGVzIHRoZSBib2FyZFxyXG4gKi9cclxuTWVtb3J5LnByb3RvdHlwZS5jcmVhdGVCb2FyZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5Q29udGFpbmVyXCIpO1xyXG4gICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNxdWl6VGVtcGxhdGVcIilbMF0uY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcclxuICAgIHZhciBhO1xyXG5cclxuICAgIHRoaXMuYXJyLmZvckVhY2goZnVuY3Rpb24odGlsZSwgaW5kZXgpIHtcclxuICAgICAgICBhID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZSwgdHJ1ZSk7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGEpO1xyXG4gICAgICAgIGlmICgoaW5kZXggKyAxKSAlIHRoaXMuY29scyA9PT0gMCkge1xyXG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHZhciBpbWcgPSBldmVudC50YXJnZXQubm9kZU5hbWUgPT09IFwiSU1HXCIgPyBldmVudC50YXJnZXQgOiBldmVudC50YXJnZXQuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcbiAgICAgICAgICAgIHRoaXMudHVybkJyaWNrKHRpbGUsIGluZGV4LCBpbWcpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xyXG4gICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbn07XHJcblxyXG4vKipcclxuICogRHluYW1pY2FsbHkgY3JlYXRlcyB0aGUgYXJyYXkgZm9yIHRoZSBzZWxlY3Rpb24gb2YgaW1hZ2VzXHJcbiAqL1xyXG5NZW1vcnkucHJvdG90eXBlLmNyZWF0ZUFycmF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8PSAoKHRoaXMucm93cyAqIHRoaXMuY29scykgLyAyKTsgaSArPSAxKSB7XHJcbiAgICAgICAgdGhpcy5hcnIucHVzaChpKTtcclxuICAgICAgICB0aGlzLmFyci5wdXNoKGkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLnNodWZmbGUodGhpcy5hcnIpO1xyXG59O1xyXG5cclxuTWVtb3J5LnByb3RvdHlwZS50dXJuQnJpY2sgPSBmdW5jdGlvbih0aWxlLCBpbmRleCwgaW1nKSB7XHJcblxyXG4gICAgLy9jb25zb2xlLmxvZyh0aWxlKTtcclxuICAgIC8vY29uc29sZS5sb2coaW5kZXgpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhpbWcpO1xyXG5cclxuICAgIGlmICh0aGlzLnR1cm4yKSB7IHJldHVybjsgfVxyXG5cclxuICAgIGltZy5zcmMgPSBcImltYWdlL1wiICsgdGlsZSArIFwiLnBuZ1wiO1xyXG5cclxuICAgIGlmICghdGhpcy50dXJuMSkge1xyXG4gICAgICAgIHRoaXMudHVybjEgPSBpbWc7XHJcbiAgICAgICAgdGhpcy5sYXN0VGlsZSA9IHRpbGU7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoaW1nID09PSB0aGlzLnR1cm4xKSB7IHJldHVybjsgfVxyXG5cclxuICAgICAgICB0aGlzLnRyaWVzICs9IDE7XHJcblxyXG4gICAgICAgIHRoaXMudHVybjIgPSBpbWc7XHJcblxyXG4gICAgICAgIGlmICh0aWxlID09PSB0aGlzLmxhc3RUaWxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFpcnMgKz0gMTtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGFpcnMgPT09ICh0aGlzLmNvbHMgKiB0aGlzLnJvd3MpIC8gMikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJXb24gb24gXCIgKyB0aGlzLnRyaWVzICsgXCIgbnVtYmVyIG9mIHRyaWVzIVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudHVybjEucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKFwicmVtb3ZlZFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudHVybjIucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKFwicmVtb3ZlZFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudHVybjEgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMiA9IG51bGw7XHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgMzAwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudHVybjEuc3JjID0gXCJpbWFnZS8wLnBuZ1wiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMi5zcmMgPSBcImltYWdlLzAucG5nXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4xID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMudHVybjIgPSBudWxsO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIDUwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRoaXMgcHJvdG90eXBlIGhhbmRsZXMgdGhlIHNodWZmbGluZyBvZiB0aGUgZGVja1xyXG4gKiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI0NTA5NTQvaG93LXRvLXJhbmRvbWl6ZS1zaHVmZmxlLWEtamF2YXNjcmlwdC1hcnJheVxyXG4gKiBAcGFyYW0gaW5kZXhBcnIgLSB0aGUgYXJyYXkgdG8gYmUgc2h1ZmZsZWRcclxuICogQHJldHVybnMgeyp9XHJcbiAqL1xyXG5NZW1vcnkucHJvdG90eXBlLnNodWZmbGUgPSBmdW5jdGlvbihpbmRleEFycikge1xyXG4gICAgdmFyIGFycmF5ID0gaW5kZXhBcnI7XHJcbiAgICB2YXIgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoO1xyXG4gICAgdmFyIHRlbXBvcmFyeVZhbHVlO1xyXG4gICAgdmFyIHJhbmRvbUluZGV4O1xyXG5cclxuICAgIHdoaWxlIChjdXJyZW50SW5kZXggIT09IDApIHtcclxuXHJcbiAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xyXG5cclxuICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XHJcbiAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYXJyYXk7XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW1vcnk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIG5ld1dpbmRvdyA9IHJlcXVpcmUoXCIuL3dpbmRvd1wiKTtcclxudmFyIE1lbW9yeSA9IHJlcXVpcmUoXCIuL01lbW9yeVwiKTtcclxuXHJcbm5ld1dpbmRvdy5uZXdXaW5kb3coKTtcclxuXHJcbnZhciBidXR0b25TdGFydCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3RhcnRNZW1vcnlcIik7XHJcblxyXG5idXR0b25TdGFydC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB2YXIgZ2FtZSA9IG5ldyBNZW1vcnkoNCwgNCk7XHJcbiAgICBnYW1lLnN0YXJ0R2FtZSgpO1xyXG59LCBmYWxzZSk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLyoqXHJcbiAqIENvZGUgdXNlZCBhbmQgbW9kaWZpZWQgZnJvbSB0aGlzIHNvdXJjZSBcImh0dHA6Ly9jb2RlcGVuLmlvL3RoZWJhYnlkaW5vL3Blbi9BZmFtc1wiLlxyXG4gKi9cclxuZnVuY3Rpb24gbmV3V2luZG93KCkge1xyXG4gICAgdmFyIHBvaW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb2ludFwiKTtcclxuICAgIHZhciBwMSA9IHtcclxuICAgICAgICB4OiBwYXJzZUludChwb2ludC5kYXRhc2V0LngsIDEwKSxcclxuICAgICAgICB5OiBwYXJzZUludChwb2ludC5kYXRhc2V0LnksIDEwKVxyXG4gICAgfTtcclxuICAgIHZhciBwMCA9IHtcclxuICAgICAgICB4OiBwYXJzZUludChwb2ludC5kYXRhc2V0LngsIDEwKSxcclxuICAgICAgICB5OiBwYXJzZUludChwb2ludC5kYXRhc2V0LnksIDEwKVxyXG4gICAgfTtcclxuICAgIHZhciBjb29yZHMgPSB7XHJcbiAgICAgICAgeDogcGFyc2VJbnQocG9pbnQuZGF0YXNldC54LCAxMCksXHJcbiAgICAgICAgeTogcGFyc2VJbnQocG9pbnQuZGF0YXNldC55LCAxMClcclxuICAgIH07XHJcbiAgICB2YXIgZmxhZztcclxuXHJcbiAgICB2YXIgZHJhZyA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBwMSA9IHt4OiBlLmNsaWVudFgsIHk6IGUuY2xpZW50WX07XHJcblxyXG4gICAgICAgIHBvaW50LmRhdGFzZXQueCA9IGNvb3Jkcy54ICsgcDEueCAtIHAwLng7XHJcbiAgICAgICAgcG9pbnQuZGF0YXNldC55ID0gY29vcmRzLnkgKyBwMS55IC0gcDAueTtcclxuXHJcbiAgICAgICAgcG9pbnQuc3R5bGVbXCItd2Via2l0LXRyYW5zZm9ybVwiXSA9XHJcbiAgICAgICAgICAgIFwidHJhbnNsYXRlKFwiICsgcG9pbnQuZGF0YXNldC54ICsgXCJweCwgXCIgKyBwb2ludC5kYXRhc2V0LnkgKyBcInB4KVwiO1xyXG4gICAgICAgIHBvaW50LnN0eWxlLnRyYW5zZm9ybSA9XHJcbiAgICAgICAgICAgIFwidHJhbnNsYXRlKFwiICsgcG9pbnQuZGF0YXNldC54ICsgXCJweCwgXCIgKyBwb2ludC5kYXRhc2V0LnkgKyBcInB4KVwiO1xyXG4gICAgfTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdmFyIHQgPSBlLnRhcmdldDtcclxuXHJcbiAgICAgICAgaWYgKHQgPT09IHBvaW50KSB7XHJcbiAgICAgICAgICAgIHAwID0ge3g6IGUuY2xpZW50WCwgeTogZS5jbGllbnRZfTtcclxuICAgICAgICAgICAgZmxhZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBkcmFnLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmbGFnID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgZmFsc2UpO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoZmxhZykge1xyXG4gICAgICAgICAgICBjb29yZHMueCArPSBwMS54IC0gcDAueDtcclxuICAgICAgICAgICAgY29vcmRzLnkgKz0gcDEueSAtIHAwLnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBkcmFnLCBmYWxzZSk7XHJcbiAgICB9LCBmYWxzZSk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIG5ld1dpbmRvdzogbmV3V2luZG93XHJcbn07XHJcbiJdfQ==
