const nodemailer = require('nodemailer');
const sanitizeHtml = require('sanitize-html');

// Create transporter once (reused for all emails)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Admin notification
    await transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Message from ${name}`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>From:</strong> ${sanitizeHtml(name)} (${sanitizeHtml(email)})</p>
        <p><strong>Message:</strong></p>
        <p>${sanitizeHtml(message)}</p>
      `
    });

    // User confirmation
    await transporter.sendMail({
      from: `"Magic of Belonging" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for contacting us',
      html: `
        <h3>Hi ${sanitizeHtml(name)},</h3>
        <p>We've received your message and will respond soon.</p>
        <p><strong>Your message:</strong></p>
        <blockquote>${sanitizeHtml(message)}</blockquote>
        <p>Best regards,<br>The Magic of Belonging Team</p>
      `
    });

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ 
      error: 'Message could not be sent',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};