const express = require('express');
const app = express();
const Bookrouter =require('./routes/bookrotes');
const AppError=require('./utils/AppError');
const userrouter= require('./routes/userRoutes')
const commentrouter=require('./routes/commentRoutes');
const tag = require('./routes/tagroutes');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');


app.use(express.json());


app.use(helmet());
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use(xss());



app.use('/api/',Bookrouter);
app.use('/api/',tag);
app.use('/api/',userrouter);
app.use('/api/',commentrouter)


app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

  module.exports = app;


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong';
        console.error(err.stack);
    
    res.status(statusCode).json({
      status: err.status || 'error',
      message: message,
    });
    next();
  });
  
