const express = require('express')
const router = express.Router();
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config')

const { check, validationResult } = require("express-validator");


//@route POST api/users
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'please enter a valid email').isEmail(),
    check('password', 'password must be min of 6 or more').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body;

    try {
        console.log("req.body", req.body);
        let user = await User.findOne({ email })
        console.log("user", user);
        if (user) {
            return res.status(400).json({ errors: [{ msg: "user already exists" }] })
        }

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            password,
            avatar
        })

        const salt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash(password, salt)

        await user.save()
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