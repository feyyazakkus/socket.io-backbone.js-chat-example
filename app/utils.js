App.Utils = {

    // The Template Loader. Used to asynchronously load templates located in separate .html files
    templateLoader: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (App[view]) {
                deferreds.push($.get('views/' + view + '.html', function(data) {
                    App[view].prototype.template = _.template(data);
                }, 'html'));
            } else {
                alert(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    }

};