const Book = require('../models/Book');
const fs = require('fs');

// Middleware pour créer un nouveau livre

exports.createBook = (req, res, next) => {

//Analyse contenu des données et nettoyage de l'objet livre reçu dans la requête 

  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  
// Création d'un livre avec les info reçues et sauvegarde dans la BDD

  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });

// Enregistrement du livre dans la BDD

  book.save()
  .then(() => { res.status(201).json({message: 'Livre enregistré !😊'})})
  .catch(error => { res.status(400).json( { error })})
};

// Middleware pour modifier un livre existant

exports.updateBook = (req, res, next) => {

//MAJ de l'objet livre avec une nouvelle image si elle est présente dans la requête

  const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`} : { ...req.body };

  delete bookObject._userId; // Suppression du champ userid pour éviter la modification non autorisée
  
  Book.findOne({_id: req.params.id})
      .then((book) => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({ message : 'Non-authorisé'}); // Vérification de l'autorisation
          } else {
              // Mise à jour du livre si l'utilisateur est autorisé
              Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Livre modifié!😊'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

// Middleware pour supprimer un livre

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
      .then(book => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({message: 'Non-authorisé'}); 
          } else {
            // Sup image du livre du serveur
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                // Suppression du livre de la BDD
                  Book.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé ! 👋'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

// Middleware pour récupérer un livre spécifique par son ID

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then(book => res.status(200).json(book))
      .catch(error => res.status(404).json({ error }));
};

// Middleware pour récupérer tous les livres

exports.getAllBooks =(req, res, next) => {
    Book.find()
     .then(books => res.status(200).json(books))
     .catch(error => res.status(400).json({ error }));
};

// Middleware pour noter un livre

exports.rateBook = (req, res, next) => {
    // Vérification de la validité de la note
	if (req.body.rating < 0 || req.body.rating > 5) {
		res.status(400).json({ message: 'La note doit être comprise entre 1 et 5.😊' });
		return;
	}

	Book.findOne({ _id: req.params.id })
		.then((book) => {
			if (book.ratings.find((rating) => rating.userId === req.auth.userId)) {
                // Vérification si l'utilisateur a déjà noté le livre
				res.status(400).json({ message: 'Vous avez déjà évalué ce livre.👀' });
				return;
			}

            // Ajout de la note au livre et mise à jour de la note moyenne

			const ratingObject = { userId: req.auth.userId, grade: req.body.rating };			
            book.ratings.push(ratingObject);
			book.averageRating = calculateAverageRating(book.ratings);

			book.save()
				.then(() => {res.status(200).json(book);})
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => res.status(400).json({ error }));
};

// Middleware pour récupérer les livres avec les meilleures notes

exports.bestRating = (req, res, next) => {
	Book.find()
		.sort({ averageRating: -1 }) // Tri des livres par leur note moyenne, du plus élevé au plus bas (-1 = Décendant)
        .limit(3)
		.then((books) => {
			res.status(200).json(books);
		})
		.catch((error) => res.status(400).json({ error }));
};



// Fonction pour calculer la note moyenne d'un livre

function calculateAverageRating(ratings) {
	
    let totalRating = 0; // Initialiser la somme total des notes 

	for (const rating of ratings) {
		totalRating += rating.grade; // On ajoute la note à la totalité des notes
	}

	const averageRating = totalRating / ratings.length;
	
    return Math.round(averageRating); // Arrondir Note Moy
}
