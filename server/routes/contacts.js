var express = require('express');
var router = express.Router();
const Contact = require('../models/contact');

async function getNextContactId() {
    const contacts = await Contact.find().select('id');
    let maxId = 0;

    contacts.forEach((contact) => {
        const parsedId = parseInt(contact.id, 10);
        if (!Number.isNaN(parsedId) && parsedId > maxId) {
            maxId = parsedId;
        }
    });

    return String(maxId + 1);
}

function formatContactResponse(contact) {
    return {
        id: contact.id ? String(contact.id) : String(contact._id || ''),
        name: contact.name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        imageUrl: contact.imageUrl || contact.imageURL || '',
        group: Array.isArray(contact.group) ? contact.group : []
    };
}

router.get('/', (req, res, next) => {
    Contact.find()
        .then(contacts => {
            res.status(200).json(contacts.map(formatContactResponse));
        })
        .catch(error => {
            res.status(500).json({ message: 'An error occurred', error: error });
        });
});

router.post('/', (req, res, next) => {
    getNextContactId()
        .then(nextContactId => {
            const contact = new Contact({
                id: nextContactId,
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                imageUrl: req.body.imageUrl || req.body.imageURL || '',
                group: Array.isArray(req.body.group) ? req.body.group : []
            });

            return contact.save();
        })
        .then(createdContact => {
            res.status(201).json({ message: 'Contact added successfully', contact: formatContactResponse(createdContact) });
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
            contact.imageUrl = req.body.imageUrl || req.body.imageURL || '';
            contact.group = Array.isArray(req.body.group) ? req.body.group : [];

            contact.save()
                .then(updatedContact => {
                    console.log('Contact updated:', updatedContact);
                    res.status(200).json({ message: 'Contact updated successfully', contact: formatContactResponse(updatedContact) });
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
    Contact.deleteOne({ id: req.params.id })
        .then(result => {
            if (!result || result.deletedCount === 0) {
                return res.status(404).json({ message: 'Contact not found.' });
            }

            return res.status(204).json({ message: 'Contact deleted successfully' });
        })
        .catch(error => {
            res.status(500).json({ message: 'An error occurred', error: error });
        });
});

module.exports = router;