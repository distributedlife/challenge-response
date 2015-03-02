"use strict";

var _ = require('lodash');

module.exports = function (callbacks, app, io, pages, extension) {
    _.each(pages, function (page) {
        app.get('/:mode/' + page, function (req, res) {
            var mode = req.params.mode;

            if (callbacks[mode] === undefined) {
                res.redirect('/');
                return;
            }

            callbacks[mode](io);

            res.render(page + extension, {html: "", mode: mode});
        });
    });
};