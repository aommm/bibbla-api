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
    "Genre": function (value) {
        return value.split("\n");
    }
};
function standardParser(value) { return value; }
function getBook(gotlibId, cb) {
    console.log("Got request for book " + gotlibId);
    request("http://www.gotlib.goteborg.se/record=" + gotlibId, function (error, response, body) {
        var $ = cheerio.load(body);
        var img = $("table").eq(1).find("table").first().find("img").attr("src");
        var book = { imgUrl: "http://www.gotlib.goteborg.se/bookjacket?recid=" + gotlibId };
        // Some key, Genre for example, take up multiple rows
        // Will contain the value of all rows
        var totalRow = "";
        var key = "";
        var infoTable = $(".bibInfoEntry").find("tr");
        infoTable.each(function (index, elem) {
            var value = "";
            if ($(elem).find(".bibInfoLabel").html()) {
                key = $(elem).find(".bibInfoLabel").html();
                value = $(elem).find(".bibInfoData").html();
                console.log(value + "   " + key + "     " + index);
                console.log($(elem).html());
            }
            else {
                console.log(value + "   " + key + "     " + index);
                console.log($(elem).html());
                value += "\n" + $(elem).find(".bibInfoData").html();
                console.log(value);
            }
            if (colDictionary[key]) {
                book[colDictionary[key]] = colParser[key](value);
            }
        });
        cb(undefined, $.html());
    });
}
//# sourceMappingURL=books.js.map