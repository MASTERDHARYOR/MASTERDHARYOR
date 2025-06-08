require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose'); // For database integration

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://Masterpaul:<db_password>@paul-the-analyst.ipf9hji.mongodb.net/?retryWrites=true&w=majority&appName=PAUL-THE-ANALYST', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected!'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define Post Schema
const postSchema = new mongoose.Schema({
    title: String,
    description: String,
    content: String,
    image: String,
    date: { type: Date, default: Date.now }
});

// Define Post Model
const Post = mongoose.model('Post', postSchema);

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(require('./routes/posts')); // Adjust path as needed

// Routes
app.get('/', (req, res) => {
    res.send('Backend running successfully');
});

// Create a post
app.post('/api/posts', async (req, res) => {
    try {
        const post = new Post(req.body);
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all posts
app.get('/api/posts', async (req, res) => {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
});

// Get a single post
app.get('/api/posts/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
});

// Update a post
app.put('/api/posts/:id', async (req, res) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
});

// Delete a post
app.delete('/api/posts/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Catch-All Route for Undefined Endpoints
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
