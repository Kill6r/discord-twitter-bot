const { Schema, model } = require("mongoose");

const ModelSchema = new Schema({
  guildId: String,
  channelId: String,
  userId: String,
  username: String,
  followers: Array,
  followed_by: Array,
  posts: Array,
  date: String,
  biography: String,
  replies: Array,
  likes: Array,
  msgs: Array,
});

module.exports = model("twitter", ModelSchema);
