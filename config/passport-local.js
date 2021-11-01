'use strict';
import LocalStrategy from 'passport-local';
import UsersTable from "../database/users.js";

export default new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, async (username, password, done) => {
        const user = await UsersTable.getByUsername(username);

        if (!user || !user.checkPassword(password))
            return done(null, false, { message: "incorrect credentials" });

        return done(null, user);
});