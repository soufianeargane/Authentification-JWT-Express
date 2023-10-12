const authRoute = require('./routes/authRoutes');

const express = require('express');
const app = express();

app.get('api/auth', authRoute);

const port =3000;
app.listen(port, () => {
    console.log(`Listening on port ${port} ...`);
});