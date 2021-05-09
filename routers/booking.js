const express = require('express')
const Book = require('../models/booking')
const Show = require('../models/show')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth');
const Fawn = require("fawn");

router.post("/book", auth , async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send(userIdError);
  
    const show = await Show.findById(req.body.showId);
    if (!show) return res.status(400).send("show doesn't exist!");
  
    if (req.body.tickets > 5) return res.status(400).send("Max 5 tickets at a time");
    let book = await Book.lookup(req.user._id, req.body.showId);
    
    if ((show.ticketsRemaining - req.body.tickets) < 0) return res.status(400).send("Tiekets got over!!");
  
    book = new Book({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      show: {
        _id: show._id,
        name: show.name
      },
      tickets: req.body.tickets
    });
  
    await new Fawn.Task()
      .save("booking", book)
      .update(
        "shows",
        { _id: show._id },
        {
          $inc: { ticketsRemaining: - req.body.tickets }
        }
      )
      .run();
  
    res.status(201).send(book);
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
    
  });

  module.exports = router;