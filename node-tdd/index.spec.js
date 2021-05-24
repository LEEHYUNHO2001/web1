import request from 'supertest';
import { expect } from 'chai';

import app from './index';

describe('GET /', () => {
  it('should respond with text message "Hello World"', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
          return;
        }

        expect(res.text).to.equal('Hello World');
        done();
      });
  });
});