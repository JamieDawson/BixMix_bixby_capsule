 var http = require('http')
 var console = require('console')
module.exports.function = function makePlaylist (Tracks, playlistname) {
  var response = http.oauthPostUrl("https://api.spotify.com/v1/me/playlists", JSON.stringify({"name": playlistname, "description": "a test to remove or keep you decide", "public": true}))
  console.log(playlistname)
  let uris = Tracks.tracks.map((track) => {return ("spotify:track:" + track.id)}).toString()
  console.log(uris)
  let id
    response = http.oauthGetUrl("https://api.spotify.com/v1/me/playlists?limit=50", {format: 'json'})
    id = response.items.map((item) => {if (item.name == playlistname) return item.id }).slice(0,1).toString()
    response = http.oauthPostUrl("https://api.spotify.com/v1/playlists/" + id + "/tracks?uris=" + uris)
  return ("Playlist created")
}
