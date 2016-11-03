App.HomeView = Backbone.View.extend({

    events: {
        'click button#join': 'joinChat'
    },

    joinChat: function () {

        $('.alert').removeClass('show');

        var username = $('#username').val();

        if (username != '') {

            App.socket = io.connect('', {
                query: 'username=' + username
            });

            App.socket.on('user_validation', function (data) {
                if (data.success) {
                    app.navigate('chat?username=' + username , {
                        trigger: true
                    });
                } else {
                    $('.alert').addClass('show');
                }
            });
        }

        return false;
    },

    render:function () {
        this.$el.html(this.template());
        return this;
    },
});