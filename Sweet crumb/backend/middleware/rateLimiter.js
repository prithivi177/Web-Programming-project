// Lightweight in-memory rate limiter for login protection
const loginAttempts = new Map();

function loginRateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 20;

  let record = loginAttempts.get(ip);
  if (!record) {
    record = { count: 1, firstAttempt: now };
    loginAttempts.set(ip, record);
    return next();
  }

  // Reset if window expired
  if (now - record.firstAttempt > windowMs) {
    record.count = 1;
    record.firstAttempt = now;
    return next();
  }

  record.count += 1;
  if (record.count > maxAttempts) {
    return res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again after 15 minutes.'
    });
  }

  next();
}

module.exports = {
  loginRateLimiter
};
