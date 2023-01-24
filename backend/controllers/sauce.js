const Sauce = require("../models/sauce");

const fs = require("fs");
const { log } = require("console");
const { LOADIPHLPAPI } = require("dns");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id; // HINT
  delete sauceObject._userId; // HINT
  console.log(sauceObject); // DEL TEST
  const sauce = new Sauce({
    ...sauceObject, // HINT
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() =>
      res.status(201).json({ message: "You have created a new sauce !" })
    )
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

// ASK can we CHECK here
exports.modifySauce = (req, res, next) => {
  let sauce = new Sauce({ _id: req.params._id });
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    req.body.sauce = JSON.parse(req.body.sauce);
    sauce = {
      _id: req.params.id, // which sauce it is
      userId: req.body.sauce.userId, // who made it/owns it
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description: req.body.sauce.description,
      mainPepper: req.body.sauce.mainPepper, // LEG
      imageUrl: url + "/images/" + req.file.filename,
      heat: req.body.sauce.heat, // LEG
      likes: req.body.sauce.likes,
      dislikes: req.body.sauce.dislikes,
      usersLiked: req.body.sauce.usersLiked,
      usersDisliked: req.body.sauce.usersDisliked,
    };
  } else {
    sauce = {
      _id: req.params.id,
      userId: req.body.userId,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      mainPepper: req.body.mainPepper,
      imageUrl: req.body.imageUrl,
      heat: req.body.heat,
      likes: req.body.likes,
      dislikes: req.body.dislikes,
      usersLiked: req.body.usersLiked,
      usersDisliked: req.body.usersDisliked,
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

exports.likeSauceOrNot = (req, res, next) => {
  let like = req.body.like;
  let userId = req.body.userId;
  const sauceId = req.params.id;
  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      // import current status, to edit
      const newValues = {
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
        likes: 0,
        dislikes: 0,
      };
      // Run through options
      switch (like) {
        case 1: // User liked the sauce
          newValues.usersLiked.push(userId);
          break;
        case -1: // User disliked the sauce
          newValues.usersDisliked.push(userId);
          break;
        case 0: // User removed like or dislike
          if (newValues.usersLiked.includes(userId)) {
            // removing userId from table of users that liked
            const index = newValues.usersLiked.indexOf(userId);
            newValues.usersLiked.splice(index, 1);
          } else {
            // removing userId from table of users that disliked
            const index = newValues.usersDisliked.indexOf(userId);
            newValues.usersDisliked.splice(index, 1);
          }
          break;
      }
      // Add up new number of likes and dislikes
      newValues.likes = newValues.usersLiked.length;
      newValues.dislikes = newValues.usersDisliked.length;
      // update sauce with new values
      Sauce.updateOne({ _id: sauceId }, newValues).then(() =>
        res.status(200).json({ message: "Sauce évaluée !" })
      );
    })
    .catch((error) => res.status(500).json({ error }));
};
