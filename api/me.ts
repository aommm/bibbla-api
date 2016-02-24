/**
 * Created by jonat on 2016-02-16.
 */
/// <reference path="../typings/main.d.ts" />
module.exports = {
  login: login
};

function login(username:string, password:string, cb:(a : any, b : any) => void) {
  if (username == 'aom' && password == 'bobo') {
    var user = {
      username: "aom",
      password: "bobo",
      gotlib_surname: "bodo",
      gotlib_code: "bodo",
      gotlib_pin: "bodo"
    };
    cb(null, {token: 'abc124', user: user});
  } else {
    cb(401, undefined);
  }
}

