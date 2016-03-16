import request = require("request");
import {newBibRequest} from "../utils";
import async = require("async");
import cheerio = require("cheerio");
import _ = require("lodash");
import {aborter} from "../utils";

class Reservation {
  name: string;
  gotlibId: string;
  status: string;
  library: string;
  cancelAt: string;
  frozen: boolean;

}

class ReservationParser {
  private $: Cheerio;

  constructor(html) {
    this.$ = cheerio.load(html);
  }

  parseReservations() : Reservation[] {
    let trs = this.$('.patFuncEntry');
    let reservations = trs.toArray().map(this.parseReservation.bind(this));
    console.log(reservations);
    return reservations;
  }

  parseReservation(el : CheerioElement) : Reservation {
    // TODO: convert "" to null?
    let $el = this.$(el);
    let reservation = new Reservation();
    reservation.name = $el.find('.patFuncTitleMain').text().trim(); // TODO .patFuncTitleAlt?
    reservation.gotlibId = this.parseId($el);
    reservation.status = $el.find('.patFuncStatus').text().trim();
    reservation.library = $el.find('.patFuncPickup').text().trim();
    reservation.cancelAt = $el.find('.patFuncCancel').text().trim();
    reservation.frozen = $el.find('.patFuncFreeze input[type=checkbox]').prop('checked');
    return reservation;
  }

  parseId($el : Cheerio) : string {
    let blah = $el.find('.patFuncTitle').html();
    let id = blah.match(/\/record=([a-zA-Z0-9]*)/)[1];
    return id;
  }

}

function get(session, cb) {
  let url = "https://www.gotlib.goteborg.se/patroninfo~S6*swe/1207852/holds";
  let bibRequest = newBibRequest(session.cookies, url);

  async.waterfall([
    // Get reservations
    function (cb) {
      let opts = {url: url, method: "GET"};
      bibRequest(opts, cb);
    },
    aborter(cb),
    // Parse reservations
    function (response, body, cb) {
      let parser = new ReservationParser(body);
      let reservations = parser.parseReservations();
      cb(null, reservations);
    }
  ], cb);
}

export {
  get: get
}