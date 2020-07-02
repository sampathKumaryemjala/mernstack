const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require("express-validator");


//@route GET api/profile/me

router.get('/me', auth, async (req, res) => {
    try {

        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])

        if (!profile) {
            return res.status(400).json({ msg: "there is no profile for this user" })
        }
        res.json(profile)
    } catch (err) {
        console.log(err.message);
        res.status(500).send('server error')

    }
})

//@route POST api/profile/me

router.post('/',
    [auth,
        [
            check('status', 'Status is required')
                .not()
                .isEmpty(),
            check('skills', 'Skills is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkdin } = req.body

        //build profile Fields
        const profileFields = {}
        profileFields.user = req.user.id
        if (company) profileFields.company = company;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim())
        }

        profileFields.social = {}
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkdin) profileFields.social.linkdin = linkdin;
        if (instagram) profileFields.social.instagram = instagram;


        try {
            let profile = await Profile.findOne({ user: req.user.id })

            if (profile) {
                //update

                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                )
                return res.json(profile)
            }

            //creater

            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);


        }
        catch (err) {
            console.log(err.message);
            res.status(500).send('server error')
        }
    })

//@route GET  all api/profile/me

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles)
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send('server error')
    }
})

//@route GET  profile by id api/profile/me

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: "Profile not found" })
        }

        res.json(profile)
    }
    catch (err) {
        console.log(err.message);
        if (err.kind = 'ObjectId') {
            return res.status(400).json({ msg: "Profile not found" })
        }

        res.status(500).send('server error')
    }
})

//@route Delete  profile by id api/profile/me

router.delete('/', auth, async (req, res) => {
    try {
        await Profile.findOneAndRemove({ user: req.user.id })
        await User.findOneAndRemove({ _id: req.user.id })
        res.json({ msg: "user Deleted" })
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send('server error')
    }
})


module.exports = router;