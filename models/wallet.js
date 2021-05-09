const mongoose = require('mongoose')
const validator = require('validator')

const walletSchema = new mongoose.Schema({
  amount: {
    type: Number,
    validate(value) {
      if (value < 100) {
        throw new Error("minimum needs to Rs.100")
      }
    },
    required: true
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
})

walletSchema.pre('findOneAndUpdate', function (next) {
  this.options.runValidators = true
  next()
})


const Wallet = mongoose.model('Wallet', walletSchema)

module.exports = Wallet