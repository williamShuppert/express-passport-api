'use strict';
import GoogleStrategy from 'passport-google-oauth20';
import { OAuth } from '../models/oauth.js';
import { Users } from '../models/users.js';

export default new GoogleStrategy({
    clientID: process.env.GOOGLE_CONSUMER_KEY,
    clientSecret: process.env.GOOGLE_CONSUMER_SECRET,
    callbackURL: process.env.NODE_ENV === 'dev' ?
      `http://localhost:${process.env.PORT}/auth/google/callback` :
      `https://tbd/auth/google/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // check if oauth is set up with an account
      const oauth = await OAuth.get('google', profile.id);

      // sign user in if oauth is set up
      if (oauth) {
        const user = await Users.getById(oauth.user_id);
        return done(null, user);
      }

      // create user and set up oauth
      const username = profile._json.name;
      const nickname = username;
      const email = profile._json.email;
      const email_verified = profile._json.email_verified;

      const user = await Users.create(username, nickname, email, email_verified);
      await OAuth.insert('google', profile.id, user.id);
      return done(null, user);

    } catch(e) {
      return done(e);
    }
  }
);