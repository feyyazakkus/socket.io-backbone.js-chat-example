"use strict";

window.App = window.App || {};

App.Router = Backbone.Router.extend({

    routes: {
        "": "home",
        "chat?username=:username": "chat",
    },

    $container: $('#content'),

    home: function () {
        
        if (!this.homeView) {
            this.homeView = new App.HomeView();
            this.$container.html(this.homeView.render().el);
            $('#username').focus();
        }
    },

    chat: function (username) {

        this.chatView = new App.ChatView({
            username: username
        });
        this.$container.html(this.chatView.render().el);
    },

});

