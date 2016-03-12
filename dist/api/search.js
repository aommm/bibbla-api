module.exports = {
    search: search
};
var cheerio = require('cheerio');
var request = require('request');
function search(searchString, cb) {
    console.log("Got a search request for " + searchString);
    request('http://www.gotlib.goteborg.se/search*swe/X?searchtype=X&searcharg=' + searchString, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            var potBooks = $('.sokresultat');
            var result = [];
            var tempId;
            potBooks.each(function (index, elem) {
                var book = {}; //TODO make book type
                var strong = $(elem).find('strong');
                // make sure we only get the one we are interested in
                if ($(elem).find('font').length != 1) {
                    tempId = $(elem).find("input").val();
                    return true;
                }
                var author = strong.first().html();
                if (strong.last() != null) {
                    var section = strong.last().html();
                }
                var title = $(elem).find('a').html();
                if (author) {
                    book.author = author.replace("\n", "");
                }
                if (section) {
                    book.section = section.replace("\n", "");
                }
                if (title) {
                    book.title = title.replace("\n", "");
                }
                if (tempId) {
                    book.gotlibId = tempId;
                }
                if (book.author || book.section || book.title) {
                    result.push(book);
                }
            });
            cb(undefined, result);
        }
    });
}
function writeProperty(prop, value) {
    return prop + ":" + (typeof (value) == 'string' ? '"' : '') + value + (typeof (value) == 'string' ? '"' : '');
}
function writeObject(obj) {
    var ret = "{";
    for (var a in obj) {
        ret += writeProperty(a, obj[a]);
    }
    ret = ret.slice(0, ret.length - 1);
    return ret + "}";
}
//# sourceMappingURL=search.js.map