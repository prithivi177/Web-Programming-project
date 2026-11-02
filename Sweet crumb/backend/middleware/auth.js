// Middleware to protect admin routes using server-side session
function requireAdmin(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: 'Unauthorized. Please log in as an administrator.'
  });
}

module.exports = {
  requireAdmin
};
