require('dotenv').config();
const express = require('express');
const app = express();

// 1. Basic middleware
app.use(express.json());
// Add after express.json() middleware
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET','POST']
}));
// Add before routes
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://weiwei:Gitimu2219%23@cluster0.ppomebp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
// Replace test routes with:
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);
const storiesRouter = require('./routes/stories');
app.use('/api/stories', storiesRouter);
const contactRouter = require('./routes/contact');
app.use('/api/contact', contactRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));