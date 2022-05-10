const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session')
const bcrypt = require('bcryptjs');
const getUserByEmail = require("./helpers")
const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["Moe", "Mahdi"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))



// Express app will use EJS as its templating engine.
app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "userRandomID"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "user2RandomID"
  }
};

// global object to store and access the users in the app.
const users = {
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

// Generate a random shortURL function.
const generateRandomString = function() {
  const result = Math.random().toString(36).substring(2, 7);
  return result;
};

//Lookup password helper function.
const lookupPassword = function(passwordEntered) {
  for (let user in users) {
    let hashedPassword = users[user].password; 
    if (bcrypt.compareSync(passwordEntered, hashedPassword)) {
      return true;
    }
  }
  return false;
};

//Lookup URLs created by the user helper function.
const urlsForUser = function(id) {
  const urls = {};
  for (let userUrls in urlDatabase) {
    if (id === urlDatabase[userUrls].userID) {
      urls[userUrls] = { longURL: urlDatabase[userUrls].longURL };
    }
  }
  return urls;
};

//Lookup user helper function.
const lookupUserID = function(userEmail) {
  for (let user in users) {
    if (userEmail === users[user].email) {
      return users[user].id;
    }
  }
};

// Root path.
app.get("/", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id]
  };
  res.render("root", templateVars);
});

// Add a new route /urls.
app.get("/urls", (req, res) => {
  if (!req.session.user_id) {
    res.status(401);
  }
  const userURLs = urlsForUser(req.session.user_id);
  const templateVars = {
    urls: userURLs,
    user: users[req.session.user_id]
  };
  res.render("urls_index", templateVars);
});

// Add a new route /urls/new.
app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/login");

  } else {
    const templateVars = {
      user: users[req.session.user_id]
    };
    res.render("urls_new", templateVars);
  }
});

// Post handler to add new url.
app.post("/urls", (req, res) => {
  if (!req.session.user_id) {
    res.status(401);
    res.redirect("/login");

  } else {
    const shortURL = generateRandomString();
    const userID = users[req.session.user_id].id;
    const longURL = req.body.longURL;
    urlDatabase[shortURL] = { longURL, userID };
    res.redirect(`/urls/${shortURL}`);
  }
});

// Add a new route for handling our redirect links.
app.get(`/urls/:shortURL`, (req, res) => {

  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = {
    shortURL,
    longURL,
    user: users[req.session.user_id]
  };
  res.render("urls_show", templateVars);
});

// Redirect the user to the longURL.
app.get("/u/:shortURL", (req, res) => {
  if (!req.session.user_id) {
    res.status(400);
  }
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

// Post request handler to delete URL.
app.post("/urls/:shortURL/delete", (req, res) => {
  if (!req.session.user_id) {
    res.status(401);
    res.redirect("/login");

  } else {
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }
});

// Post request handler to edit URL.
app.post("/urls/:id", (req, res) => {
  if (!req.session.user_id) {
    res.status(401);
    res.redirect("/login");

  } else {
    const id = req.params.id;
    const longURL = req.body.longURL;
    urlDatabase[id].longURL = longURL;
    res.redirect("/urls");
  }
});

// Add a new route /login.
app.get("/login", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id]
  };
  res.render("urls_login", templateVars);
});

// Add login post handler
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (getUserByEmail(email, users) && lookupPassword(password)) {
    const userId = lookupUserID(email);
    req.session.user_id = userId;
    res.redirect("/urls");
  } else {
    return res.status(403).send("Error 403 - Forbidden Error");
  }
});

// global object to store and access the users in the app.
app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/urls");
});

// Add a new route /register.
app.get("/register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: req.session.user_id
  };
  res.render("urls_register", templateVars);
});

//Add Registration Handler
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10)
  const userId = generateRandomString();
  if (password === "" || email === "") {
    return res.status(400).send("Error 400 - Bad Request");

  } else if (getUserByEmail(email, users)) {
    return res.status(400).send("Error 400 - Bad Request");

  } else {
    users[userId] = {
      id: userId,
      email,
      password: hashedPassword
    };
    req.session.user_id = userId;
    res.redirect("/urls");
  }
});

// Add a new route /url.json.
app.get("/url.json", (req, res) => {
  res.json(urlDatabase);
});

// Add a new route /hello.
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Server listening on port 8080.
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});