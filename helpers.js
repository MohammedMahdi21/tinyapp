//Lookup email helper function.
const getUserByEmail = function(email, database) {
  for (let user in database) {
    if (email === database[user].email) {
      return true;
    }
  }
  return false;
};

module.exports = getUserByEmail;