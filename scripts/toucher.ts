
import {touch} from "../api/login";

import async = require('async');
import _ = require('lodash');
import Session = Express.Session;
import {RedisClient} from "redis";
var redis = require("redis");

let client : RedisClient = redis.createClient();

async.waterfall([
  (cb) => {
    client.keys('*', cb);
  },
  (keys, cb) => {
    console.log('found', keys.length, 'session(s)');
    async.map(keys, client.get.bind(client), cb);
  },
  (sessions, cb) => {
    sessions = _.map(sessions, JSON.parse.bind(JSON));
    let cookies = _.map(sessions, 'cookies');
    cookies = _.filter(cookies);
    console.log('found', cookies.length,'logged in session(s)');
    async.map(cookies, touch, cb);
  }
], (err, res) => {
  if (err) {
    console.error("couldn't touch 'em all >*(");
  } else {
    console.log("all done!");
  }
  client.end();
});

//function touchSession(cookies : Cookie[], cb) {
//  touch(cookies, cb);
//}

