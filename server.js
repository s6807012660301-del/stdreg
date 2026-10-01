require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));   // lets HTML forms send PUT / DELETE
app.use(express.static('public'));
app.use('/', require('./routes/studentRoutes'));

const PORT = process.env.PORT || 3000;
const URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_register';

mongoose.connect(URI)
  .then(() => app.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`)))
  .catch(err => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
