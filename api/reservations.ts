import request = require("request");
import {newBibRequest} from "../utils";
import async = require("async");

function get(session, cb) {
    let url = "https://www.gotlib.goteborg.se/patroninfo~S6*swe/1207852/holds";
    let bibRequest = newBibRequest(session, url);

    async.waterfall([
        function (cb) {
            let opts = {
                url: url,
                method: "GET"
            };
            bibRequest(opts, cb);
        },
        function (response, body, cb) {
            cb(null, body);
        }
    ], cb);


}

export {
    get: get
}