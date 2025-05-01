const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(bodyParser.json({ limit: '10mb' })); // Allow large payloads for images
app.use(cors());

let posts = []; // Temporary in-memory storage

// Fetch all posts
app.get('/api/posts', (req, res) => {
    res.json(posts);
});

// Fetch a single post by ID
app.get('/api/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (post) {
        res.json(post);
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

// Add a new post
app.post('/api/posts', (req, res) => {
    const newPost = {
        id: posts.length + 1,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        image: req.body.image || '',
    };
    posts.push(newPost);
    res.status(201).json(newPost);
});

// Update a post by ID
app.put('/api/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex((p) => p.id === postId);

    if (postIndex !== -1) {
        posts[postIndex] = {
            ...posts[postIndex],
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            image: req.body.image || posts[postIndex].image,
        };
        res.json(posts[postIndex]);
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
