App.ChatView = Backbone.View.extend({
	
	events: {
		'click #send': 'sendMessage',
		'click .clear': 'clear',
		'click .logout': 'logout',
		'click .list-friends li': 'selectUser'
	},

	initialize: function (options) {

		var self = this;
		this.messageCount = 0;
		this.username = options.username;
		this.receiver = 'everyone';
		this.messages = {};		

		if (!App.socket) {
			App.socket = io.connect('', {
			   query: 'username=' + this.username
		   });
		}

		// keep track of chat messages
		App.socket.on('message', function (data) {

			data.position = 'left';

			// save message
			if (data.type != "info") {

				var user = '';
				if (data.receiver == 'everyone') {
					user = 'everyone'
				} else {
					user = data.username;
				}

				if(!self.messages[user]) {
					self.messages[user] = [];
				}
				self.messages[user].push(data);
				console.log(self.messages);
			} else {
				self.print(data);
			}

			// print message or show alert
			if (data.receiver == 'everyone')  {
				if (self.receiver == 'everyone') {
					self.print(data);
				} else {
					$('#everyone').find('.message-alert').addClass('visible');
				}

			} else {
				if (self.receiver == data.username) {
					self.print(data);
				} else {
					$('#'+data.username).find('.message-alert').addClass('visible');    
				}
			}

			self.setScroll();

		});

		// keep track of users
		App.socket.on('users', function (data) {

			// remove current user
			data = _.reject(data, function (user) {
				return user.username === self.username;
			});

			$('menu.list-friends').html(self.usersTemplate({users: data}))
		});

	},

	render: function () {
	  this.$el.html(this.template({username: this.username}));
	  return this;
  },

	// send message to the server
	sendMessage: function () {
		
		if ($('#input-message').val() == '') {
			return false;
		}

		var messageSender, senderClass, data, pattern, res;

		pattern = /(www\.)?([\w\-]+)\.([\w]+)/gm;
		res = pattern.test( $('#input-message').val());

		if (res) {
			res = /([a-zA-Z-0-9_]+)\.(jpg|png|gif)/.test( $('#input-message').val());
			if (res) {
				senderClass = new ImageLinkMessageSender(App.socket, $('#input-message'));
			}
			else {
				senderClass = new LinkMessageSender(App.socket, $('#input-message'));
			}
		}
		else {
			senderClass = new TextMessageSender(App.socket, $('#input-message'));
		}

		messageSender = new MessageSender(senderClass);


		var date = new Date();
		var time = App.Utils.pad(date.getHours()) + ':' + App.Utils.pad(date.getMinutes());

		data = {
			username: this.username,
			receiver: this.receiver,
			type: 'message',
			date: date,
			time: time
		};

		messageSender.send(data);

		// print message
		data.position = 'right';
		this.print(data);
		this.setScroll();

		// save message
		if(!this.messages[this.receiver]) {
			this.messages[this.receiver] = [];
		}
		this.messages[this.receiver].push(data);
		console.log(this.messages);

		return false;
	},

	selectUser: function (event) {

		this.refresh();
		this.receiver = event.currentTarget.id;

		$('.list-friends li').removeClass('active');
		$('#'+this.receiver).addClass('active');
		
		$('.receiver').html(this.receiverTemplate({
			receiver: this.receiver
		}));

		var conversation = this.messages[this.receiver];

		if (conversation) {
			var msgTmpl = '';

			for (var i = 0; i < conversation.length; i++) {
				msgTmpl += this.messageTemplate(conversation[i]);
			}

			this.messageCount = conversation.length;
			$('.count span').html(this.messageCount);
			$(".messages").append(msgTmpl);

			this.setScroll();
		}

		$('#'+this.receiver).find('.message-alert').removeClass('visible');
	},

	// print message to message box
	print: function (data) {
		this.messageCount++;
		$('.count span').html(this.messageCount);
		$(".messages").append(this.messageTemplate(data));
	},

	// clear message box
	refresh: function () {
		this.messageCount = 0;
		$('.count span').html(this.messageCount);
		$(".messages").html('');
	},

	// remove messages
	clear: function () {
		this.refresh();
		this.messages[this.receiver] = [];
	},

	// set scroll to bottom of message box
	setScroll: function () {
		var scroll = document.getElementById("messages").scrollHeight;
		$(".chat-body").scrollTop(scroll);
	},

	// disconnect user
	logout: function () {
		App.socket.disconnect();
		window.location = '/';
	},

	messageTemplate: _.template($("#message").html()),

	usersTemplate: _.template($("#chatUsers").html()),

	receiverTemplate: _.template($("#receiver").html())

});