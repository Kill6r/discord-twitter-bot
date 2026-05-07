const { Schema, model } = require("mongoose");

const ModelSchema = new Schema({
  guildId: String,
  userId: String,
  messageId: String,
  msg: Boolean,
  post: String,
  date: String,
  likes: Array,
  rts: Array,
});

module.exports = model("posts", ModelSchema);
