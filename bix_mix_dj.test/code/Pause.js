 var http = require('http')
 var console = require('console')
module.exports.function = function pause () {
  var response = http.oauthPutUrl("https://api.spotify.com/v1/me/player/pause")
   console.log(response)
  // if (response == 403)
  //   return ("You need a premium spotify account for this feature")
  return ("Playback paused")
}
