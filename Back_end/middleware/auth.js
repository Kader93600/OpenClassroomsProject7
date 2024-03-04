const jwt = require('jsonwebtoken');
 
// Middleware pour vérifier le token JWT de l'utilisateur

module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, 'dH89E3nijgd9#12_*%');
       const userId = decodedToken.userId;
       
       req.auth = {userId: userId};

	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};

