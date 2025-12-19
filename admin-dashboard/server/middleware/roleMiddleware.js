/**
 * Middleware to restrict access based on user role
 * Must be used after the protect middleware
 * @param  {...String} roles - Allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    next();
  };
};

export const isAdmin = authorize('admin');

export const isOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  const resourceUserId = req.params.id || req.params.userId;
  if (req.user.role === 'admin' || req.user._id.toString() === resourceUserId) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Not authorized to access this resource' });
};

export default authorize;