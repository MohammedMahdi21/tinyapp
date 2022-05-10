const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const { getUserByEmail, generateRandomString, urlsForUser, lookupPassword } = require("./helpers");
const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["Moe", "Mahdi"],
})
);

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
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
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

// Handle request when user navigates to /urls page
app.get("/urls", (req, res) => {
  if (!req.session.user_id) {
    res.status(401);
  }
  const userURLs = urlsForUser(urlDatabase, req.session.user_id);
  const templateVars = {
    urls: userURLs,
    user: users[req.session.user_id]
  };
  res.render("urls_index", templateVars);
});

// Handles request when user clicks on 'Create New URL'
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

// Handles request when user clicks on Submit button to generate shortURL
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

// Handles request when user clicks on Edit button on urls_show page to update longURL
app.get(`/urls/:shortURL`, (req, res) => {
  if (!req.session.user_id) {
    res.status(401);
    res.redirect("/login");

  } else {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = {
    shortURL,
    longURL,
    user: users[req.session.user_id]
  };
  res.render("urls_show", templateVars);
}
});

// Handles request, user directed to longURL website
app.get("/u/:shortURL", (req, res) => {
  if (!req.session.user_id) {
    res.status(400);
  }
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

// Handles request when user clicks on delete button on index page
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

// Handles request when user clicks on 'Login'. Renders page with login form.
app.get("/login", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id]
  };
  res.render("urls_login", templateVars);
});

// Post handles when user clicks on 'Login' button in Login form.
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const foundUser = getUserByEmail(email, users);
  if (foundUser && lookupPassword(password, users)) {
    const userId = foundUser.id;
    req.session.user_id = userId;
    res.redirect("/urls");
  } else {
    return res.status(403).send("Error 403 - Forbidden Error");
  }
});

// Post handles to logout.
app.post("/logout", (req, res) => {
  res.clearCookie("session");
  res.clearCookie("session.sig");
  res.redirect("/urls");
});

// Handles request to register. Renders page with registration form
app.get("/register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: req.session.user_id
  };
  res.render("urls_register", templateVars);
});

// Post handles request when user clicks Register button on the registration form
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const foundUser = getUserByEmail(email, users);
  const hashedPassword = bcrypt.hashSync(password, 10);
  const userId = generateRandomString();
  if (password === "" || email === "") {
    return res.status(400).send("Error 400 - Bad Request");

  } else if (foundUser) {
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

// Server listening on port 8080.
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});