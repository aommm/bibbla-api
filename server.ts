/// <reference path="typings/main.d.ts" />
import {Request, Response} from "express";
import morgan = require("morgan");

var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');

var search = require('./api/search');
var me = require('./api/me');
var {login} = require('./api/login');
var reservations = require('./api/reservations');
var books = require('./api/books')

var session = require('express-session');
var RedisStore = require('connect-redis')(session);

//var maxAge = 20*60*1000; // 20 mins
var maxAge = 2000000000; // ~23 days

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var sessionStore = new RedisStore({host: 'localhost', ttl: maxAge/1000});
app.use(session({
  store: sessionStore,
  secret: 'keyboard cat',
  cookie: {
    maxAge: maxAge
  }
}));

app.use(morgan('combined'));

app.get('/search/:s', function(req:Request, res:Response){
  search.search(req.params.s, callbacker(res));
});

app.post('/me/login', function(req:Request, res:Response) {
  me.login(req.body.username, req.body.password, callbacker(res));
});


app.get('/books/:id', function(req:Request, res:Response){
  books.getBook(req.params.id, callbacker(res));
});
// Temporary login form
app.get('/login', function (req:Request, res:Response) {
  var html = '<html><body><form method="POST" action="/login">' +
      '<input type="text" name="name" placeholder="Name"/><br/>' +
      '<input type="text" name="code" placeholder="Code"/><br/>' +
      '<input type="password" name="pin" placeholder="PIN"/><br/>' +
      '<input type="submit" value="log in"/>' +
      '</form><a href="/logout">log out</a></body></html>';
  res.send(html);
});

// Log in to gotlib
app.post('/login', function(req:Request, res:Response) {
  login(req.body.name, req.body.code, req.body.pin, req.session, callbacker(res));
});

// TODO change to post
app.get('/logout', function(req:Request, res:Response) {
  req.session.destroy();
  res.send("Session destroyed >:(");
});

app.get('/reservations', function (req: Request, res: Response)  {
  reservations.get(req.session, callbacker(res));
});

app.get('/sessions', function (req: Request, res: Response) {
  console.log(sessionStore);
  //req.session.
  res.send()
});

app.listen(3000, function() {
  console.log('app listening! weoruihgjewoirgfgfdghh igo to 127.0.0.1:3000');
});

function callbacker(res:Response) : (err:any,result:any) => void {
  return function(err:any, result:any) {
    if (err && err.code && err.value) {
      return res.status(err.code).send(err.value);
    } else if (err && err.code) {
      return res.sendStatus(err.code);
    } else if (err && err.value) {
      return res.status(500).send(err.value);
    } else if (_.isFinite(err)) {
      return res.sendStatus(err);
    } else if (err) {
      return res.status(500).send(err);
    }
    if (result && result.code && result.value) {
      return res.status(result.code).send(result.value);
    } else if (result && result.code) {
      return res.sendStatus(result.code);
    } else if (result && result.value) {
      return res.status(200).send(result.value);
    } else if (_.isFinite(result)) {
      return res.sendStatus(result);
    } else if (result) {
      return res.status(200).send(result);
    } else {
      return res.sendStatus(200);
    }
  };
};
