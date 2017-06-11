var supertest = require('supertest');
var should = require('should');

/**
 * Mocha unit tests
 *
 * @author Jake Skoric <info@jakeskoric.com>
 */

// NOTE: In the interest of simplicity, these tests assume that the testing environment is development/local
var server = supertest.agent('http://localhost:8080');

// Test main app pages
describe('GET app routes / pages', function() {

	it('/ (Base URL/Home)', function(done) {
		server
			.get('/')
			.expect('Content-type', /html/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err);
				if (res.body.error) return done(res.body.error);
				res.status.should.equal(200); // Should respond with HTTP 200
				done();
			});
	});

	it('/tc (Terms and Conditions)', function(done) {
		server
			.get('/tc')
			.set('Accept', 'text/html')
			.expect('Content-type', /html/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err);
				if (res.body.error) return done(res.body.error);
				res.status.should.equal(200); // Should respond with HTTP 200
				done();
			});
	});
});


// Test contact form
describe('Contact form', function() {

	it('FAIL on empty form submission', function(done) {
		server
			.post('/api/contact')
			.send({})
			.expect('Content-type', /json/)
			.expect(400)
			.end(function(err, res) {
				if (err) return done(err);
				res.status.should.equal(400);
				res.body.error.should.equal('Insufficient form data given - all fields are required');
				res.body.status.should.equal('FAIL');
				done();
			});
	});

});
