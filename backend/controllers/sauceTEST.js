exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "sauce enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

// BLOCK

// j'ai oublié de te dire un petit truc.

// Pour la sécurité, il faudrait ajouter .env, c'est un paquet à installer et à configurer pour certaines zones à protéger. (mdp base de données, noms utilisateur, clé bcrypt etc etc...)

// Facile à mettre en place :

// npm install dotenv --save

// Exemples ici : https://www.npmjs.com/package/dotenv
