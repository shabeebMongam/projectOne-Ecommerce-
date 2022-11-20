const mongoose = require('mongoose')

const connectWithDB = (url) => {

    try {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.log("Connected to Localhost");
            }).catch((error) => {
                console.log(error);
            })

    } catch (err) {
        console.log(err);
    }




}


module.exports = connectWithDB;