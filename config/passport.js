'use strict';
import passport from 'passport';
import localStrategy from '../config/passport-local.js';
import { Users } from '../models/users.js';

passport.use(localStrategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
    const user = await Users.getById(id);
    done(null, user);
});