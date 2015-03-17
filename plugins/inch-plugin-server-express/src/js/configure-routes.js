"use strict";

var each = require('lodash').each;

module.exports = function (callbacks, app, pages, extension) {
    each(pages, function (page) {
        app.get('/:mode/' + page, function (req, res) {
            var mode = req.params.mode;

            if (callbacks[mode] === undefined) {
                res.redirect('/');
                return;
            }

            res.render(page + extension, {html: "", mode: mode});
        });
    });
};