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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvTWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIE1lbW9yeSBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHJvd3MgLSBUaGUgYW1vdW50IG9mIHJvd3NcbiAqIEBwYXJhbSBjb2xzIC0gVGhlIGFtb3VudCBvZiBjb2x1bW5zXG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIE1lbW9yeSA9IGZ1bmN0aW9uKHJvd3MsIGNvbHMpIHtcbiAgICB0aGlzLnJvd3MgPSByb3dzO1xuICAgIHRoaXMuY29scyA9IGNvbHM7XG4gICAgdGhpcy5hcnIgPSBbXTtcbiAgICB0aGlzLnR1cm4xID0gXCJcIjtcbiAgICB0aGlzLnR1cm4yID0gXCJcIjtcbiAgICB0aGlzLmxhc3RUaWxlID0gXCJcIjtcbiAgICB0aGlzLnRyaWVzID0gMDtcbiAgICB0aGlzLnBhaXJzID0gMDtcbn07XG5cbi8qKlxuICogU3RhcnRpbmcgcG9pbnQgb2YgdGhlIGdhbWVcbiAqL1xuTWVtb3J5LnByb3RvdHlwZS5zdGFydEdhbWUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNsZWFyKCk7XG4gICAgdGhpcy5jcmVhdGVBcnJheSgpO1xuICAgIHRoaXMuY3JlYXRlQm9hcmQoKTtcbn07XG5cbk1lbW9yeS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeUNvbnRhaW5lclwiKTtcbiAgICB3aGlsZSAoZWwuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgIGVsLnJlbW92ZUNoaWxkKGVsLmxhc3RDaGlsZCk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBEeW5hbWljYWxseSBjcmVhdGVzIHRoZSBib2FyZFxuICovXG5NZW1vcnkucHJvdG90eXBlLmNyZWF0ZUJvYXJkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5Q29udGFpbmVyXCIpO1xuICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjcXVpelRlbXBsYXRlXCIpWzBdLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgdmFyIGE7XG5cbiAgICB0aGlzLmFyci5mb3JFYWNoKGZ1bmN0aW9uKHRpbGUsIGluZGV4KSB7XG4gICAgICAgIGEgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLCB0cnVlKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGEpO1xuICAgICAgICBpZiAoKGluZGV4ICsgMSkgJSB0aGlzLmNvbHMgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgYS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgaW1nID0gZXZlbnQudGFyZ2V0Lm5vZGVOYW1lID09PSBcIklNR1wiID8gZXZlbnQudGFyZ2V0IDogZXZlbnQudGFyZ2V0LmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICAgICAgdGhpcy50dXJuQnJpY2sodGlsZSwgaW5kZXgsIGltZyk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbn07XG5cbi8qKlxuICogRHluYW1pY2FsbHkgY3JlYXRlcyB0aGUgYXJyYXkgZm9yIHRoZSBzZWxlY3Rpb24gb2YgaW1hZ2VzXG4gKi9cbk1lbW9yeS5wcm90b3R5cGUuY3JlYXRlQXJyYXkgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8PSAoKHRoaXMucm93cyAqIHRoaXMuY29scykgLyAyKTsgaSArPSAxKSB7XG4gICAgICAgIHRoaXMuYXJyLnB1c2goaSk7XG4gICAgICAgIHRoaXMuYXJyLnB1c2goaSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc2h1ZmZsZSh0aGlzLmFycik7XG59O1xuXG5NZW1vcnkucHJvdG90eXBlLnR1cm5CcmljayA9IGZ1bmN0aW9uKHRpbGUsIGluZGV4LCBpbWcpIHtcblxuICAgIC8vY29uc29sZS5sb2codGlsZSk7XG4gICAgLy9jb25zb2xlLmxvZyhpbmRleCk7XG4gICAgLy9jb25zb2xlLmxvZyhpbWcpO1xuXG4gICAgaWYgKHRoaXMudHVybjIpIHsgcmV0dXJuOyB9XG5cbiAgICBpbWcuc3JjID0gXCJpbWFnZS9cIiArIHRpbGUgKyBcIi5wbmdcIjtcblxuICAgIGlmICghdGhpcy50dXJuMSkge1xuICAgICAgICB0aGlzLnR1cm4xID0gaW1nO1xuICAgICAgICB0aGlzLmxhc3RUaWxlID0gdGlsZTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpbWcgPT09IHRoaXMudHVybjEpIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgdGhpcy50cmllcyArPSAxO1xuXG4gICAgICAgIHRoaXMudHVybjIgPSBpbWc7XG5cbiAgICAgICAgaWYgKHRpbGUgPT09IHRoaXMubGFzdFRpbGUpIHtcbiAgICAgICAgICAgIHRoaXMucGFpcnMgKz0gMTtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhaXJzID09PSAodGhpcy5jb2xzICogdGhpcy5yb3dzKSAvIDIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIldvbiBvbiBcIiArIHRoaXMudHJpZXMgKyBcIiBudW1iZXIgb2YgdHJpZXMhXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMudHVybjEucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKFwicmVtb3ZlZFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4yLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZChcInJlbW92ZWRcIik7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy50dXJuMiA9IG51bGw7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIDMwMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4xLnNyYyA9IFwiaW1hZ2UvMC5wbmdcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4yLnNyYyA9IFwiaW1hZ2UvMC5wbmdcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4xID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4yID0gbnVsbDtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgNTAwKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogVGhpcyBwcm90b3R5cGUgaGFuZGxlcyB0aGUgc2h1ZmZsaW5nIG9mIHRoZSBkZWNrXG4gKiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI0NTA5NTQvaG93LXRvLXJhbmRvbWl6ZS1zaHVmZmxlLWEtamF2YXNjcmlwdC1hcnJheVxuICogQHBhcmFtIGluZGV4QXJyIC0gdGhlIGFycmF5IHRvIGJlIHNodWZmbGVkXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuTWVtb3J5LnByb3RvdHlwZS5zaHVmZmxlID0gZnVuY3Rpb24oaW5kZXhBcnIpIHtcbiAgICB2YXIgYXJyYXkgPSBpbmRleEFycjtcbiAgICB2YXIgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoO1xuICAgIHZhciB0ZW1wb3JhcnlWYWx1ZTtcbiAgICB2YXIgcmFuZG9tSW5kZXg7XG5cbiAgICB3aGlsZSAoY3VycmVudEluZGV4ICE9PSAwKSB7XG5cbiAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xuICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcblxuICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XG4gICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZW1vcnk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG5ld1dpbmRvdyA9IHJlcXVpcmUoXCIuL3dpbmRvd1wiKTtcbnZhciBNZW1vcnkgPSByZXF1aXJlKFwiLi9NZW1vcnlcIik7XG5cbm5ld1dpbmRvdy5uZXdXaW5kb3coKTtcblxudmFyIGJ1dHRvblN0YXJ0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdGFydE1lbW9yeVwiKTtcblxuYnV0dG9uU3RhcnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB2YXIgZ2FtZSA9IG5ldyBNZW1vcnkoNCwgNCk7XG4gICAgZ2FtZS5zdGFydEdhbWUoKTtcbn0sIGZhbHNlKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENvZGUgdXNlZCBhbmQgbW9kaWZpZWQgZnJvbSB0aGlzIHNvdXJjZSBcImh0dHA6Ly9jb2RlcGVuLmlvL3RoZWJhYnlkaW5vL3Blbi9BZmFtc1wiLlxuICovXG5mdW5jdGlvbiBuZXdXaW5kb3coKSB7XG4gICAgdmFyIHBvaW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb2ludFwiKTtcbiAgICB2YXIgcDEgPSB7XG4gICAgICAgIHg6IHBhcnNlSW50KHBvaW50LmRhdGFzZXQueCwgMTApLFxuICAgICAgICB5OiBwYXJzZUludChwb2ludC5kYXRhc2V0LnksIDEwKVxuICAgIH07XG4gICAgdmFyIHAwID0ge1xuICAgICAgICB4OiBwYXJzZUludChwb2ludC5kYXRhc2V0LngsIDEwKSxcbiAgICAgICAgeTogcGFyc2VJbnQocG9pbnQuZGF0YXNldC55LCAxMClcbiAgICB9O1xuICAgIHZhciBjb29yZHMgPSB7XG4gICAgICAgIHg6IHBhcnNlSW50KHBvaW50LmRhdGFzZXQueCwgMTApLFxuICAgICAgICB5OiBwYXJzZUludChwb2ludC5kYXRhc2V0LnksIDEwKVxuICAgIH07XG4gICAgdmFyIGZsYWc7XG5cbiAgICB2YXIgZHJhZyA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgcDEgPSB7eDogZS5jbGllbnRYLCB5OiBlLmNsaWVudFl9O1xuXG4gICAgICAgIHBvaW50LmRhdGFzZXQueCA9IGNvb3Jkcy54ICsgcDEueCAtIHAwLng7XG4gICAgICAgIHBvaW50LmRhdGFzZXQueSA9IGNvb3Jkcy55ICsgcDEueSAtIHAwLnk7XG5cbiAgICAgICAgcG9pbnQuc3R5bGVbXCItd2Via2l0LXRyYW5zZm9ybVwiXSA9XG4gICAgICAgICAgICBcInRyYW5zbGF0ZShcIiArIHBvaW50LmRhdGFzZXQueCArIFwicHgsIFwiICsgcG9pbnQuZGF0YXNldC55ICsgXCJweClcIjtcbiAgICAgICAgcG9pbnQuc3R5bGUudHJhbnNmb3JtID1cbiAgICAgICAgICAgIFwidHJhbnNsYXRlKFwiICsgcG9pbnQuZGF0YXNldC54ICsgXCJweCwgXCIgKyBwb2ludC5kYXRhc2V0LnkgKyBcInB4KVwiO1xuICAgIH07XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciB0ID0gZS50YXJnZXQ7XG5cbiAgICAgICAgaWYgKHQgPT09IHBvaW50KSB7XG4gICAgICAgICAgICBwMCA9IHt4OiBlLmNsaWVudFgsIHk6IGUuY2xpZW50WX07XG4gICAgICAgICAgICBmbGFnID0gdHJ1ZTtcblxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZHJhZywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZmxhZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZmxhZykge1xuICAgICAgICAgICAgY29vcmRzLnggKz0gcDEueCAtIHAwLng7XG4gICAgICAgICAgICBjb29yZHMueSArPSBwMS55IC0gcDAueTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGRyYWcsIGZhbHNlKTtcbiAgICB9LCBmYWxzZSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgbmV3V2luZG93OiBuZXdXaW5kb3dcbn07XG4iXX0=
