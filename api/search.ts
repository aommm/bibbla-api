/**
 * Created by jonat on 2016-02-16.
 */
/// <reference path="../typings/main.d.ts" />
import {IncomingMessage} from "http";

module.exports = {
  search: search
};

var cheerio = require('cheerio');
var request = require('request');

function search(searchString: string, cb:(a : any, b : any) => void) {
  console.log("Got a search request for "+searchString);
  request('http://www.gotlib.goteborg.se/search*swe/X?searchtype=X&searcharg='+searchString, function(error:any, response:IncomingMessage, body:any){
    if(!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
      var potBooks:Cheerio = $('.sokresultat');
      var result:any[] = [];
      potBooks.each(function(index:number, elem:CheerioElement){
        var book:any = {}; //TODO make book type
        var strong:Cheerio = $(elem).find('strong');
        // make sure we only get the one we are interested in
        if($(elem).find('font').length != 1) {
          return true;
        }
        var author:string = strong.first().html();
        if(strong.last() != null) {
          var section:string = strong.last().html();
        }
        var title:string = $(elem).find('a').html();
        if(author) {
          book.author = author.replace("\n", "");
        }
        if(section) {
          book.section = section.replace("\n", "");
        }
        if(title) {
          book.title = title.replace("\n", "");
        }
        if(book.author || book.section || book.title) {
          result.push(book);
        }
      });
      cb(result, undefined);
    }
  });
}

function writeProperty(prop, value) {
  return prop+":"+(typeof(value) == 'string' ? '"' : '')+value+(typeof(value) == 'string' ? '"' : '');
}

function writeObject(obj) {
  var ret = "{";

  for(var a in obj) {
    ret += writeProperty(a, obj[a]);
  }

  ret = ret.slice(0, ret.length-1);

  return ret+"}";
}