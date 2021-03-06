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
import { errorHandler } from './libs/errors/handler.js';

import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';

const port = process.env.PORT;
const app = express();

app.use(cors({ origin: `http://localhost:${port}`, credentials: true }));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/users', usersRouter);

app.use(errorHandler());

app.listen(port, () => console.log(`http://localhost:${port}`));