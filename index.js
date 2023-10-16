const authRoute = require('./routes/authRoutes');
const userRoute = require('./routes/userRoutes');

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

dotenv.config();

// Middleware
app.use(express.json());
app.use(cookieParser());
// Connect to MongoDB from .env file
const db = process.env.DB_CONNECTION;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to mongo successfully'))
    .catch(err => console.error('err with mongo db con ........' + err));




// Middleware of ROUTES
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);


const port =3000;
app.listen(port, () => {
    console.log(`Listening on port ${port} ...`);
});