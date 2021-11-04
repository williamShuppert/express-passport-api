'use strict';
import passport from 'passport';
import localStrategy from '../config/passport-local.js';
import { Users } from '../models/users.js';
import GoogleStrategy from './passport-google.js';

passport.use(localStrategy);
passport.use(GoogleStrategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
    const user = await Users.getById(id);
    if (!user) return done(null, false);
    done(null, user);
});