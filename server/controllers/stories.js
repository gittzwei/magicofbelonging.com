const Story = require('../models/Story');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Get all stories
exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find({ status: 'approved' }).populate('author', 'name');
    res.json(stories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get single story
exports.getStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate('author', 'name');
    if (!story) {
      return res.status(404).json({ msg: 'Story not found' });
    }
    
    story.views += 1;
    await story.save();
    res.json(story);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create story
exports.createStory = async (req, res) => {
  const { title, content, excerpt, region, theme, featuredImage } = req.body;

  try {
    const newStory = new Story({
      title,
      content,
      excerpt,
      author: req.user.id,
      region,
      theme,
      featuredImage,
      status: 'pending' // Added status field
    });

    const story = await newStory.save();
    
    // Send emails after successful story creation
    const author = await User.findById(req.user.id);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email to author
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: author.email,
      subject: 'Your Story Has Been Submitted',
      html: `
        <h3>Hi ${author.name},</h3>
        <p>Thank you for submitting "${title}" to Magic of Belonging.</p>
        <p>Our team will review it shortly.</p>
      `
    });

    // Email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Story Submission',
      html: `
        <h3>New Story Submission</h3>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Author:</strong> ${author.name} (${author.email})</p>
        <a href="${process.env.ADMIN_URL}/admin/stories">Review Now</a>
      `
    });

    res.json(story);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update story
exports.updateStory = async (req, res) => {
  const { title, content, excerpt, region, theme, featuredImage, status } = req.body;

  try {
    let story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ msg: 'Story not found' });

    // Update fields
    const updateFields = {
      title: title || story.title,
      content: content || story.content,
      excerpt: excerpt || story.excerpt,
      region: region || story.region,
      theme: theme || story.theme,
      featuredImage: featuredImage || story.featuredImage,
      status: status || story.status
    };

    story = await Story.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    res.json(story);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete story
exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ msg: 'Story not found' });

    await story.deleteOne();
    res.json({ msg: 'Story removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get pending stories
exports.getPendingStories = async (req, res) => {
  try {
    const stories = await Story.find({ status: 'pending' }).populate('author', 'name');
    res.json(stories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Search stories
exports.searchStories = async (req, res) => {
  try {
    const stories = await Story.find({
      $or: [
        { title: { $regex: req.query.query, $options: 'i' } },
        { content: { $regex: req.query.query, $options: 'i' } },
        { excerpt: { $regex: req.query.query, $options: 'i' } }
      ],
      status: 'approved'
    }).populate('author', 'name');

    res.json(stories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};