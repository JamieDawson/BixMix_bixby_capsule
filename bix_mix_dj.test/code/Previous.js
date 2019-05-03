 var http = require('http')
 var console = require('console')
module.exports.function = function previous () {
  var response = http.oauthPostUrl("https://api.spotify.com/v1/me/player/previous")
  
  return ("Moved back to the last track")
}
