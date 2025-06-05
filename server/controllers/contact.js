const nodemailer = require('nodemailer');

exports.sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email options
    const mailOptions = {
      from: email,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Message from ${name}`,
      text: message,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ msg: 'Message sent successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
  // Add to sendContactMessage function
// After sending to admin, send confirmation to user
const userMailOptions = {
  from: process.env.EMAIL_USER,
  to: email,
  subject: 'Thank you for contacting Magic of Belonging',
  text: `Hi ${name},\n\nThank you for your message. We've received it and will get back to you soon.\n\nBest regards,\nThe Magic of Belonging Team`,
  html: `
    <h3>Hi ${name},</h3>
    <p>Thank you for your message. We've received it and will get back to you soon.</p>
    <p>Best regards,<br>The Magic of Belonging Team</p>
  `
};

await transporter.sendMail(userMailOptions);
};