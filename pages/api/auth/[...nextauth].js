import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"

async function refreshAccessToken(token){
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);
    const {body: refreshedToken} = await spotifyApi.refreshAccessToken(); //=> renaming body to refreshedToken

    console.log("refreshedToken is", refreshedToken);

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + (refreshedToken.expires_in * 1000), //=> expires_in is in seconds and we need milliseconds for Date.now()
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken, //=> if refresh_token is not returned, we keep the old one
    };

  } catch (error) { 
    console.error(error);
    return {
      ...token, //=> if refresh_token is not returned, we keep the old one
      error: 'Error refreshing access token',
    };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET, 
  pages: { // Configure Next.js pages
    signIn: '/login' //=> if you want to redirect to a custom sign in page
  },
  callbacks: { 
    async jwt({ token, account, user }) { //=> if you want to do something with the token
      // Store the token in your database
      // initialise the user's Spotify account / first time login
      if (account && user){ //=> if account is not null, it means the user is logged in
        return { //=> we return the token and the user
          ...token, //=> we keep the token
          accessToken: account.access_token, //=> we keep the access token
          refreshToken: account.refresh_token, //=> we keep the refresh token
          username: account.providerAccountId, //=> we keep the username
          accessTokenExpires: account.expires_at * 1000, //=> expires_at is in seconds and we need milliseconds for Date.now()
        }
      }

      // return previous token if the user has logged in before
      if (Date.now() < token.accessTokenExpires) { //=> if the token is not expired
        console.log('EXISTING TOKEN FOUND') 
        return token;
      }

      // Access token has expired, so we need to refresh it
      console.log('ACCESS TOKEN EXPIRED'); //=> if the token is expired
      return await refreshAccessToken(token); //=> we refresh the token

    },
    async session({ session, token }) { 
      session.user.accessToken = token.accessToken; //=> we add the access token to the session
      session.user.refreshToken = token.refreshToken; //=> we add the refresh token to the session
      session.user.username = token.username;

      return session; 
    },
  }
})