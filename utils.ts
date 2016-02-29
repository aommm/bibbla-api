
import Session = Express.Session;
import {CookieJar} from "request";
import request = require("request");
import _ = require("lodash");

export function newCookieJar(session : Session, url : String) : CookieJar  {
  let jar = request.jar();
  _.each(session.cookies, function (cookie : String) {
    console.log('yo',cookie,url);
    jar.setCookie(cookie, url)
  });
  return jar;
}

export function newBibRequest(session, url) {
  let opts = {
    json: true,
    jar: newCookieJar(session, url)
  }
  return request.defaults(opts);
}
