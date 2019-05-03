 var secret = require('secret')
 var config = require('config')
 var http = require('http')
 var console = require('console')

module.exports.function = function searchSong (songName) {
  function getRandomNumber(max) {
    return (Math.floor(Math.random() * Math.floor(max)))
  }

  function querySpotifyTrackSearch() {
    let query = "https://api.spotify.com/v1/search?q=" + queryName + "&type=track&market=US&limit=50"
    let data = http.oauthGetUrl(query, {format: "json"})
    return (data)
  }
  
  
  
  return {}
}
