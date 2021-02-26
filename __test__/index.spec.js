const app = require("../src/server/index");
const request = require("supertest");


describe("Test the root path", () => {
  test("It should response the GET method", done => {
    request( app )
      .get("/test")
      .then(response => {
        expect( response.text ).toBe('test OK!');
        done();
      });
  });
});
