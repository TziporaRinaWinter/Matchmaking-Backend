const mongoose = require("mongoose");
require("dotenv").config();
const Grid = require("gridfs-stream");

const DB_URL = process.env.DB_URL;

let gfs;

const initGridFS = (conn) => {
  gfs = Grid(conn.db, mongoose.mongo);
};

async function connect() {
  try {
    await mongoose.connect(DB_URL);
    console.log("connected to db..");
    return mongoose.connection;
  } catch (error) {
    console.log(error);
    throw new Error("Error connecting to db. please try later...");
  }
}

module.exports = { connect };
