import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication token required' });
  }
  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'smartpark_dev_secret');
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient role permissions' });
  }
  next();
};

// Enforces Campus-Level Data Isolation for Campus Security Personnel
export const enforceCampusIsolation = (req, res, next) => {
  if (req.user.role === 'security') {
    const requestedCampus = req.params.campusId || req.body.campusId || req.query.campusId;
    if (requestedCampus && String(requestedCampus) !== String(req.user.assignedCampusId)) {
      return res.status(403).json({ error: 'Campus Isolation Violation: Access restricted to assigned campus' });
    }
    req.isolatedCampusId = req.user.assignedCampusId;
  }
  next();
};
