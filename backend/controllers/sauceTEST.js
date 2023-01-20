exports.likeSauce = (req, res, next) => {
  // what sauce is liked
  let sauce = new Sauce({ _id: req.params._id });

  // who is liking
  let userWantsToLike = {
    userId: { _id: req.params._id },
  };
  let userWantsToLikeId = userWantsToLike.userId;
  // console.log(userWantsToLikeId); // table DEL

  // who has liked already
  let userHasLiked = sauce.likes;
  console.log(userHasLiked); // DEL

  // who has disliked already
  let userHasDisliked = sauce.dislikes;
  console.log(userHasDisliked); // DEL

  const foundInLikes = userHasLiked.includes(userWantsToLikeId);
  const foundInDislikes = userHasDisliked.includes(userWantsToLikeId);

  if (req.file) {
    // IF there's a file
    // ASK if the page still exists? How do I checked if there's one in DB?
    const url = req.protocol + "://" + req.get("host");
    req.body.sauce = JSON.parse(req.body.sauce);
    sauce = {
      _id: req.params.id, // sauce
      userId: req.body.sauce.userId, // user
      usersLiked: req.body.usersLiked,
      usersDisliked: req.body.usersDisliked,
    };
    if (foundInLikes) {
      // user has already liked.
      alert("On ne peux pas Liker deux fois."); // ???? ASK
      console.log("Already liked."); // DEL
    } else {
      // user has not liked

      // IF it's disliked
      if (foundInDislikes) {
        // user has not liked, has disliked

        // remove from dislikes
        let indexOfDislike = favChar.abilities.indexOf(userWantsToLikeId); // or const? ASK
        console.log(
          "finding dislike in array : ",
          userWantsToLikeId,
          indexOfDislike
        ); // DEL
        favChar.abilities.splice(indexOfDislike, 1); // needs index and how many it deletes
        console.log("dislike removed"); // DEL
      }

      // add to list of IDs that like
      userHasLiked.push(userWantsToLikeId);
      console.log("added to likes"); // DEL
      console.log(userHasLiked); // DEL
    }
  } else {
    // ASK do I need a else here? Am I checking for cases?
    sauce = {
      _id: req.params.id,
      userId: req.body.userId,
      usersLiked: req.body.usersLiked,
      usersDisliked: req.body.usersDisliked,
    };
  }

  Sauce.updateOne({ _id: req.params.id }, sauce)
    .then(() => {
      res.status(201).json({
        message: "Sauce liked successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
}; // this to remove later

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

exports.likeOrNotSauce = (req, res, next) => {
  let like = req.body.like;
  let userId = req.body.userId;
  const sauceId = req.params.id;
  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      // let like =req.body.like
      // let userId = req.body.userId
      // nouvelles valeurs à modifier
      const newValues = {
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
        likes: 0,
        dislikes: 0,
      };
      // Différents cas:
      switch (like) {
        case 1: // CAS: sauce liked
          newValues.usersLiked.push(userId);
          break;
        case -1: // CAS: sauce disliked
          newValues.usersDisliked.push(userId);
          break;
        case 0: // CAS: Annulation du like/dislike  et on retire id du tableau
          if (newValues.usersLiked.includes(userId)) {
            // si on annule le like
            const index = newValues.usersLiked.indexOf(userId);
            newValues.usersLiked.splice(index, 1);
          } else {
            // si on annule le dislike
            const index = newValues.usersDisliked.indexOf(userId);
            newValues.usersDisliked.splice(index, 1);
          }
          break;
      }
      // Calcul du nombre de likes / dislikes
      newValues.likes = newValues.usersLiked.length;
      newValues.dislikes = newValues.usersDisliked.length;
      // Mise à jour de la sauce avec les nouvelles valeurs
      Sauce.updateOne({ _id: sauceId }, newValues).then(() =>
        res.status(200).json({ message: "Sauce évaluée !" })
      );
    })
    .catch((error) => res.status(500).json({ error }));
};

// j'ai oublié de te dire un petit truc.

// Pour la sécurité, il faudrait ajouter .env, c'est un paquet à installer et à configurer pour certaines zones à protéger. (mdp base de données, noms utilisateur, clé bcrypt etc etc...)

// Facile à mettre en place :

// npm install dotenv --save

// Exemples ici : https://www.npmjs.com/package/dotenv
