var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');

const legacyMessageSenderById = {
    '1': '7',
    '2': '13',
    '3': '7',
    '4': '3',
    '5': '7'
};

function formatMessageResponse(message) {
    const senderValue = message && message.sender ? message.sender : (legacyMessageSenderById[String(message.id)] || '');
    const normalizedSender = (typeof senderValue === 'object')
        ? (senderValue.id || senderValue._id || senderValue.toString())
        : senderValue;

    return {
        id: message.id ? String(message.id) : String(message._id || ''),
        subject: message.subject || '',
        msgText: message.msgText || '',
        sender: String(normalizedSender || '')
    };
}

router.get('/', (req, res, next) => {
    Message.find()
        .then(messages => {
            res.status(200).json(messages.map(formatMessageResponse));
        })
        .catch(error => {
            res.status(500).json({ message: 'An error occurred', error: error });
        });
});

router.post('/', (req, res, next) => {
    const maxMessageId = sequenceGenerator.nextId("messages");

    const message = new Message({
        id: maxMessageId,
        subject: req.body.subject,
        msgText: req.body.msgText,
        sender: req.body.sender ? String(req.body.sender) : ''
    });

    message.save()
        .then(createdMessage => {
            res.status(201).json({ message: 'Message added successfully', newMessage: formatMessageResponse(createdMessage) });
        })
        .catch(error => {
            res.status(500).json({ message: 'An error occurred', error: error });
        });
});

router.put('/:id', (req, res, next) => {
    Message.findOne({ id: req.params.id })
        .then(message => {
            if (!message) {
                return res.status(404).json({ message: 'Message not found.' });
            }

            message.subject = req.body.subject;
            message.msgText = req.body.msgText;
            message.sender = req.body.sender ? String(req.body.sender) : '';

            message.save()
                .then(updatedMessage => {
                    console.log('Message updated:', updatedMessage);
                    res.status(200).json({ message: 'Message updated successfully', updatedMessage: formatMessageResponse(updatedMessage) });
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
    Message.findOne({ id: req.params.id })
        .then(message => {
            message.deleteOne({ id: req.params.id })
                .then(result => {
                    res.status(204).json({ message: 'Message deleted successfully' });
                })
                .catch(error => {
                    res.status(500).json({ message: 'An error occurred', error: error });
                });
        })
        .catch(error => {
            res.status(500).json({ message: 'Message not found.', error: { message: 'Message not found' } });
        });
});

module.exports = router;