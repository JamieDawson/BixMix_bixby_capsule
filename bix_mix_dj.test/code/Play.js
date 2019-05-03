var http = require('http')
var console = require('console')

module.exports.function = function play () {
  var search = http.oauthPutUrl("https://api.spotify.com/v1/me/player/play", {})
    return ("Playback resumed")
}
