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
  async (token, tokenSecret, profile, done) => {
      // find or create user
      const user = await OAuth.get('google', profile.id);
      if (user) return done(null, user);
      console.log(profile);

      // Users.create({
      //   username: profile._json.name,
      //   nickname: profile._json.name,
      //   email: profile._json.email,
      //   verified_email: profile._json.email_verified
      // });
      //OAuth.insert('google', profile.id);
      // search for (provider, googleId) // using join
      // return user or create user
      done(null, user);
  }
);