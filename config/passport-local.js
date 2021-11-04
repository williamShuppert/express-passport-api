'use strict';
import LocalStrategy from 'passport-local';
import { Users } from '../models/users.js';
import { Passwords } from '../models/passwords.js';

export default new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, async (username, password, done) => {
        try {
            const user = await Users.getByUsername(username, true);
    
            if (!user || !await Passwords.compare(password, user.password))
                return done(null, false, { message: "incorrect credentials" });
    
            return done(null, user);
        } catch(e) {
            done(e);
        }
});