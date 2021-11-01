'use strict';
import './config/dotenv.js';
import './config/passport.js';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { sessionConfig } from './config/express-session.js';

import authRouter from './routes/auth.js';
import securityRouter from './routes/securities.js';
import usersRouter from './routes/users.js';

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/securities', securityRouter);
app.use('/users', usersRouter);

app.listen(port, () => console.log(`http://localhost:${port}`));