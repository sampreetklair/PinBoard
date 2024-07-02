const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const Pin = require('./models/pin.js');

const app = express();

const HTTP_PORT = process.env.PORT || 8080;

mongoose.connect(process.env.dbURI)
  .then(function () {
    app.listen(HTTP_PORT, function () {
      console.log(`The app is listening on: http://localhost:${HTTP_PORT}`);
    });
  }).catch(function (err) {
    console.log(`unable to start server: ${err}`);
  });

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get('/', (req, res) => {
  res.redirect('/pins');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.get('/pins/create', (req, res) => {
  res.render('create', { title: 'Create a new Pin' });
});

app.get('/pins', (req, res) => {
  Pin.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('index', { pins: result, title: 'All Pins' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/pins', (req, res) => {
  // console.log(req.body);
  const pin = new Pin(req.body);

  pin.save()
    .then(result => {
      res.redirect('/pins');
    })
    .catch(err => {
      console.log(err);
    });
});

app.delete('/pins/:id', (req, res) => {
  const id = req.params.id;

  Pin.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/pins' });
    })
    .catch(err => {
      console.log(err);
    });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});

// app.listen(8080);
