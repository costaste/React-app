import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import routes from './routes';

// use dotenv to load environment variables
dotenv.config({
    silent: true,
});

// Express app setup
const app = express();

// error logging
app.use(logger('combined'));

// parser for incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// parser for cookie headers
// this will populate the request with an object keyed by the cookie names
app.use(cookieParser());

// view engine
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

// serve static files from 'public'
app.use(express.static(path.join(__dirname, './public')));

// use routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('This is not the page you are looking for');
    err.status = 404;
    next(err);
});

// error handlers
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: app.get('env') === 'development' ? err : {},
    });
    next();
});

export default app;
