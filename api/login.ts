/// <reference path="../typings/main.d.ts" />

import request = require("request");
import async = require('async');
var cheerio = require('cheerio');


export function login(surname : String, code : String, pin : String, cb : (err : any, cookies : any) => void) {

    var jar = request.jar();
    let r = {};
    async.waterfall([
        function(cb) {
            var opts = {
                url: "https://www.gotlib.goteborg.se/iii/cas/login?service=https%3A%2F%2Fencore.gotlib.goteborg.se%3A443%2Fiii%2Fencore%2Fj_acegi_cas_security_check&lang=swe",
                method: 'GET',
                json: true,
                jar: jar
            };
            request(opts, cb);
        },
        function(response, body, cb) {
            let $ = cheerio.load(body);
            let lt = $("[name=lt]").val();
            console.log('yo', lt);
            var opts = {
                url: "https://www.gotlib.goteborg.se/iii/cas/login?service=https%3A%2F%2Fencore.gotlib.goteborg.se%3A443%2Fiii%2Fencore%2Fj_acegi_cas_security_check&lang=swe",
                data: {
                    // yur details here
                    "lt": lt,
                    "_eventid": "submit"
                },
                method: 'POST',
                json: true,
                jar: jar,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            console.log(jar);
            request(opts, cb);
        },
        function(response, body, cb) {
            console.log('popo');
            //let cookies = jar.getCookies('http://www.gotlib.goteborg.se/iii/cas/');
            //let cookies = jar.getCookies('https://www.gotlib.goteborg.se/iii/cas');
            //console.log(cookies);
            console.log(jar);
            cb(null, body);

            //cb();
        }
    ], cb);




}