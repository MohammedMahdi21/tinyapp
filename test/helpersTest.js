const { assert } = require("chai");
const { generateRandomString, getUserByEmail, urlsForUser } = require("../helpers.js");

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

const urlDatabase = {
  "b2xVn2": {
    longURL: "https://stackoverflow.com/",
    userID: "userRandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID"
  },
  "k71hb9": {
    longURL: "https://dev.to",
    userID: "userRandomID"
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

describe("generateRandomString", function() {
  it("should return a random alphanumeric string", function() {
    const alphaNum = generateRandomString();

    assert.isString(alphaNum);
  });
});

describe("urlsForUser", function() {
  it("should return an object if there are urls in the database belonging to a given user", function() {
    const urls = urlsForUser(urlDatabase, "userRandomID");
    const expectedUrls = {
      b2xVn2: {
        longURL: "https://stackoverflow.com/",
      },
      k71hb9: {
        longURL: "https://dev.to"
      }
    };

    assert.deepEqual(urls, expectedUrls);
  });

  it("should return an empty object if there are no urls in the database belonging to a given user", function() {
    const urls = urlsForUser(urlDatabase, "a8n7rx");
    const expectedUrls = {};

    assert.deepEqual(urls, expectedUrls);
  });
});
