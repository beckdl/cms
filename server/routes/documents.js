var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Document = require('../models/document');

router.get('/', (req, res, next) => {
    Document.find()
        .then(documents => {
            res.status(200).json(documents);
        })
        .catch(error => {
            res.status(500).json({ message: 'An error occurred', error: error });
        });
});

router.post('/', (req, res, next) => {
    const maxDocumentId = sequenceGenerator.nextId("documents");

    const document = new Document({
        id: maxDocumentId,
        name: req.body.name,
        url: req.body.url,
        description: req.body.description
    });

    document.save()
        .then(createdDocument => {
            res.status(201).json({message: 'Document added successfully', document: createdDocument});
        })
        .catch(error => {
            res.status(500).json({ message: 'An error occurred', error: error });
        });
});

router.put('/:id', (req, res, next) => {
    Document.findOne({ id: req.params.id })
        .then(document => {
            if (!document) {
                return res.status(404).json({ message: 'Document not found.' });
            }

            document.name = req.body.name;
            document.url = req.body.url;
            document.description = req.body.description;

            document.save()
                .then(updatedDocument => {
                    console.log('Document updated:', updatedDocument);
                    res.status(200).json({ message: 'Document updated successfully', document: updatedDocument });
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
    Document.findOne({ id: req.params.id })
        .then(document => {
            document.deleteOne({ id: req.params.id })
                .then(result => {
                    res.status(204).json({ message: 'Document deleted successfully' });
                })
                .catch(error => {
                    res.status(500).json({ message: 'An error occurred', error: error });
                });
        })
        .catch(error => {
            res.status(500).json({ message: 'Document not found.', error: { document: 'Document not found' } });
        });
});

module.exports = router;