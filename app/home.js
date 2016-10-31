App.HomeView = Backbone.View.extend({

    events: {
        'click button#join': 'joinChat'
    },

    joinChat: function () {

        var username = $('#username').val();

        if (username != '') {
            app.navigate('chat?username=' + username , {
                trigger: true
            });    
        }       

        return false;
    },

    render:function () {
        this.$el.html(this.template());
        return this;
    },
});