var path = require('path');

module.exports = {

    cssFiles: [
        'bower_components/bootstrap/dist/css/bootstrap.min.css',
        'css/*.css'
    ],

    jsFiles: [
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/bootstrap/dist/js/bootstrap.min.js',
        'bower_components/angular/angular.min.js',
        'apigee/apigee.min.js',
        'js/script.js',
        'js/app.js'
    ],

    resFiles: [
        'res/**/*'
    ],

    viewFiles: [
        'views/**/*.html'
    ],

    destFolder: function (type) {
        if (type && type[0] != '/') type = '/' + type;
        return "dist" + (type || '');
    },

    filesToInject: function () {
        return this.jsFiles.concat(this.cssFiles);
    }
};
