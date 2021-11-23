const mongoose = require("mongoose");
const dbconf = require('../dbconfig');

const db = mongoose
    .connect(dbconf.url)
    .then(() => {
        console.log("Successfully connected to database");
    })
    .catch((error) => {
        console.log("database connection failed. exiting now...");
        console.error(error);
        process.exit(1);
    });

db.User = require('./User')(mongoose);

// //create default users
db.User.count().then(data => {
    if (data == 0) {
        db.User.create({
            login:      "user1",
            firstName: "First Name 1",
            lastName: "Last Name 1"
        });
        db.User.create({
            login:      "user2",
            firstName: "First Name 2",
            lastName: "Last Name 2"
        });
        db.User.find().then(data => {
            console.log(data);
        })
    }
})


module.exports = db;