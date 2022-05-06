const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Express app will use EJS as its templating engine.
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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

//Lookup email helper function.
const lookupEmail = function(email) {
  for (let user in users) {
    if (email === users[user].email) {
      return true;
    }
  }
  return false;
};

//Lookup password helper function.
const lookupPassword = function(password) {
  for (let user in users) {
    if (password === users[user].password) {
      return true;
    }
  }
  return false;
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
  res.send("Hello!");
});

// Add a new route /urls.
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_index", templateVars);
});

// Add a new route /urls/new.
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_new", templateVars);
});

// Add a new post handler.
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);

});

// Add a new route for handling our redirect links.
app.get(`/urls/:shortURL`, (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = {
    shortURL,
    longURL,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_show", templateVars);
});

// Redirect the user to the longURL.
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

// Post request handler to delete URL.
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[id] = longURL;
  res.redirect("/urls");
});

// Add a new route /login.
app.get("/login", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_login", templateVars);
});

// Add login post handler
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (lookupEmail(email) && lookupPassword(password)) {
    const userId = lookupUserID(email);
    res.cookie("user_id", userId);
    res.redirect("/urls");
  } else {
    return res.status(403).send("Error 403 - Forbidden Error");
  }

});

// global object to store and access the users in the app.
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
});

// Add a new route /register.
app.get("/register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: req.cookies["user_id"]
  };
  res.render("urls_register", templateVars);
});

//Add Registration Handler
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const userId = generateRandomString();

  if (password === "" || email === "") {
    return res.status(400).send("Error 400 - Bad Request");

  } else if (lookupEmail(email)) {
    return res.status(400).send("Error 400 - Bad Request");

  } else {
    users[userId] = {
      id: userId,
      email,
      password
    };
    res.cookie("user_id", userId);
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