const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/task-manager-api", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Unable to connect to MongoDB..."));

