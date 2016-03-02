/**
 * Created by jonat on 2016-03-02.
 */
/// <reference path="../typings/main.d.ts" />
import {IncomingMessage} from "http";

module.exports = {
  getBook: getBook
};

var cheerio = require('cheerio');
var request = require('request');

var colDictionary = {
  "Summary": "summary",
  "System Det": "sysDetails",
  "Genre": "genre"
};

var colParser = {
  "Summary": standardParser,
  "System Det": standardParser,
  "Genre": function(value) {
    return value.split("\n");
  }
};

function standardParser(value){return value;}

function getBook(gotlibId: string, cb:(a : any, b : any) => void) {
  console.log("Got request for book "+gotlibId);
  request("http://www.gotlib.goteborg.se/record="+gotlibId, function(error:any, response:IncomingMessage, body:any){
    var $ = cheerio.load(body);

    var img:string = $("table").eq(1).find("table").first().find("img").attr("src");

    var book = {imgUrl: "http://www.gotlib.goteborg.se/bookjacket?recid="+gotlibId}

    // Some key, Genre for example, take up multiple rows
    // Will contain the value of all rows
    var totalRow:string = "";

    var key:string = "";

    var infoTable = $(".bibInfoEntry").find("tr");
    infoTable.each(function(index:number, elem:CheerioElement){
      var value:string = "";
      if($(elem).find(".bibInfoLabel").html()) {
        key = $(elem).find(".bibInfoLabel").html();
        value = $(elem).find(".bibInfoData").html();
        console.log(value+"   "+key+"     "+index);
        console.log($(elem).html())
      } else {
        console.log(value+"   "+key+"     "+index);
        console.log($(elem).html())
        value += "\n"+$(elem).find(".bibInfoData").html();
        console.log(value);
      }

      if(colDictionary[key]) {
        book[colDictionary[key]] = colParser[key](value);
      }
    });

    cb(undefined, $.html());
  });
}