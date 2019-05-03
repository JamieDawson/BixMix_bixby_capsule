var secret = require('secret')
 var config = require('config')
 var http = require('http')
 var console = require('console')
 var query = require("./lib/query.js")
 var genreList = require("./lib/genres.js")

module.exports.function = function searchByGenre (numberOfSongs, requestedTempo, requestedGenre) {

  console.log(requestedGenre)
  requestedGenre = requestedGenre.split(" ").join("%20") // splits the request string by space and rejoins with %20 to prepare it for a proper query
  console.log(requestedGenre)
  // Returns a random number between 0 and max - 1
  function getRandomNumber(max) {
    return (Math.floor(Math.random() * Math.floor(max)))
  }

  // Returns a simple string used to query the Spotify API.
  function getRandomQuery() {
    let consonants = "bcdfghjklmnpqrstvwxyz"
    let vowels = "aeiou"
    let queryString = ""

    if (getRandomNumber(2) === 1)
      queryString += consonants.charAt(getRandomNumber(consonants.length))
    else
      queryString += vowels.charAt(getRandomNumber(vowels.length))
    queryString += '*'
    if (getRandomNumber(2) === 1)
      queryString += consonants.charAt(getRandomNumber(consonants.length))
    else
      queryString += vowels.charAt(getRandomNumber(vowels.length))
    return (queryString)
  }

  function track(id, name, tempo, image, timeSignature, danceability) {
    this.id = id
    this.name = name
    this.tempo = Math.round(tempo)
    this.image = image
    this.timeSignature = timeSignature
    this.danceability = danceability
  }

  function querySpotifyForTracks() {
    let data = null
    while (data === null || data.tracks.items[0] === undefined) {
      let queryName = getRandomQuery()
      let query = "https://api.spotify.com/v1/search?q=" + queryName + "%20genre:%22" + requestedGenre + "%22&type=track"
      data = http.oauthGetUrl(query, {format: "json"})
    }
    return (data.tracks.items)
  }

  function getTrackFeatures(features) {
    let tempos = [], timeSignatures = [], danceability = []
    features.forEach(function(item) {
      if (item !== null) {
        tempos.push(item.tempo)
        timeSignatures.push(item.time_signature)
        danceability.push((Math.floor(item.danceability * 100)))
      }
      else {
        tempos.push(0)
        timeSignatures.push(0)
        danceability.push(0)
      }
    })
    return [tempos, timeSignatures, danceability]
  }

  function getDetailedTrackInfo(trackIDs) {
    let query = "https://api.spotify.com/v1/audio-features?ids=" + trackIDs.join()
    let trackDetails = http.oauthGetUrl(query, {format: "json"})
    console.log("Details")
    console.log(trackDetails)
    return (trackDetails)
  }

  // Returns a list of track IDs as a single string delimited by commas
  function getTracks() {
    let data = querySpotifyForTracks()
    console.log(data)
    let ids = [], names = [], imgs = []
    data.forEach(function(item){
      ids.push(item.id)
      names.push(item.name)
      if (item.album.images[0] !== undefined)
        imgs.push(item.album.images[0].url)
      else
        imgs.push("https://images.pexels.com/photos/2117937/pexels-photo-2117937.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
    })
    let tempos, timeSignatures, danceability
    [tempos, timeSignatures, danceability] = getTrackFeatures(getDetailedTrackInfo(ids).audio_features)
    return {ids: ids, names: names, tempos: tempos, images: imgs, timeSignatures: timeSignatures, danceability: danceability}
  }
  
  function inRange(tempo, range) {
    let low = requestedTempo - range
    let high = requestedTempo + range
    if (Math.floor(tempo) >= low && Math.floor(tempo) <= high)
      return (true)
    return (false)
  }
  
  function isRepeat(listOfTracks, trackToAdd) {
    let found = false
    listOfTracks.forEach(function (item) {
      if (item.name === trackToAdd)
        found = true
    })
    return (found)
  }
  
  function doTheThing() {
    let tracks = null
    let tooMany = 0, relax = 0, songsAdded = 0, i = 0
    let listOfTracks = []
    while (i < numberOfSongs && tooMany < 50) {
      tracks = getTracks()
      for (let j = 0; j < tracks.ids.length && i < numberOfSongs; j += (requestedTempo > -1) ? 1 : getRandomNumber(tracks.ids.length - j) + j) {
        if ((requestedTempo === -1 || inRange(tracks.tempos[j], relax) === true) && isRepeat(listOfTracks, tracks.names[j]) === false && tracks.tempos[j] > 0) {
          console.log(j)
          listOfTracks.push(new track(tracks.ids[j], tracks.names[j], tracks.tempos[j],tracks.images[j], tracks.timeSignatures[j], tracks.danceability[j]))
          i += 1
          songsAdded += 1
        }
      }
      tooMany += 1
      if (songsAdded < 3 && tooMany % 5 === 0)
        relax += tooMany % 4
    }
    return (listOfTracks)
  }
  
  function checkValidGenre() {
    let found = false
    for (let i = 0; i < genreList.genres.length; i++) {
      if (requestedGenre.toString() === genreList.genres[i].toString())
        found = true
    }
    if (found === false)
      requestedGenre = ""
  }

  checkValidGenre()
  tracks = doTheThing()
  console.log(tracks)
  tracks.sort(function(a, b) {
    return (b.tempo - a.tempo)
  })
  return {tracks: tracks}
}