const authRoute = require('./routes/authRoutes');

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const express = require('express');
const app = express();

dotenv.config();

// Middleware
app.use(express.json());
// Connect to MongoDB from .env file
const db = process.env.DB_CONNECTION;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to mongo successfully'))
    .catch(err => console.error('err is........' + err));


// Middleware of ROUTES
app.use('/api/auth', authRoute);

const port =3000;
app.listen(port, () => {
    console.log(`Listening on port ${port} ...`);
});