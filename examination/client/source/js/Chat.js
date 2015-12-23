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

    //EventListener for when communication is open
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

            //Scrolls down when new message is arrived
            var chatEl = document.querySelector(".textContainer");
            chatEl.scrollTop = chatEl.scrollHeight;
        }

    }.bind(this));
};


module.exports = Chat;
