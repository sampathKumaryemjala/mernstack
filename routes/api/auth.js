const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const auth = require('../../middleware/auth')
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require("express-validator");

const User = require("../../models/User")

//@route GET api/auth
router.get('/', auth,

    async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            return res.json(user)
        } catch (err) {
            console.error(err);
            res.status(500).send('server error')
        }
        res.send("Auth route")
    })


//@route POST api/auth
router.post('/', [

    check('email', 'please enter a valid email').isEmail(),
    check('password', 'password is required').exists()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;

    try {
        console.log("req.body", req.body);
        let user = await User.findOne({ email })
        console.log("user", user);
        if (!user) {
            return res.status(400).json({ errors: [{ msg: "invalid Credentials" }] })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: "invalid Credentials" }] })
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {
                expiresIn: 36000
            },
            (err, token) => {
                if (err) throw err;
                res.json({ token })
                res.send("User registered")
            })


    } catch (err) {
        console.log(err);
        res.status(500).send("server error")
    }


})

module.exports = router;