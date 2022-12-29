// external imports
const mongoose = require('mongoose');
require('dotenv').config()

async function dataBaseConnect() {
    mongoose
        .connect(process.env.DB_URL)
        .then(() => {
            console.log('Holy crap I finally got this to connect to MongoDB Atlas!');
        })
        .catch((error) => {
            console.log('Not connected to MongoDB Atlas... again');
            console.error(error);
        });
}

module.exports = dataBaseConnect;



