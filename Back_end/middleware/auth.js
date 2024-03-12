const jwt = require('jsonwebtoken');
 
// Middleware pour vérifier le token JWT de l'utilisateur

module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
       const userId = decodedToken.userId;
       
       req.auth = {userId: userId};

	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};

