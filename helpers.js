//Lookup email and return user object - helper function.
const getUserByEmail = function (email, database) {
  for (let user in database) {
    if (email === database[user].email) {
      return database[user];
    }
  }
  return undefined;
};

module.exports = {getUserByEmail};