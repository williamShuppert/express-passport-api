import GoogleStrategy from 'passport-google-oauth';

export default new GoogleStrategy({
    consumerKey: process.env.GOOGLE_CONSUMER_KEY,
    consumerSecret: process.env.GOOGLE_CONSUMER_SECRET,
    callbackURL: "http://www.example.com/auth/google/callback"
  },
  (token, tokenSecret, profile, done) => {
      // find or create user
      // save googleId to user with profile.id
  }
);