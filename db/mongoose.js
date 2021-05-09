const mongoose = require('mongoose')
const Fawn = require("fawn");
mongoose.connect('mongodb://127.0.0.1:27017/ticket-booking-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
Fawn.init(mongoose);