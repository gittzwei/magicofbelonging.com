const Story = require('../models/Story');

// Get all stories
exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find().populate('author', 'name');
    res.json(stories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get single story
exports.getStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate('author', 'name');
    if (!story) {
      return res.status(404).json({ msg: 'Story not found' });
    }
    
    // Increment views
    story.views += 1;
    await story.save();
    
    res.json(story);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Story not found' });
    }
    res.status(500).send('Server error');
  }
};

// Create story
exports.createStory = async (req, res) => {
  const { title, content, excerpt, region, theme, featuredImage } = req.body;
  const nodemailer = require('nodemailer');
  const User = require('../models/User');
// After story is created
const author = await User.findById(req.user.id);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: author.email,
  subject: 'Your Story Has Been Submitted',
  text: `Hi ${author.name},\n\nThank you for submitting your story "${title}" to Magic of Belonging. Our team will review it and notify you once it's published.\n\nBest regards,\nThe Magic of Belonging Team`,
  html: `
    <h3>Hi ${author.name},</h3>
    <p>Thank you for submitting your story "${title}" to Magic of Belonging. Our team will review it and notify you once it's published.</p>
    <p>Best regards,<br>The Magic of Belonging Team</p>
  `
};

await transporter.sendMail(mailOptions);

// Also notify admin
const adminMailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.ADMIN_EMAIL,
  subject: 'New Story Submission Needs Review',
  text: `A new story titled "${title}" has been submitted by ${author.name} (${author.email}). Please review it in the admin dashboard.`,
  html: `
    <h3>New Story Submission</h3>
    <p>A new story titled "${title}" has been submitted by ${author.name} (${author.email}).</p>
    <p>Please review it in the admin dashboard.</p>
    <a href="${process.env.ADMIN_URL}/admin/stories">Review Stories</a>
  `
};

await transporter.sendMail(adminMailOptions);

  try {
    const newStory = new Story({
      title,
      content,
      excerpt,
      author: req.user.id,
      region,
      theme,
      featuredImage
    });

    const story = await newStory.save();
    res.json(story);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
// Add to existing exports
exports.updateStory = async (req, res) => {
  const { title, content, excerpt, region, theme, featuredImage } = req.body;

  try {
    let story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ msg: 'Story not found' });
    }

    // Update fields
    story.title = title || story.title;
    story.content = content || story.content;
    story.excerpt = excerpt || story.excerpt;
    story.region = region || story.region;
    story.theme = theme || story.theme;
    story.featuredImage = featuredImage || story.featuredImage;

    await story.save();
    res.json(story);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ msg: 'Story not found' });
    }

    await story.remove();
    res.json({ msg: 'Story removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Story not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.getPendingStories = async (req, res) => {
  try {
    const stories = await Story.find({ status: 'pending' }).populate('author', 'name');
    res.json(stories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
// Add to exports
exports.searchStories = async (req, res) => {
  const { query } = req.query;

  try {
    const stories = await Story.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { excerpt: { $regex: query, $options: 'i' } }
      ]
    }).populate('author', 'name');

    res.json(stories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};