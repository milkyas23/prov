const expect = require('chai').expect;
const app = require('../app');
// const request = require('supertest');
const session = require('supertest-session')(app);

// const testSession = null;

describe('/home', () => {
  let authenticatedSession = null;

  beforeEach((done) => {
    session.post('/login')
      .type('form')
      .send({
        username: process.env.TEST_USER,
        password: process.env.TEST_PASSWORD
      })
      .expect(302)
      .end(function (err) {
        if (err) return done(err);
        authenticatedSession = session;
        return done();
      });
  });

  it('should get a restricted page', function (done) {
    authenticatedSession.get('/home')
      .expect(200)
      .end(done)
  });

  it('should log out a user', function (done) {
    authenticatedSession.post('/logout')
      .expect(302)
      .end(done)
  });
});