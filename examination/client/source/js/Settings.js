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
