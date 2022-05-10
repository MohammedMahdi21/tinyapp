const { assert } = require("chai");
const  {getUserByEmail}  = require('../helpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe("getUserByEmail", function() {
  it("should return the user object with the valid email", function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = {
      id: "userRandomID",
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    };
    assert.deepEqual(user, expectedUserID);
  });

  it("should return undefined if the email does not exist in the database", function() {
    const user = getUserByEmail("user2022@example.com", testUsers);
    const expectedUserID = undefined;

    assert.equal(user, expectedUserID);
  });
});
