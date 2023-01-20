// CHECK same as backup

const mongoose = require("mongoose");

const SauceSchema = mongoose.Schema({
  userId: { type: String, required: true }, // owner, right? ASK
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true, default: 0 }, // make default/start 0
  dislikes: { type: Number, required: true, default: 0 }, // make default/start 0
  usersLiked: { type: [String], required: true, default: 0 },
  usersDisliked: { type: [String], required: true, default: 0 },
});

module.exports = mongoose.model("Sauce", SauceSchema);
