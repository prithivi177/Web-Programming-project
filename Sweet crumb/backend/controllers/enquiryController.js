const { pool } = require('../db');

// POST /api/enquiries - Submit customer contact enquiry
async function createEnquiry(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Your name is required.' });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'A valid email address is required.' });
    }

    if (!subject || subject.trim() === '') {
      return res.status(400).json({ success: false, message: 'Subject line is required.' });
    }

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    const [result] = await pool.query(
      'INSERT INTO enquiries (name, email, subject, message, status) VALUES (?, ?, ?, ?, "Pending")',
      [name.trim(), email.trim(), subject.trim(), message.trim()]
    );

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Our head baker will get back to you shortly.',
      enquiry_id: result.insertId
    });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit enquiry. Please check database connection.',
      error: error.message
    });
  }
}

// GET /api/admin/enquiries - Admin view enquiries
async function getEnquiries(req, res) {
  try {
    const { status } = req.query;
    let sql = 'SELECT * FROM enquiries WHERE 1=1';
    const params = [];

    if (status && status !== 'All') {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY id DESC';

    const [rows] = await pool.query(sql, params);
    return res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiries.',
      error: error.message
    });
  }
}

// PATCH /api/admin/enquiries/:id/status - Update enquiry status
async function updateEnquiryStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "Pending" or "Resolved".'
      });
    }

    const [result] = await pool.query('UPDATE enquiries SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found.'
      });
    }

    return res.json({
      success: true,
      message: `Enquiry status updated to "${status}".`
    });
  } catch (error) {
    console.error('Error updating enquiry status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update enquiry status.',
      error: error.message
    });
  }
}

module.exports = {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus
};
