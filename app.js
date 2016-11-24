var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var schedule = require('node-schedule');
var request = require('request');
var iconv = require('iconv-lite');
var moment = require('moment');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://resterminator:nodejssucks@ds139567.mlab.com:39567/resterminator');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Connect to the db
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Mongoose connected");
});

// Flush the xmlschema database at start
var Contrevenant_Schema = require(__dirname+'/models/contrevenant'); 
Contrevenant_Schema.remove({}, function(err) { 
   console.log('contrevenants list cleaned'); 
});

// Store refresh the dataset
request.get({
    uri : 'http://donnees.ville.montreal.qc.ca/dataset/a5c1f0b9-261f-4247-99d8-f28da5000688/resource/92719d9b-8bf2-4dfd-b8e0-1021ffcaee2f/download/inspection-aliments-contrevenants.xml',
    encoding : null
}, function(err, resp, body){    
    var body = iconv.decode(body, 'iso-8859-1');
    var parser = require('xml2json');
    var contrevenants_json = JSON.parse(parser.toJson(body));

    for(var i in contrevenants_json.contrevenants.contrevenant)
    {
        c = contrevenants_json.contrevenants.contrevenant[i];

        try {
            c.date_infraction  = moment(c.date_infraction, "DD MMMM YYYY", 'fr').format("YYYY-MM-DD");
        } catch(err) {
            console.log("ERROR : " + err + " " + c.date_infraction);
        }

        try {
            c.date_jugement  = moment(c.date_jugement, "DD MMMM YYYY", 'fr').format("YYYY-MM-DD");
        } catch(err) {
            console.log("ERROR : " + err + " " + c.date_jugement);
        }

        var c_schema = new Contrevenant_Schema(c);

        c_schema.save(function (err, c_schema) {
            if (err) return console.error(err);
        });
    }
            
    console.log("Contrevenants list refreshed");
});

// Each midnight, refresh the dataset
var j = schedule.scheduleJob({hour: 00, minute: 00}, function(){
    XMLSchema.remove({}, function(err) { 
    console.log('XMLSchema cleaned'); 
    });
    
    request.get({
        uri : 'http://donnees.ville.montreal.qc.ca/dataset/a5c1f0b9-261f-4247-99d8-f28da5000688/resource/92719d9b-8bf2-4dfd-b8e0-1021ffcaee2f/download/inspection-aliments-contrevenants.xml',
        encoding : null
    },
    function(err, resp, body){    
        var body = iconv.decode(body, 'iso-8859-1');
        var parser = require('xml2json');
        var contrevenants_json = JSON.parse(parser.toJson(body));

        for(var i in contrevenants_json.contrevenants.contrevenant)
        {
            c = contrevenants_json.contrevenants.contrevenant[i];

            try {
                c.date_infraction  = moment(c.date_infraction, "DD MMMM YYYY", 'fr').format("YYYY-MM-DD");
            } catch(err) {
                console.log("ERROR : " + err + " " + c.date_infraction);
            }

            try {
                c.date_jugement  = moment(c.date_jugement, "DD MMMM YYYY", 'fr').format("YYYY-MM-DD");
            } catch(err) {
                console.log("ERROR : " + err + " " + c.date_jugement);
            }

            console.log(c);

            var c_schema = new Contrevenant_Schema(c);

            c_schema.save(function (err, c_schema) {
                if (err) return console.error(err);
            });
        }
                
        console.log("Contrevenants list refreshed");
    });
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
