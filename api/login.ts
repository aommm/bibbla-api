/// <reference path="../typings/main.d.ts" />

import request = require("request");
import async = require('async');
import _ = require('lodash');
import {Cookie} from "request";
import Session = Express.Session;
var cheerio = require('cheerio');


export function login(name : String, code : String, pin : String, session : Session, cb : (err : any, cookies : Cookie[]) => void) {

    var jar = request.jar();
    let bibRequest = request.defaults({
        json: true,
        jar: jar
    });

    async.waterfall([
        // Get login form
        function(cb) {
            var opts = {
                url: "https://www.gotlib.goteborg.se/iii/cas/login?service=https%3A%2F%2Fencore.gotlib.goteborg.se%3A443%2Fiii%2Fencore%2Fj_acegi_cas_security_check&lang=swe",
                method: 'GET'
            };
            bibRequest(opts, cb);
        },
        // Post login form
        function(response, body, cb) {
            let $ = cheerio.load(body);
            let lt = $("[name=lt]").val();
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
        function(response, body, cb) {
            let cookies : Cookie[] = jar.getCookies('https://gotlib.goteborg.se');
            // Save cookies to session
            session.cookies = _.map(cookies, (cookie) => {return cookie.toString()});
            // Also return cookies (?)
            cb(null, cookies);
        }
    ], cb);




}