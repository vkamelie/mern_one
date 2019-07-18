const express = require("express");
const connectDB = require("./db");

const app = express();

connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("api running"));

//define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
// app.use("/api/posts", require("./routes/api/posts"));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`It's all good on port ${PORT}`));
