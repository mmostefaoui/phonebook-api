const router = require('express').Router();
const User = require('../models/user');

// POST /contacts
router.route('')
    .post((req, res) => {
        const user = new User(
            req.body
        );

        if (!user.username || !user.password) {
            res.status(400);
            res.json({
                "error": "invalid data"
            });
        }
        else {
            user.save(user, err => {
                if (err) return res.sendStatus(401);
                res.json({message: "User successfully added!", user});
            });
        }
    });

module.exports = router;