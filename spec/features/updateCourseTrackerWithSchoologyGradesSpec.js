'use strict';

const request = require('supertest');
const finishTestCase = require('jasmine-supertest');
const GoogleSpreadsheet = require('google-spreadsheet');
const courseTrackerSpreadsheet =
    new GoogleSpreadsheet('1f269VfdaAEDeE3wTYNr1OXrn--QMe4MwWgn2TU9KHgQ');

const google = require('googleapis');
const sheets = google.sheets('v4');

// const googleAuth = require('google-auth-library');

let server;

describe('FEATURE SPEC: successful update for one class', () => {

  beforeEach(() => {
    server = require(__dirname + '/../../bin/www');

    process.env.GOOGLE_SHEETS_MAIL_ADDRESS = 'ga-atl-dev@schoology-to-course-tracker.iam.gserviceaccount.com';
    process.env.GOOGLE_SHEETS_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCkTc2IwGCwIp9T\n3oMOxDgYctkDjeaBKDjFQdATEVfOEMmTfGetRV4mGy23qJ2AkEJ7IkqYvK5qZvUo\nqSCJIm3trpPA2mZGwQJwZPpbs2M+YCYbCuVI/82djt18ziTJ4wLj3cGzo4rMHH7d\n022ITy02gXZt96QbnpsAiDhhwi3keQYbn7R7AlGF23sYIjt+zY8QfxgGlZMfPoXI\noHg1I6zHc5JDTaj3spZibO5KaXujUYEKptQkKGIhaV2EB7jMN7kHNSXqKX2O+QJn\nWmVJMJPLGLp98iIwVt2apxbVNuIU8mhVahn3uTx8biUjklVlVrrkI5e2SUphGz6q\ndc1osEfxAgMBAAECggEAGOXYsLw6Sqahz0NHnUFly2qn8Rkb5imSr22hhX+EzJYQ\nUyMF0PoojLdko6alC2+Q63jkUKXoUPkTddsUh5i/NhvU3w4Zc+euohqN3RSKLvsX\nUH9uWbQN1AOWE7dnWBfoVGBtMyF5bc8e+H11ZTOzrcVLjYQlNbGWBSwfTc0aSDtC\njHm0zpcaMfKYYNhkD3XDncy1eCLw02aYKRVl/fC6c8n4mOGL53qUsv5SKooPD9OY\nz9wta1cIkDdO3QoI30IkJhFPrc6NWrATNhCVjVLwJv/zIRmBAr9F0iiWMvFAfngb\nlqii6pAO4vWCTIUVvdc1nl0h1WMJntejxCZtlCxBcwKBgQDRwkjD1buwsnc5613H\nahXf18r+bng0kc8XkeUy/DXxKEE5WUWM0S4Kx0EuMypYCH4bWUT30rM/8Zjd3b1W\nYN3nOkU2YubzBzzpPpJmsf6WoWtMt4PeRLJYN4B4LfEWWuhvsuifcV9zDFAt4uKX\nRJbE2s1mururdx589zCkYFEwnwKBgQDIhkWN8MJEQfgmBRbHyLrr/pR0nklUVff1\niVRaH5nWtY5n4KQEddkjU26JG1oyz+fwM1FoTD0kpXl9OMpn9DULzqk8FHrdbs9P\nMrX4AKaof5hmUeMzqU0p8qtKkREPpQGYq+IJ+JntPgwNbdsZD0ulUAMO7h4uMCau\nS5e05OftbwKBgQCcKiEya7XI35WUMX8oL/sJJAelVWl4+fVMfvo88zjVyjqFD8mQ\nBUxaCe6lDsK/t9LrWZLXTq7VNHGy/Jsx6/xJYkCVNRzsYr8eh89HVc1NJ/BStW4f\n1NVSiD/FOa78DcJvJqu5yRZe+RPYlcpNBGubM6soiG2gQpcYQpCcUHkh0QKBgQCM\nztygo2OHEtvxtrkcaTP467fLfCr58bRA0sJM1svsHWl2QCRsjWSAjeGcnXxlGeFA\npoiPuJlm1lvNNsfK340wUVo9OhRc0ab5ch6dm7drss2NbAsjB8uLnT/zCJL2bWQF\nlQ0Q+2T7VwqXk4C6xCbWWq0LGuJOhLlkwugwulyyOQKBgFeqVpeA+D1L8PX1RKPK\nEHO0FQBRkUpkoRMPQo+kpWF4/vUXdROJlcL7vUecY+87zoZHFSl8wxHcNFCn/q0b\nL7xIhNmrbNRnWI/mRDm1vtKyY4ir1q+ZAhHVnGKkb4RyFnas/Z8QdrPMAXxEDN/u\nIv7xV01nLc3xklAX0fvQStOD\n-----END PRIVATE KEY-----\n';
    process.env.GOOGLE_SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
    process.env.GOOGLE_SHEETS_ID = '1f269VfdaAEDeE3wTYNr1OXrn--QMe4MwWgn2TU9KHgQ';
    process.env.GOOGLE_SHEETS_TRACKER_SHEET_ID = '1162515498';
  });

  it(
      'pulls grade and student name info from Schoology and updates the Course Tracker',
      (done) => {

        let schoologyUpdateRequest = request(server).
            get('/schoology_to_course_tracker').
            expect(200);

        const assertions = (updatedSheet) => {
          let headerValues = updatedSheet.values[0];
          expect(headerValues[0]).toEqual('Wiki Treasure Hunt + Command Line Mystery');
          expect(headerValues[1]).toEqual('Accessibility + A Smarter Way');

          schoologyUpdateRequest.end(finishTestCase(done));
        };

        retrieveUpdatedGoogleSheetAndCheckAssertions(assertions);
      });

});

const retrieveUpdatedGoogleSheetAndCheckAssertions = (checkAssertions) => {
  const jwtClient = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_MAIL_ADDRESS,
      null,
      process.env.GOOGLE_SHEETS_PRIVATE_KEY,
      [process.env.GOOGLE_SHEETS_SCOPE],
      null,
  );

  jwtClient.authorize(() => {
    sheets.spreadsheets.values.get(
        {
          auth: jwtClient,
          spreadsheetId: process.env.GOOGLE_SHEETS_ID,
          range: 'E7:N10',
        },
        (error, updatedSheet) => {
          console.log(updatedSheet);

          checkAssertions(updatedSheet);
        },
    );

  });
}
