const router = require('express').Router();
const Contact = require('../models/contact');
const auth = require('../../config/authentification');

// GET /contacts
router.route('/')
    .get(auth.isAuthenticated, (req, res) => {
        Contact.find({}, (err, contacts) => {
            if (err) {
                return res.sendStatus(401);
            }
            res.json(contacts);
        })
    });

// GET /contacts/:id
router.route('/:id')
    .get(auth.isAuthenticated, (req, res) => {
        Contact.findById({_id: req.params.id}, (err, contact) => {
            if (err) return res.sendStatus(401);

            res.json(contact);
        })
    });

// POST /contacts
router.route('')
    .post(auth.isAuthenticated, (req, res) => {
        const contact = new Contact(
            req.body
        );

        if (!contact.firstName && !(contact.lastName) && !(contact.phoneNumber)) {
            res.status(400);
            res.json({
                "error": "invalid data"
            });
        }
        else {
            contact.save(contact, err => {
                if (err) {
                    return res.sendStatus(401)
                }
                res.json({message: "Contact successfully added!", contact});
            });
        }
    });

// PUT /contacts/:id
router.route('/:id')
    .put(auth.isAuthenticated, (req, res) => {
        Contact.findById({_id: req.params.id}, (err, contact) => {
            if (err) res.send(err);
            Object.assign(contact, req.body).save((err, contact) => {
                if (err) res.send(err);
                res.json({message: 'Contact updated!', contact});
            });
        });
    });

// DELETE /contacts/:id
router.route('/:id')
    .delete(auth.isAuthenticated, (req, res) => {
        Contact.remove({'_id': req.params.id}, err => {
            if (err) res.status('500').send(err);
            res.send({message: "Contact successfully deleted!"});
        })
    });


module.exports = router;