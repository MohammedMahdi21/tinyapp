const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

// Express app will use EJS as its templating engine.
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


// Generate a random shortURL function
const generateRandomString = function() {
  const result = Math.random().toString(36).substring(2,7);
  return result;
};

// Root path
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Add a new route /urls
app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase, 
    username: req.cookies["username"] 
  };
  res.render("urls_index", templateVars);
});

// Add a new route /urls/new
app.get("/urls/new", (req, res) => {
  const templateVars = { 
    username: req.cookies["username"] 
  };
  res.render("urls_new", templateVars);
});

// Add a new post handler
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);

});

// Add a new route for handling our redirect links
app.get(`/urls/:shortURL`, (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL, 
    longURL, 
    username: req.cookies["username"], 
  };
  res.render("urls_show", templateVars);
});

// Redirect the user to the longURL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

// Post request to delete URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL
  delete urlDatabase[shortURL]
  res.redirect("/urls")
})

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[id] = longURL
  res.redirect("/urls")
})

app.post("/login", (req, res) => {
  const login = req.body.username;
  res.cookie("username", login);
  res.redirect("/urls")
})

app.post("/logout", (req, res) => {
  res.clearCookie('username')
  res.redirect("/urls")
})

app.get("/register", (req, res) => {
  const templateVars = { 
    urls: urlDatabase, 
    username: req.cookies["username"] 
  };
  res.render("urls_register", templateVars)
})

// Add a new route /url.json
app.get("/url.json", (req, res) => {
  res.json(urlDatabase);
});

// Add a new route /hello
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Server listening on port 8080
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});