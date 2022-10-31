require("dotenv").config();

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
const SpotifyWebApi = require("spotify-web-api-node");
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );
spotifyApi.setAccessToken("access_token");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist-search", (req, res) => {
  console.log("it works");
  spotifyApi
    .searchArtists(req.query.name)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items);
      res.render("artist-search-results", { data1: data.body.artists.items });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.query.id).then(
    (data) => {
      console.log("Artist albums", data.body.artists.album);
      res.render('albums', {data2: data.body.artists.album})
    },
    (err) => {
      console.log(err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
