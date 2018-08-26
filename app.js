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
          redisClient.set(key, body, 'EX', process.env.REDIS_TTL);
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
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const apiController = require('./controllers/api');
const contactController = require('./controllers/contact');


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

app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/jquery/dist'), { maxAge: 31557600000 }));
app.use('/webfonts', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'), { maxAge: 31557600000 }));


app.get('*', cacheMiddleware)


app.use('/token', TokenRoutes)
/**
 * Primary app routes.
 */
// app.get('/', homeController.index);
// app.get('/login', userController.getLogin);
// app.post('/login', userController.postLogin);
// app.get('/logout', userController.logout);
// app.get('/forgot', userController.getForgot);
// app.post('/forgot', userController.postForgot);
// app.get('/reset/:token', userController.getReset);
// app.post('/reset/:token', userController.postReset);
// app.get('/signup', userController.getSignup);
// app.post('/signup', userController.postSignup);
// app.get('/contact', contactController.getContact);
// app.post('/contact', contactController.postContact);

/**
 * API examples routes.
 */

// app.get('/api', apiController.getApi);
// app.get('/api/lastfm', apiController.getLastfm);
// app.get('/api/nyt', apiController.getNewYorkTimes);
// app.get('/api/aviary', apiController.getAviary);

// app.get('/api/stripe', apiController.getStripe);
// app.post('/api/stripe', apiController.postStripe);
// app.get('/api/scraping', apiController.getScraping);
// app.get('/api/twilio', apiController.getTwilio);
// app.post('/api/twilio', apiController.postTwilio);
// app.get('/api/clockwork', apiController.getClockwork);
// app.post('/api/clockwork', apiController.postClockwork);

// app.get('/api/paypal', apiController.getPayPal);
// app.get('/api/paypal/success', apiController.getPayPalSuccess);
// app.get('/api/paypal/cancel', apiController.getPayPalCancel);
// app.get('/api/lob', apiController.getLob);
// app.get('/api/upload', apiController.getFileUpload);
// app.post('/api/upload', upload.single('myFile'), apiController.postFileUpload);
// app.get('/api/google-maps', apiController.getGoogleMaps);


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
