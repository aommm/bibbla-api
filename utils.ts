
import Session = Express.Session;
import {CookieJar} from "request";
import request = require("request");
import _ = require("lodash");
import {Cookie} from "request";

export function newCookieJar(cookies : Cookie[], url : String) : CookieJar  {
  let jar = request.jar();
  _.each(cookies, function (cookie : String) {
    jar.setCookie(cookie, url)
  });
  return jar;
}

export function newBibRequest(cookies : Cookie[], url) {
  let opts = {
    json: true,
    jar: newCookieJar(cookies, url)
  };
  return request.defaults(opts);
}

export function aborter(finalCb) {
  return function(response, body, cb) {
    code = response.statusCode+"";
    if (['4', '5'].indexOf(code[0]) !== -1) {
      finalCb(response.statusCode, body);
    } else {
      cb(null, response, body);
    }
  };
}