/* global require */

var browserSync = require('browser-sync');
browserSync({
  open: true,
  port: 3000,
  server: {
    baseDir: './',
    index: "project.html",
    middleware: function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      next();
    }
  }
});