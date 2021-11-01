'use strict';
import passport from 'passport';
import localStrategy from '../config/passport-local.js';
import UsersTable from '../database/users.js';

passport.use(localStrategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
    const user = await UsersTable.getById(id);
    done(null, user);
});