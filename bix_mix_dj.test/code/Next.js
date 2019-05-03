 var http = require('http')
 var console = require('console')
module.exports.function = function next () {
  var response = http.oauthPostUrl("https://api.spotify.com/v1/me/player/next")
  
  return ("Moved to the next track")
}
