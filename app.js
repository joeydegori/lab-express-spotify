require('dotenv').config();

const express = require('express');
const res = require('express/lib/response');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node'); 

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

//Home page
app.get('/', (req, res) => {
    res.render('index');
});

//Artist search page
app.get('/artist-search', (req, res) => {
    // res.render('artist-search-result')
// const {artist} = req.query.artist_name; 
    spotifyApi
  .searchArtists(req.query.artist_name)
  .then(data => {
    //console.log('The received data from the API: ', data.body);
    //res.json(data.body)
    res.render('artist-search-result', {artists: data.body.artists.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

//albums page rendering
app.get('/albums/:artistId', (req, res) => {
    const artistId = req.params.artistId;
    // res.render('artist-search-result')
// const {artist} = req.query.artist_name; 
    spotifyApi
    .getArtistAlbums(artistId)
  .then(data => {
    //console.log('The received data from the API: ', data.body);
    //res.json(data.body)
    res.render('albums', {albums: data.body.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

//tracks page rendering
app.get('/tracks/:albumId', (req, res) => {
    const albumId = req.params.albumId;
    // res.render('artist-search-result')
// const {artist} = req.query.artist_name; 
    spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
    //console.log('The received data from the API: ', data.body);
    //res.json(data.body)
    res.render('tracks', {tracks: data.body.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
