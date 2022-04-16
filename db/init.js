const mongoose = require("mongoose");
require("dotenv").config();

const clientPromise = mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((m) => {
    console.log(`Connected to Mongo! Database name: "${m.connections[0].name}"`);
    return m.connection.getClient();
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

module.exports = clientPromise;
