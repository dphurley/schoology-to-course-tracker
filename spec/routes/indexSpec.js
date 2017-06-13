var request = require('supertest');
var finishTestcase = require('jasmine-supertest');

describe('setting up testing framework', function () {

  beforeEach(function () {
    server = require(__dirname + '/../../bin/www', {bustCache: true});
  });

  it('responds to /', (done) => {
    request(server)
      .get('/')
      .expect(200)
      .end(finishTestcase(done));
  });

});