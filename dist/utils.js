var request = require("request");
var _ = require("lodash");
function newCookieJar(cookies, url) {
    var jar = request.jar();
    _.each(cookies, function (cookie) {
        jar.setCookie(cookie, url);
    });
    return jar;
}
exports.newCookieJar = newCookieJar;
function newBibRequest(cookies, url) {
    var opts = {
        json: true,
        jar: newCookieJar(cookies, url)
    };
    return request.defaults(opts);
}
exports.newBibRequest = newBibRequest;
//# sourceMappingURL=utils.js.map