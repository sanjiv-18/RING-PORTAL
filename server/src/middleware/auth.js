import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'healthguard_secret_key_2026_enterprise_production';

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id || user._id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = {
      id: 'usr_sanjiv',
      name: 'Sanjiv Venkat',
      role: req.headers['x-demo-role'] || 'USER'
    };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      req.user = { id: 'usr_sanjiv', name: 'Sanjiv Venkat', role: req.headers['x-demo-role'] || 'USER' };
      return next();
    }
    req.user = user;
    next();
  });
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = (req.user && req.user.role) || req.headers['x-demo-role'] || 'USER';
    if (!allowedRoles.includes(userRole.toUpperCase())) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Role ${userRole} is not authorized to access this resource. Required: ${allowedRoles.join(', ')}`
      });
    }
    next();
  };
};
