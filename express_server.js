const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended: true }));

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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// Add a new route /urls/new
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
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
  const templateVars = { shortURL, longURL };
  res.render("urls_show", templateVars);
});

// Redirect the user to the longURL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL
  delete urlDatabase[shortURL]
  res.redirect("/urls")
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