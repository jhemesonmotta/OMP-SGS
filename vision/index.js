var request = require("request");
var cheerio = require("cheerio");
var translate = require('translate');

module.exports.getFotos = function(url, callback) {
  request(url, function(error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var fotos = [];

      $( "img" ).each(function( index ) {
        var img = $( this ).attr('src');
        if(img.includes("http")){
          fotos.push(img);
        }
      });
      
      callback(fotos);
    }
    else{
      console.log("err: " + error);
      console.log("statusCode: " + response.statusCode);
    }
  });
}