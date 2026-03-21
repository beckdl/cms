var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Contact = require('../models/contact');

router.get('/', (req, res, next) => {
    Contact.find()
        .populate('group')
        .then(contacts => {
            res.status(200).json(contacts);
        })
        .catch(error => {
            res.status(500).json({ message: 'An error occurred', error: error });
        });
});

router.post('/', (req, res, next) => {
    const maxContactId = sequenceGenerator.nextId("contacts");

    const contact = new Contact({
        id: maxContactId,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        imageURL: req.body.imageURL,
        group: req.body.group
    });

    contact.save()
        .then(createdContact => {
            res.status(201).json({message: 'Contact added successfully', contact: createdContact});
        })
        .catch(error => {
            res.status(500).json({ message: 'An error occurred', error: error });
        });
});

router.put('/:id', (req, res, next) => {
    Contact.findOne({ id: req.params.id })
        .then(contact => {
            if (!contact) {
                return res.status(404).json({ message: 'Contact not found.' });
            }

            contact.name = req.body.name;
            contact.email = req.body.email;
            contact.phone = req.body.phone;
            contact.imageURL = req.body.imageURL;
            contact.group = req.body.group;

            contact.save()
                .then(updatedContact => {
                    console.log('Contact updated:', updatedContact);
                    res.status(200).json({ message: 'Contact updated successfully', contact: updatedContact });
                })
                .catch(error => {
                    res.status(500).json({ message: 'An error occurred', error: error });
                });
        })
        .catch(error => {
            res.status(500).json({ message: 'An error occurred', error: error });
        });
});

router.delete('/:id', (req, res, next) => {
    Contact.findOne({ id: req.params.id })
        .then(contact => {
            contact.deleteOne({ id: req.params.id })
                .then(result => {
                    res.status(204).json({ message: 'Contact deleted successfully' });
                })
                .catch(error => {
                    res.status(500).json({ message: 'An error occurred', error: error });
                });
        })
        .catch(error => {
            res.status(500).json({ message: 'Contact not found.', error: { contact: 'Contact not found' } });
        });
});

module.exports = router;