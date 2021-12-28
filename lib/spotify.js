import SpotifyWebApi from "spotify-web-api-node"; 

const scope = [ //=> we need to request the following scopes
    "streaming", //=> we need to be able to play music
    "user-read-email", //=> we need to be able to read the user's email
    "playlist-read-private", //=> we need to be able to read the user's private playlists
    "playlist-read-collaborative", //=> we need to be able to read the user's collaborative playlists
    "user-read-private", //=> we need to be able to read the user's private information
    "user-library-read", //=> we need to be able to read the user's library
    "user-top-read", //=> we need to be able to read the user's top artists and tracks
    'user-read-playback-state', //=> we need to be able to read the user's playback state
    'user-modify-playback-state', //=> we need to be able to modify the user's playback state
    'user-read-currently-playing', //=> we need to be able to read the user's currently playing track
    'user-read-recently-played', //=> we need to be able to read the user's recently played tracks
    'user-follow-read', //=> we need to be able to read the user's followed artists and playlists
].join(","); 

const params = {
    scope: scope,
};

const queryParamString = new URLSearchParams(params); //=> we need to convert the params to a query string

const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString.toString()}`; //=> we need to convert the query string to a url

const spotifyApi = new SpotifyWebApi({ //=> we need to initialise the spotify api
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID, //=> we need to get the client id from the .env file
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

export default spotifyApi; 

export { LOGIN_URL }; //=> we need to export the LOGIN_URL to the pages/api/auth/[...nextauth].js