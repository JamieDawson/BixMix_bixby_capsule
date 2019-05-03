 var secret = require('secret')
 var config = require('config')
 var http = require('http')
 var console = require('console')

// module.exports = {
//   "randomQuery": randomQuery,
//   "searchByGenre": searchByGenre
// }

// Returns a random number between 0 and max - 1
function getRandomNumber(max) {
  return (Math.floor(Math.random() * Math.floor(max)))
}

// Returns a simple string used to query the Spotify API.
function getRandomQuery() {
  let consonants = "bcdfghjklmnpqrstvwxyz"
  let vowels = "aeiou"
  let queryString = ""

  queryString += consonants.charAt(getRandomNumber(consonants.length))
  queryString += '*'
  queryString += vowels.charAt(getRandomNumber(vowels.length))
  // console.log(queryString)
  return (queryString)
}

function track(id, name, tempo, image) {
  this.id = id
  this.name = name
  this.tempo = Math.round(tempo)
  this.image = image
}

function getTrackTempos(trackDetails) {
  let tempos = []
  // console.log(trackDetails.audio_features)
  for (let i = 0; i < trackDetails.audio_features.length; i++) {
    if (trackDetails.audio_features[i] === null)
      tempos[i] = 0
    else
      tempos[i] = trackDetails.audio_features[i].tempo
  }
  return (tempos)
}

function getDetailedTrackInfo(trackIDs) {
  let query = "https://api.spotify.com/v1/audio-features?ids=" + trackIDs.join()
  let trackDetails = http.oauthGetUrl(query, {format: "json"})
  return (trackDetails)
}

// Returns a list of track IDs as a single string delimited by commas
function getTracks(data) {
  let trackIDs = [], trackNames = [], images = []
  data.forEach(function(item){
    trackIDs.push(item.id)
    trackNames.push(item.name)
    images.push(item.album.images[0].url)
  })
  let details = getDetailedTrackInfo(trackIDs)
  let tempos = getTrackTempos(details)
  return {ids: trackIDs, names: trackNames, tempos: tempos, images: images}
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

function doTheThing(queryFunction) {
  let tracks = null
  let tooMany = 0, relax = 0, songsAdded = 0, i = 0
  let listOfTracks = []
  while (i < numberOfSongs && tooMany < 50) {
    tracks = getTracks(queryFunction)
    for (let j = 0; j < tracks.ids.length && i < numberOfSongs; j++) {
      if (inRange(tracks.tempos[j], relax) === true && isRepeat(listOfTracks, tracks.names[j]) === false) {
        listOfTracks.push(new track(tracks.ids[j], tracks.names[j], tracks.tempos[j], tracks.images[j]))
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
