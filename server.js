/**
* Server (entry) file
*
* @author Jake Skoric <info@jakeskoric.com>
*/

var async = require('async-chainable');
var bodyParser = require('body-parser');
var colors = require('chalk');
var compression = require('compression');
var express = require('express');
var helmet = require('helmet');
var history = require('connect-history-api-fallback');
var Mailgun = require('mailgun-js');
var path = require('path');
var session = require('express-session');
var validator = require('validator');

var app = express();
app.use(bodyParser.json({limit: '16mb'}));
app.use(bodyParser.urlencoded({limit: '16mb', extended: false}));
app.use(compression());
app.use(helmet());
app.use(require('express-log-url'));

app.use(session({
	// Generate with `cat /dev/urandom | base64 | head -n10`
	secret: 'o7cosbmeKR3Z6K9K9immaHzkVqJpyOyQttLQREHZxJNn+Sz9w+HETmVfbJx4aLyLOYMeYaYkrmWK',
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		//secure: true, // Requires TLS/SSL
		expires: new Date(Date.now() + (3600000 * 48)), // 48 hours
		maxAge: (3600000 * 48) // 48 hours
	}
}));

/**
 * Server app configuration
 */
const config = {
	TITLE: 'Simple Vue Site', // FIXME: Change to you app name
	ENV: process.env.NODE_ENV || 'development',
	PORT: process.env.PORT || 8080,
	DOCUMENT_ROOT: __dirname,
	DIST: path.resolve(__dirname, 'dist'),
	DOMAIN: 'example.com', // FIXME: Change to your domain
	MAILGUN: {
		API_KEY: 'key-XXXXXXXXXXXXXXXXXXXXXXX', // FIXME: Change to your api key
		DOMAIN: 'example.com' // FIXME: Change to the DOMAIN segment ONLY of your Mailgun API Base URL -- in most cases this may be the same as config.DOMAIN
	}
};

// Endpoints {{{

/**
 * Processes contact form submission and dispatches email
 * @param {string} req.body.name Name of contacting user
 * @param {string} req.body.email Email of contacting user
 * @param {string} req.body.message Message body
 */
app.post('/api/contact', function(req, res) {
	async()
		.then(function(next) {
			// Sanity check
			if (!req.body.name || !req.body.email || !req.body.message || !req.body.captcha)
				return next('Insufficient form data given - all fields are required');

			next();
		})
		.then(function(next) {
			// Sanitise input
			req.body.name = validator.escape(req.body.name);
			req.body.email = validator.normalizeEmail(req.body.email);
			req.body.message = validator.escape(req.body.message);
			req.body.captcha = validator.escape(req.body.captcha);

			// Check captcha
			if (req.body.captcha !== req.session.captcha) return next('Captcha incorrect. Please try again.');

			next();
		})
		.then('email', function(next) {
			let mailgun = new Mailgun({apiKey: config.MAILGUN.API_KEY, domain: config.MAILGUN.DOMAIN});

			// Dispatch email
			mailgun.messages().send(
				{
					from: `${config.TITLE} <noreply@${config.DOMAIN}>`,
					to: `info@${config.DOMAIN}`,
					subject: `Contact Form Submission - ${req.body.name}`,
					text: `A contact form submission was made with the following details:\n\n
						NAME:\n
						${req.body.name}
						\n\n
						EMAIL:\n
						${req.body.email}
						\n\n
						MESSAGE:\n
						${req.body.message}
					`,
				},
				(err, body) => {
					if (err) return next('Error sending email. Please try again.');
					next(null, body);
				}
			);
		})
		.end(function(err) {
			if (err) return res.status(400).json({error: err, status: 'FAIL', message: err.toString()});
			res.json({status: 'OK', message: "Contact form submitted, thank you! We'll get back to you soon!"});
		});
});

/**
 * Generates CAPTCHA image
 * @return {svg} Generated CAPTCHA image
 */
app.get('/api/captcha', function(req, res) {
	var svgCaptcha = require('svg-captcha');
	var captcha = svgCaptcha.create();
	req.session.captcha = captcha.text;

	res.set('Content-Type', 'image/svg+xml');
	res.status(200).send(captcha.data);
});

// }}}

// Pages {{{

/**
 * Serves index / root page
 */
app.get('/', function(req, res) {
	res.sendFile(path.join(config.DIST, 'index.html'));
});

app.use(history({htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'], disableDotRule: false})); // Reroute all other GET requests to index, to be handled by front end router using HTML5 History API

/**
 * Serves files in /dist directory
 *
 * NOTE: If available under your infrastructure setup, it would be better to
 * serve static files over Nginx or Apache, for example.
 */
app.use(express.static(config.DIST));

// }}}

// Error handling {{{
// 404
app.use(function(req, res, next) {
	res.status(404).send("Sorry can't find that!");
});

// 500
app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});
// }}}

// Start server {{{
app.listen(config.PORT, function() {
	if (config.ENV === 'production')
		console.log(colors.bold.green(`Server started under ${colors.bold.red('PRODUCTION')} mode, listening at ${config.DOMAIN}:${config.PORT}`));
	else
		console.log(colors.bold.green(`Server started under development mode, listening at http://localhost:${config.PORT}`));
});
// }}}
