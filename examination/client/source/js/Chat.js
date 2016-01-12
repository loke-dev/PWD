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
        console.log(this.message.channel);
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
    console.log(this.data);
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
