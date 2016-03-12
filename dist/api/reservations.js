var utils_1 = require("../utils");
var async = require("async");
var cheerio = require("cheerio");
var Reservation = (function () {
    function Reservation() {
    }
    return Reservation;
})();
var ReservationParser = (function () {
    function ReservationParser(html) {
        this.$ = cheerio.load(html);
    }
    ReservationParser.prototype.parseReservations = function () {
        var trs = this.$('.patFuncEntry');
        var reservations = trs.toArray().map(this.parseReservation.bind(this));
        console.log(reservations);
        return reservations;
    };
    ReservationParser.prototype.parseReservation = function (el) {
        // TODO: convert "" to null?
        var $el = this.$(el);
        var reservation = new Reservation();
        reservation.name = $el.find('.patFuncTitleMain').text().trim(); // TODO .patFuncTitleAlt?
        reservation.gotlibId = this.parseId($el);
        reservation.status = $el.find('.patFuncStatus').text().trim();
        reservation.library = $el.find('.patFuncPickup').text().trim();
        reservation.cancelAt = $el.find('.patFuncCancel').text().trim();
        reservation.frozen = $el.find('.patFuncFreeze input[type=checkbox]').prop('checked');
        return reservation;
    };
    ReservationParser.prototype.parseId = function ($el) {
        var blah = $el.find('.patFuncTitle').html();
        var id = blah.match(/\/record=([a-zA-Z0-9]*)/)[1];
        return id;
    };
    return ReservationParser;
})();
function get(session, cb) {
    var url = "https://www.gotlib.goteborg.se/patroninfo~S6*swe/1207852/holds";
    var bibRequest = utils_1.newBibRequest(session.cookies, url);
    async.waterfall([
        // Get reservations
        // Get reservations
        function (cb) {
            var opts = { url: url, method: "GET" };
            bibRequest(opts, cb);
        },
        // Parse reservations
        // Parse reservations
        function (response, body, cb) {
            var parser = new ReservationParser(body);
            var reservations = parser.parseReservations();
            cb(null, reservations);
        }
    ], cb);
}
exports.get = get;
exports.get = get;
//# sourceMappingURL=reservations.js.map