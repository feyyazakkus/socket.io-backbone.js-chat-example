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

    function LinkMessageSender(socketObj, messageInput) {
        this.messageInput = messageInput;
        this.socketObj = socketObj;

        this.send = function (messageData) {

            if (this.messageInput.val() != "") {

                messageData.message = '<a target="_blank" href="'+this.messageInput.val()+'">'+this.messageInput.val()+'</a>';

                this.socketObj.emit('message', messageData);
                this.messageInput.val('');
            }
        }
    }

    return LinkMessageSender;
}());