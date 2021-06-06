const express = require("express");
const Book = require("../models/booking");
const Show = require("../models/show");
const User = require("../models/user");
const Wallet = require("../models/wallet");
const router = new express.Router();
const auth = require("../middleware/auth");
const Fawn = require("fawn");

router.post("/book", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send(userIdError);

    const show = await Show.findById(req.body.showId);
    if (!show) return res.status(400).send("show doesn't exist!");

    if (req.body.tickets > 5)
      return res.status(400).send("Max 5 tickets at a time");
    let book = await Book.lookup(req.user._id, req.body.showId);

    if (show.ticketsRemaining - req.body.tickets < 0)
      return res.status(400).send("Tickets got over!!");

    const wallet = await Wallet.findOne({ userid: req.user._id });
    if (!wallet) return res.status(400).send("wallet not found");

    let totalTicketPrice = req.body.tickets * show.price;

    if (wallet.amount < totalTicketPrice) {
      return res.status(400).send("Insufficient balance in wallet");
    }

    let percentToGet = 10;
    let cashback = (percentToGet / 100) * wallet.amount;

    let walletAmount = wallet.amount - totalTicketPrice + cashback;
    book = new Book({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      show: {
        _id: show._id,
        name: show.name,
      },

      tickets: req.body.tickets,
      totalPrice: totalTicketPrice,
    });

    await new Fawn.Task()
      .save("books", book)
      .update(
        "shows",
        { _id: show._id },
        {
          $inc: { ticketsRemaining: -req.body.tickets },
        }
      )
      .update(
        "wallets",
        { userid: user._id },
        {
          $set: { amount: walletAmount },
        }
      )
      .run();

    res.status(201).send(book);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/user-booking", auth, async (req, res) => {
  try {
    if (!req.user._id) {
      res.status(400).send("User not found");
    }

    const userBooking = await Book.find({
      "user._id": req.user._id,
    });

    if (!userBooking)
      return res.status(400).send("Booking details not found for this user");

    res.status(201).send(userBooking);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
