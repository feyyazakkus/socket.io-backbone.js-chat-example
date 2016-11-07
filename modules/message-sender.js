var MessageSender = (function () {
    'use strict';
    
    function MessageSender(adapter) {
        this.adapter = adapter;
    }

    MessageSender.prototype = {

        send: function (messageData) {
            var adapter = this.adapter;
            adapter.send(messageData);
        }
    };

    return MessageSender;

}());

var TextMessageSender = (function () {
    'use strict';
    
    function TextMessageSender(socketObj, messageInput) {
        this.messageInput = messageInput;
        this.socketObj = socketObj;

        this.send = function (messageData) {

            if (this.messageInput.val() !== "") {

                messageData.message = this.messageInput.val();

                this.socketObj.emit('message', messageData);
                this.messageInput.val('');
            }
        };
    }

    return TextMessageSender;
}());


var LinkMessageSender = (function () {
    'use strict';
    
    var pattern = /(?:(?:https?:\/\/)|(?:www\.)?)[\-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b(?:[\-a-zA-Z0-9@:%_\+.~#?&\/=]*)/g,
        textMessage = '',
        matches = [],
        httpText = '';

    function LinkMessageSender(socketObj, messageInput) {
        this.messageInput = messageInput;
        this.socketObj = socketObj;

        this.send = function (messageData) {

            if (this.messageInput.val() !== "") {

                matches = pattern.exec(this.messageInput.val());

                if (matches[0].search(/http/i) === -1) {
                    httpText = 'http:\/\/';
                }

                textMessage = matches.input.replace(matches[0], '<a target="_blank" href="' + httpText + matches[0] + '">' + matches[0] + '</a>');
                messageData.message = textMessage;

                this.socketObj.emit('message', messageData);
                this.messageInput.val('');
            }
        };
    }

    return LinkMessageSender;
}());

var ImageLinkMessageSender = (function () {
    'use strict';
    
    var pattern = /(?:(?:https?:\/\/)|(?:www\.)?)[\-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b(?:[\-a-zA-Z0-9@:%_\+.~#?&\/=]*)/g,
        textMessage = '',
        matches = [],
        httpText = '';

    function ImageLinkMessageSender(socketObj, messageInput) {
        this.messageInput = messageInput;
        this.socketObj = socketObj;

        this.send = function (messageData) {

            if (this.messageInput.val() !== "") {

                matches = pattern.exec(this.messageInput.val());

                if (matches[0].search(/http/i) === -1) {
                    httpText = 'http\:\/\/';
                }
                
                console.log(matches);

                textMessage = matches.input.replace(matches[0], '<a target="_blank" href="' + httpText + matches[0] + '"><img src="' + matches[0] + '" height="100px" /></a>');
                messageData.message = textMessage;

                this.socketObj.emit('message', messageData);
                this.messageInput.val('');
            }
        };
    }

    return ImageLinkMessageSender;
}());