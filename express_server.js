const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({extended: true}));

// Express app will use EJS as its templating engine.
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// generate a random shortURL function
function generateRandomString() {

}

// root path
app.get("/", (req,res) => {
  res.send("Hello!");
});

// Add a new route /urls
app.get("/urls", (req,res) =>{
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
})

// Add a new route /urls/new
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  res.send("Ok");
});

// Add a new route /urls/:b2xVn2
app.get("/urls/:b2xVn2", (req, res) => {
  const templateVars = { shortURL: req.params.b2xVn2, longURL: urlDatabase.b2xVn2 };
  res.render("urls_show", templateVars);
});

// Add a new route /url.json
app.get("/url.json", (req, res) =>{
  res.json(urlDatabase);
})

// Add a new route /hello
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Server listening on port 8080
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});