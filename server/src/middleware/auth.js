import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'healthguard_ai_enterprise_jwt_secret_key_2026';

export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id || user._id?.toString() || 'usr_sanjiv', 
      name: user.name, 
      email: user.email, 
      role: (user.role || 'USER').toUpperCase() 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const demoRole = req.headers['x-demo-role'];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (demoRole) {
          req.user = { id: 'usr_sanjiv', name: 'Sanjiv Venkat', role: demoRole.toUpperCase() };
          return next();
        }
        return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired authentication token.' });
      }
      req.user = decoded;
      return next();
    });
  } else if (demoRole) {
    req.user = {
      id: 'usr_sanjiv',
      name: 'Sanjiv Venkat',
      role: demoRole.toUpperCase()
    };
    return next();
  } else {
    // Default demo fallback user if unauthenticated
    req.user = {
      id: 'usr_sanjiv',
      name: 'Sanjiv Venkat',
      role: 'USER'
    };
    return next();
  }
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = (req.user?.role || req.headers['x-demo-role'] || 'USER').toUpperCase();
    const formattedAllowed = allowedRoles.map(r => r.toUpperCase());

    if (!formattedAllowed.includes(userRole)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Role [${userRole}] is not authorized to perform this operation. Required: [${formattedAllowed.join(', ')}]`
      });
    }
    next();
  };
};
