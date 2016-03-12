var login_1 = require("../api/login");
var async = require('async');
var _ = require('lodash');
var redis = require("redis");
var client = redis.createClient();
async.waterfall([
    function (cb) {
        client.keys('*', cb);
    },
    function (keys, cb) {
        console.log('found', keys.length, 'session(s)');
        async.map(keys, client.get.bind(client), cb);
    },
    function (sessions, cb) {
        sessions = _.map(sessions, JSON.parse.bind(JSON));
        var cookies = _.map(sessions, 'cookies');
        cookies = _.filter(cookies);
        console.log('found', cookies.length, 'logged in session(s)');
        async.map(cookies, login_1.touch, cb);
    }
], function (err, res) {
    if (err) {
        console.error("couldn't touch 'em all >*(");
    }
    else {
        console.log("all done!");
    }
    client.end();
});
//function touchSession(cookies : Cookie[], cb) {
//  touch(cookies, cb);
//}
//# sourceMappingURL=toucher.js.map