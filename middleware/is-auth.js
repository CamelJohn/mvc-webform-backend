const JWT = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Not authenticated'})
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = JWT.verify(token, process.env.SECRET);    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  if (!decodedToken) {
    return res.status(401).json({ message: 'Not authenticated'});
  }
  req.id = decodedToken.id;  
  next();
};
