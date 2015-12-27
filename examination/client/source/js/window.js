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


