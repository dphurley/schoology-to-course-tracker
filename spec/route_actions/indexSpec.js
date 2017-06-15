'use strict';

const request = require('supertest');
const finishTestcase = require('jasmine-supertest');
let server;

const path = require('path');
const indexActions = require(path.join(__dirname, '../..', 'route_actions', 'index'));

describe('when the index route loads', () => {

  beforeEach(() => {
    server = require(__dirname + '/../../bin/www');

    process.env.SCHOOLOGY_CONSUMER_KEY = 'KEY';
    process.env.SCHOOLOGY_CONSUMER_SECRET = 'SHHH ITS A SECRET';
  });

  it('responds to / (the index route)', (done) => {
    request(server)
      .get('/')
      .expect(200)
      .end(finishTestcase(done));
  });

  it('loads the index page', () => {
    let request;
    let response = {
      render: 'is a function implemented elsewhere by Express',
    };

    spyOn(response, 'render');
    indexActions.loadIndexPage(request, response);

    expect(response.render).toHaveBeenCalledWith(
        'index',
        {
          key: 'KEY',
          secret: 'SHHH ITS A SECRET',
        },
    );
  });

});
