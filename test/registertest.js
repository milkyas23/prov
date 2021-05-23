const expect = require('chai').expect;
const app = require('../app');
const request = require('supertest')(app);
// const session = require('supertest-session')(app);
const { query } = require('../models/db');

describe('/register', () => {
  describe('GET /', () => {
    it('should return OK status', () => {
      request.get('/register')
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
        });
    });
  });

  describe('POST /', () => {
    beforeEach(async () => {
      // await query('truncate table meals');
      await query('DELETE FROM users WHERE email = ?', 'test@test.se');
    });

    it('should register a new user provided it has a correct request body', (done) => {
      request.post('/register')
        .type('form')
        .send({
          username: 'test',
          email: 'test@test.se',
          password: process.env.TEST_PASSWORD,
          passwordconfirmation: process.env.TEST_PASSWORD
        })
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          return done();
        });
    });

    it('should fail to register a user when passwords do not match', (done) => {
      request.post('/register')
        .type('form')
        .send({
          username: 'test',
          email: 'test@test.se',
          password: process.env.TEST_PASSWORD,
          passwordconfirmation: 'fel-passWord123'
        })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          expect(res.text).to.contain('Passwords do not match.');
          return done();
        });
    });

    it('should fail to register a user with an invalid email address', (done) => {
      request.post('/register')
        .type('form')
        .send({
          username: 'test',
          email: 'dettaär@inteokej',
          password: process.env.TEST_PASSWORD,
          passwordconfirmation:  process.env.TEST_PASSWORD
        })
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          expect(res.text).to.contain('Email is invalid or unavailable.');
          return done();
        });
    });
  });
});