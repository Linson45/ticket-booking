const express = require('express')
const Wallet = require('../models/wallet')
const auth = require('../middleware/auth')
const router = new express.Router()



router.post('/wallet',auth,  async (req, res) => {
    const found = await Wallet.findOne({userid: req.user._id});
    if(found) return res.status(400).send("wallet exist for user.");
    const wallet = new Wallet({
        userid: req.user._id,
        amount: req.body.amount
    })

    try {
        await wallet.save()
        return res.status(201).send({ wallet})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/wallet', auth,  async (req, res) => {
    try {
    const wallet = await Wallet.findOneAndUpdate(
       { userid: req.user._id },
        setValues(req),
        {
            new: true
        }
    );
    return res.json({updated:true});
    } catch (e) {
        res.status(400).send(e)
    }
})

function setValues(req) {
    return {
        amount: req.body.amount
    };
  }


module.exports = router