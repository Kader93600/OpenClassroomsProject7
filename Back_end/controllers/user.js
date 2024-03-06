const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// Middleware pour l'inscription des users

exports.signup = (req, res, next) => {
    // Hashage du MDP avec bcrypt avant de sauvegarder l'user dans la BDD
    bcrypt
    .hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email, 
            password: hash, 
        });

        // Sauvegarde de l'user dans la BDD
        user.save()
        .then(() => res.status(201).json({message: 'Utilisateur créé !'})) 
        .catch(error => res.status(500).json({error})); 
    })
    .catch(error => res.status(500).json({error}));
};

// Middleware pour la connexion des users

exports.login = (req, res, next) => {
    // Recherche d'un user par son email
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            
            // Comparaison du MDP donnée avec le hash enregistré dans la BDD
            bcrypt
            .compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    // Si le MDP pas valide => on retourne une erreur.
                    return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                }
                // Si c'est good => retourne l'ID de l'user et un token JWT
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        'dH89E3nijgd9#12_*%', // Clé secrète 
                        { expiresIn: '24h' } // token expire 24 heures
                    )
                });
            })
            .catch(error => res.status(500).json({ error })); // Gestion des erreurs de comparaison
        })
        .catch(error => res.status(500).json({ error })); // Gestion des erreurs de recherche user
};