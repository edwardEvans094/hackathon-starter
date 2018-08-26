const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const path = require('path');

const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');

const multer = require('multer');
const redis = require('redis');
const upload = multer({ dest: path.join(__dirname, 'uploads') });
const rateLimit = require("express-rate-limit");


const TokenRoutes = require("./routes/token.route")

const redisClient = redis.createClient(process.env.REDIS_PORT);
const cacheMiddleware = (req, res, next) => {
  const key = "___super_api__" + req.originalUrl || req.url;
  redisClient.get(key, (err, cachedBody) => {
      if (err) {
        console.log(err);
        return next()
      }
      if (cachedBody) {
        return res.send(cachedBody);
      } else {
        res.sendResponse = res.send
        res.send = (body) => {
          if(res.isCache){
            redisClient.set(key, body, 'EX', process.env.REDIS_TTL);
          }
          res.sendResponse(body)
        }
        return next();
      }
  });
}
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.example' });

/**
 * Create Express server.
 */
const app = express();



////////////// rate limit
app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
 
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 500 // limit each IP to 500 requests per windowMs
});
 
//  apply to all requests
app.use(limiter);




app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());


app.disable('x-powered-by');
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.get('*', cacheMiddleware)
app.use('/token', TokenRoutes)


if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
