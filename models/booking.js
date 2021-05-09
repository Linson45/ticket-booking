const mongoose = require('mongoose')
const validator = require('validator')

const bookSchema = new mongoose.Schema({
    user: {
        type: new mongoose.Schema({
          email: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 255
          }
        }),
        required: true
      },
      show: {
        type: new mongoose.Schema({
          name: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 255
          }
        }),
        required: true
      },
      tickets:{
        type: Number,
        required: true,
      }
})

bookSchema.statics.lookup = function(userId, carId) {
    return this.findOne({
      "user._id": userId,
      "show._id": carId,
    });
  };

bookSchema.pre('findOneAndUpdate', function (next) {
    this.options.runValidators = true
    next()
})


const Book = mongoose.model('booking', bookSchema)

module.exports = Book;