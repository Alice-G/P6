// ASK 106
// VALIDATOR 'fs' is not defined.
// CHECK modified something. Still broken

const Sauce = require("../models/sauce");

const fs = require("fs"); // CHECK this was missing from backup
const { log } = require("console");
const { LOADIPHLPAPI } = require("dns");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id; // HINT
  delete sauceObject._userId; // HINT
  const sauce = new Sauce({
    ...sauceObject, // HINT
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

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

// ASK not sure what if else is comparing here, and whether it needs the details of userLiked?
exports.modifySauce = (req, res, next) => {
  let sauce = new Sauce({ _id: req.params._id });
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    req.body.sauce = JSON.parse(req.body.sauce);
    sauce = {
      _id: req.params.id, // ASK what is the diff between _id and userId here
      title: req.body.sauce.title,
      description: req.body.sauce.description,
      imageUrl: url + "/images/" + req.file.filename,
      price: req.body.sauce.price,
      userId: req.body.sauce.userId,
    };
  } else {
    sauce = {
      _id: req.params.id,
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      price: req.body.price,
      userId: req.body.userId,
    };
  }
  Sauce.updateOne({ _id: req.params.id }, sauce)
    .then(() => {
      res.status(201).json({
        message: "Sauce updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    // ASK why did we delete that? Do I put it back?
    // if (!sauce) {
    //   return res.status(404).json({
    //     error: new Error("Sauce non trouvé !"),
    //   });
    // }
    // if (sauce.userId !== req.auth.userId) {
    //   return res.status(401).json({
    //     error: new Error("Requête non autorisée !"),
    //   });
    // }
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink("images/" + filename, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => {
          res.status(200).json({
            message: "Suprimée!",
          });
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
          });
        });
    });
  });
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK
// BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK
// BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK
// BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK
// BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK BLOCK
// TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO

exports.likeSauce = (req, res, next) => {
  // what sauce is liked
  let sauce = new Sauce({ _id: req.params._id });

  // who is liking
  let userWantsToLike = {
    userId: { _id: req.params._id },
  };
  let userWantsToLikeId = userWantsToLike.userId;
  // console.log(userWantsToLikeId); // table

  // who has liked already
  let userHasLiked = sauce.likes;
  console.log(userHasLiked);

  // who has disliked already
  let userHasDisliked = sauce.dislikes;
  console.log(userHasDisliked);

  // TODO add who has disliked

  const foundInLikes = userHasLiked.includes(userWantsToLikeId);
  const foundInDislikes = userHasDisliked.includes(userWantsToLikeId);

  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    req.body.sauce = JSON.parse(req.body.sauce);
    sauce = {
      _id: req.params.id,
      userId: req.body.sauce.userId, //
      usersLiked: req.body.usersDisliked,
      usersDisliked: req.body.usersDisliked,
    };
  } else {
    // ASK I don't get what this does
    // ASK does that section has to have all the lines of the object or can it update just bits
    sauce = {
      _id: req.params.id,
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      price: req.body.price,
      userId: req.body.userId,
    };

    if (foundInLikes) {
      // user has already liked.
      alert("On ne peux pas Liker deux fois."); // ????
      console.log("Already liked.");
    } else {
      // user has not liked
      if (foundInDislikes) {
        // user has not liked, has disliked
        console.log("remove dislike");
      }
      // add to list of IDs that like
      userHasLiked.push(userWantsToLikeId);
      console.log("added to likes");
      console.log(userHasLiked);
      // update the sauce in DB
      // use sauce

      // HINT
      // this is how to update an object:
      // var favChar = {
      //   name: 'Michael Scott',
      //   company: 'Dunder Mufflin',
      //   designation: 'Regional Manager',
      //   show: 'The Office'
      // }
      //update:
      // favChar.designation = 'Hero of Threat Level Midnight'
      // HINT
    }
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
};
