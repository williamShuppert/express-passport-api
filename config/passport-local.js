'use strict';
import LocalStrategy from 'passport-local';
import { Users } from '../models/users.js';
import { Passwords } from '../models/passwords.js';
import { UserAndPassword } from '../models/user-password.js';

export default new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, async (username, password, done) => {
        try {
            const user = await UserAndPassword.getByUsername(username);
    
            if (!user || !await user.password.compare(password))
                return done(null, false, { message: "incorrect credentials" });
    
            return done(null, user);
        } catch(e) {
            done(e);
        }
});