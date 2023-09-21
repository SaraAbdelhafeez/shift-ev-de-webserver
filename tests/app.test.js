const request = require('supertest');
const app = require('../app');
const server = require('../app');  // Import the server

describe('GET /', () => {
  afterAll((done) => {
    server.close();  // Close the server after tests are done
    done();
  });

  it('responds with a welcome message', done => {
    request(app)
      .get('/')
      .expect(200)
      .expect(/Welcome to the Shift EV basic web application/, done);
  });
});

