/*

  There are some minor modifications to the default Express setup
  Each is commented and marked with [SH] to make them easy to find

 */
global.basedir = __dirname;
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var cors = require("cors");
// [SH] Require Passport
var passport = require("passport");

// [SH] Bring in the data model
require("./api/models/db");
// [SH] Bring in the Passport config after model is defined
require("./api/config/passport");

// [SH] Bring in the routes for the API (delete the default routes)
var routesApi = require("./api/routes/index");
// var rout= require('./routes/index');

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
/*CORS*/
var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
};

//create a cors middleware
app.use(function(req, res, next) {
    //set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "PUT, GET, POST, DELETE, OPTIONS"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, X-Type-Data,X-Ccompany-Id, Content-Type, Accept"
    );
    next();
});

app.use(cors(corsOptions));

// [SH] Initialise Passport before using the route middleware
app.use(passport.initialize());

// [SH] Use the API routes when path starts with /api  --- Debug with DAta Log
app.use(
    "/api",
    function(req, res, next) {
        console.log( new Date(Date.now()).toLocaleString() +' -  '+req.method + " " + req.url);
        next();
    },
    routesApi
);
// app.use('/', rout);

// Static image
app.use("/files", express.static("./uploads"));
// app.use(express.static('images'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handlers

// [SH] Catch unauthorised errors
app.use(function(err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        res.status(401);
        res.json({ message: err.name + ": " + err.message });
    }
});

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: {}
    });
});

module.exports = app;