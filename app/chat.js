App.ChatView = Backbone.View.extend({
	
	events: {
		'click #send': 'sendMessage',
		'click .refresh': 'refresh',
		'click .logout': 'logout'
	},

	messageTemplate: _.template($("#message").html()),

	usersTemplate: _.template($("#chatUsers").html()),

	initialize: function (options) {

		var self = this;

        this.messageCount = 0;
        this.username = options.username;

        if (!App.socket) {
        	App.socket = io.connect('', {
	            query: 'username=' + this.username
	        });
        }

		// keep track of chat messages
		App.socket.on('message', function (data) {

			self.messageCount++;
			console.log(data);
			$('.count span').html(self.messageCount);

			data.position = self.username == data.username ? 'right' : 'left';

			var messageObj = $(".messages");

		    messageObj.append(self.messageTemplate(data));

		    // animate scroll to bottom of message box
			var scroll = document.getElementById("messages").scrollHeight;
			$(".chat-body").animate({
			  scrollTop: scroll
			}, 300);

		});

		// keep track of users and users status
        App.socket.on('users', function (data) {
            
            // remove current user
            data = _.reject(data, function (user) {
            	return user.username === self.username;
            });

            console.log(data);

            $('menu.list-friends').html(self.usersTemplate({users: data}))
        });

	},

	render: function () {
		this.$el.html(this.template({username: this.username}));
        return this;
	},

	// send message to the server
	sendMessage: function () {

        var messageSender, senderClass, data, pattern, res;

        pattern = /(www\.)?([\w\-]+)\.([\w]+)/gm;
        res = pattern.test( $('#input-message').val());

        if (res) {
            senderClass = new LinkMessageSender(App.socket, $('#input-message'));
        }
        else {
            senderClass = new TextMessageSender(App.socket, $('#input-message'));
        }

        messageSender = new MessageSender(senderClass);

        data = {
            username: this.username,
            type: 'message',
            date: Date.now()
        };

        messageSender.send(data);
		
        return false;
	},


	// clear message box
	refresh: function () {
		this.messageCount = 0;
		$('.count span').html(this.messageCount);
		$(".messages").html('');
	},

	// disconnect user
	logout: function () {
		App.socket.disconnect();
		window.location = '/';
	}

});