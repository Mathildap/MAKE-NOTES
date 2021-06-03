var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysql = require('mysql2');

var indexRouter = require('./routes/index');
var docsRouter = require('./routes/docs');

var app = express();

app.locals.con = mysql.createConnection({
    host: "localhost",
    port: "8889",
    user: "notesapp",
    password: "NotesSQL1.",
    database: "notesapp"
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/docs', docsRouter);

module.exports = app;
