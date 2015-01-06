
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');


// the ExpressJS App
var app = express();

// configuration of port, templates (/views), static files (/public)
// and other expressjs settings for the web server.

// server port number
app.set('port', process.env.PORT || 5000);

//  templates directory to 'views'
app.set('views', __dirname + '/views');

// setup template engine - we're using Hogan-Express
app.set('view engine', 'html');
app.set('layout','layout');
app.engine('html', require('hogan-express')); // https://github.com/vol4ok/hogan-express

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// connecting to database
app.db = mongoose.connect(process.env.MONGOLAB_URI);
console.log("connected to database");

// ROUTES

var routes = require('./routes/index.js');

app.get('/', routes.index);

//new astronaut routes
app.get('/create',routes.astroForm); //display form
app.post('/create',routes.createAstro); //form POST submits here

// display a single astronaut
app.get('/astronauts/:astro_id', routes.detail);

// edit astronaut
app.get('/astronauts/:astro_id/edit', routes.editAstroForm); //GET display form
app.post('/astronauts/:astro_id/edit', routes.updateAstro); //POST update database

// delete astronaut
app.get('/astronauts/:astro_id/delete', routes.deleteAstro);

// add ship's log
app.post('/astronauts/:astro_id/addshiplog', routes.postShipLog);

// API JSON Data routes
app.get('/data/astronauts',routes.data_all);
app.get('/data/astronauts/:astro_id', routes.data_detail);

// consume a remote API
app.get('/remote_api_demo', routes.remote_api);

// create NodeJS HTTP server using 'app'
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});













