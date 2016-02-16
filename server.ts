/// <reference path="typings/main.d.ts" />
import {Request, Response} from "express";

var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var search = require('./api/search');
var me = require('./api/me');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/search/:s', function(req:Request, res:Response){
  search.search(req.params.s, callbacker(res));
});

app.post('/login', function(req:Request, res:Response) {
  me.login(req.body.username, req.body.password, callbacker(res));
});

app.listen(3000, function() {
  console.log('app listening! weoruihgjewoirgfgfdghh igo to 127.0.0.1:3000');
});

function callbacker(res:Response) {
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
