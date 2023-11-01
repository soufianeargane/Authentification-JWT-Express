const authRoute = require("./routes/authRoutes");
const clientRoutes = require("./routes/client/userRoutes");
const deliveryRoutes = require("./routes/deliveryMan/deliveryRoues.js");
const managerRoutes = require("./routes/manager/managerRoutes");
const roleRoutes = require("./routes/roleRoutes");

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

dotenv.config();

// CORS
app.use(
    cors({
        origin: "http://127.0.0.1:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());
// Connect to MongoDB from .env file
const db = process.env.DB_CONNECTION;
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("connected to mongo successfully"))
    .catch((err) => console.error("err with mongo db con ........" + err));

// Middleware of ROUTES
app.use("/api/auth", authRoute);
app.use("/api/roles", roleRoutes);
app.use("/api/user/client", clientRoutes);
app.use("/api/user/delivery", deliveryRoutes);
app.use("/api/user/manager", managerRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port} ...`);
});
