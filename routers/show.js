const express = require('express')
const Show = require('../models/show')
const router = new express.Router()



router.post('/show', async (req, res) => {
    const show = new Show(req.body)
    try {
        await show.save()
        return res.status(201).send({ show})
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get("/show", async (req, res) => {
    if(!req.query.name && !req.query.genre) {
        const show = await Show.find();
        res.send(show);
    }else{
        const show = await Show.find({$or: [
            {name: req.query.name},
            {genre: req.query.genre},
        ]});
        res.send(show);
    }
});




module.exports = router