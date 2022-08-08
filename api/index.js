const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const UserRoutes = require("./routes/user");
const MovieRoutes = require("./routes/movie");
const ListRoutes = require("./routes/list");

dotenv.config();
const app = express();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connectd"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", UserRoutes);
app.use("/api/movies", MovieRoutes);
app.use("/api/lists", ListRoutes);

app.listen(8800, () => {
  console.log("Server is listening ");
});
