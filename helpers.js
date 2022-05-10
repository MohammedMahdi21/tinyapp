const bcrypt = require('bcryptjs');

// Generate a random shortURL function.
const generateRandomString = function() {
  const result = Math.random().toString(36).substring(2, 7);
  return result;
};

//Lookup password helper function.
const lookupPassword = function(passwordEntered, users) {
  for (let user in users) {
    let hashedPassword = users[user].password; 
    if (bcrypt.compareSync(passwordEntered, hashedPassword)) {
      return true;
    }
  }
  return false;
};

//Lookup URLs created by the user helper function.
const urlsForUser = function(urlDatabase, id) {
  const urls = {};
  for (let userUrls in urlDatabase) {
    if (id === urlDatabase[userUrls].userID) {
      urls[userUrls] = { longURL: urlDatabase[userUrls].longURL };
    }
  }
  return urls;
};

//Lookup email and return user object - helper function.
const getUserByEmail = function (email, database) {
  for (let user in database) {
    if (email === database[user].email) {
      return database[user];
    }
  }
  return undefined;
};

module.exports = {getUserByEmail, generateRandomString, urlsForUser, lookupPassword};