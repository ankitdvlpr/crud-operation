const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Create a new book
router.post('/', async (req, res) => {
    try {
        const { title, author, isbn, publishedDate } = req.body;
        if (!title || !author || !isbn) {
            return res.status(400).json({ message: 'Title, author, and ISBN are required' });
        }
        const newBook = new Book({ title, author, isbn, publishedDate });
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Retrieve all books
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', sort = 'title' } = req.query;
        const books = await Book.find({
            $or: [
                { title: new RegExp(search, 'i') },
                { author: new RegExp(search, 'i') }
            ]
        })
        .sort({ [sort]: 1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Retrieve a book by ID
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.status(200).json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a book by ID
router.put('/:id', async (req, res) => {
    try {
        const { title, author, isbn, publishedDate } = req.body;
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, { title, author, isbn, publishedDate }, { new: true });
        if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
        res.status(200).json(updatedBook);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a book by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
