'use strict';
import './config/dotenv.js';
import './config/passport.js';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { sessionConfig } from './config/session.js';

import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import session from 'express-session';

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
app.use('/users', usersRouter);

app.listen(port, () => console.log(`http://localhost:${port}`));