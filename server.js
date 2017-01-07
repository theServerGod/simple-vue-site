/**
* Server (entry) file
*
* @author Jake Skoric <jake@jsitsolutions.biz>
*/

var _ = require('lodash');
var bodyParser = require('body-parser');
var colors = require('chalk');
var compression = require('compression');
var express = require('express');
var helmet = require('helmet');
var history = require('connect-history-api-fallback');
var Mailgun = require('mailgun-js');
var path = require('path');
var validator = require('validator');

var app = express();
app.use(bodyParser.json({limit: '16mb'}));
app.use(bodyParser.urlencoded({limit: '16mb', extended: false}));
app.use(compression());
app.use(helmet());
app.use(history()); // Reroute all other GET requests to index, to be handled by front end router using HTML5 History API
app.use(require('express-log-url'));

const config = {
	ENV: process.env.NODE_ENV || 'development',
	PORT: process.env.PORT || 8080,
	DOCUMENT_ROOT: __dirname,
	DIST: path.resolve(__dirname, 'dist'),
	DOMAIN: 'example.com', // FIXME: Change to your domain
	API_KEYS: {
		MAILGUN: 'key-XXXXXXXXXXXXXXXXXXXXXXX', // FIXME: Change to your api key
	},
};

// Endpoints {{{

/**
 * Process contact form submission and dispatch email
 * @param {string} req.body.name Name of contacting user
 * @param {string} req.body.email Email of contacting user
 * @param {string} req.body.message Message body
 */
app.post('/api/contact', (req, res) => {
	if (!req.body.name && !req.body.email && !req.body.message)
		return res.status(400).json({error: 'Insufficient form data given'});

	let mailgun = new Mailgun({apiKey: config.API_KEYS.MAILGUN, domain: config.DOMAIN});

	// Sanitise input
	req.body.name = validator.escape(req.body.name);
	req.body.email = validator.normalizeEmail(req.body.email);
	req.body.message = validator.escape(req.body.message);

	// Dispatch email
	mailgun.messages().send(
		{
			from: `noreply@${config.DOMAIN}`,
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
			if (err) return res.status(400).json({error: err, status: 'FAIL', message: 'Error sending email. Please try again.'});
			res.json({status: 'OK', message: 'Contact form submitted, thank you!'});
		}
	);
});

// }}}

// Pages {{{
/**
 * Serve index / root page
 */
app.get('/', (req, res) => res.sendFile(path.join(config.DOCUMENT_ROOT, 'dist/index.html')));

/**
 * Serve files in /dist directory
 *
 * NOTE: If available under your infrastructure setup, it would be better to
 * serve static files over Nginx or Apache, for example.
 */
app.use(express.static(config.DIST));
// }}}

// Error handling {{{
// 404
app.use((req, res, next) => res.status(404).send('Sorry cant find that!'));

// 500
app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).send('Something broke!')
});
// }}}

app.listen(config.PORT, () => {
	if (config.ENV === 'production')
		console.log(colors.bold.green(`Server started under PRODUCTION mode, listening at ${config.DOMAIN}:${config.PORT}`));
	else
		console.log(colors.bold.green(`Server started under development mode, listening at http://localhost:${config.PORT}`));
});
