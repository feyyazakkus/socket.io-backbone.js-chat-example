var MessageSender = (function () {

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

    function TextMessageSender(socketObj, messageInput) {
        this.messageInput = messageInput;
        this.socketObj = socketObj;

        this.send = function (messageData) {

            if (this.messageInput.val() != "") {

                messageData.message = this.messageInput.val();

                this.socketObj.emit('message', messageData);
                this.messageInput.val('');
            }
        }
    }

    return TextMessageSender;
}());


var LinkMessageSender = (function () {

    var pattern = /https?:\/\/(www)?\.?([\w\-]+)\.([\w]+)/gm,
        textMessage = '',
        matches = [];

    function LinkMessageSender(socketObj, messageInput) {
        this.messageInput = messageInput;
        this.socketObj = socketObj;

        this.send = function (messageData) {

            if (this.messageInput.val() != "") {

                matches = pattern.exec(this.messageInput.val());

                console.log(matches);

                textMessage = matches['input'].replace(matches[0], '<a target="_blank" href="'+matches[0]+'">'+matches[0]+'</a>');
                messageData.message = textMessage;

                this.socketObj.emit('message', messageData);
                this.messageInput.val('');
            }
        }
    }

    return LinkMessageSender;
}());