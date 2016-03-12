/// <reference path="../typings/main.d.ts" />
var utils_1 = require("../utils");
var request = require("request");
var async = require('async');
var _ = require("lodash");
var cheerio = require('cheerio');
function login(name, code, pin, session, cb) {
    var jar = request.jar();
    var bibRequest = request.defaults({
        json: true,
        jar: jar
    });
    async.waterfall([
        // Get login form
        // Get login form
        function (cb) {
            var opts = {
                url: "https://www.gotlib.goteborg.se/iii/cas/login?service=https%3A%2F%2Fencore.gotlib.goteborg.se%3A443%2Fiii%2Fencore%2Fj_acegi_cas_security_check&lang=swe",
                method: 'GET'
            };
            bibRequest(opts, cb);
        },
        // Post login form
        // Post login form
        function (response, body, cb) {
            var $ = cheerio.load(body);
            var lt = $("[name=lt]").val();
            var opts = {
                url: "https://www.gotlib.goteborg.se/iii/cas/login?service=https%3A%2F%2Fencore.gotlib.goteborg.se%3A443%2Fiii%2Fencore%2Fj_acegi_cas_security_check&lang=swe",
                form: {
                    "lt": lt,
                    "name": name,
                    "code": code,
                    "pin": pin,
                    "_eventId": "submit"
                },
                method: 'POST'
            };
            bibRequest(opts, cb);
        },
        function (response, body, cb) {
            var cookies = jar.getCookies('https://gotlib.goteborg.se');
            // Save cookies to session
            session.cookies = _.map(cookies, function (cookie) { return cookie.toString(); });
            // Also return cookies (?)
            cb(null, cookies);
        }
    ], cb);
}
exports.login = login;
/**
 * Send a simple GET request to keep connection alive
 * @param cookies - cookies to use for request (= cookies to keep alive)
 * @param cb
 */
function touch(cookies, cb) {
    //let url = "https://www.gotlib.goteborg.se/iii/cas/login?service=https%3A%2F%2Fencore.gotlib.goteborg.se%3A443%2Fiii%2Fencore%2Fj_acegi_cas_security_check&lang=swe";
    var url = "https://www.gotlib.goteborg.se/patroninfo~S6*swe/1207852/top";
    var bibRequest = utils_1.newBibRequest(cookies, url);
    bibRequest({
        url: url,
        method: 'GET'
    }, function (err, response, body) {
        if (response.statusCode !== 200) {
            return cb(response.statusCode);
        }
        console.log('cookies beforeÖ', cookies);
        console.log('cookies after', response.headers['set-cookie']);
        console.log(response.statusCode);
        console.log(body);
        // TODO Do they give new cookies? check here!
        cb(null);
    });
}
exports.touch = touch;
//# sourceMappingURL=login.js.map