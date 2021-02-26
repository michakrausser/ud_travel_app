import { daysLeft } from "../src/client/js/daysLeft";

let d = new Date();
let today = d.getFullYear() + '-' + ( "0" + ( d.getMonth() + 1 )).slice( -2 ) + '-' + d.getDate();

describe("Testing the generate functionality", () => {

  test("Testing the daysLeft() function", () => {

    expect( daysLeft( today ) ).toBeDefined();
    expect( daysLeft( today ) ).toBe( 0 );
  })
});
