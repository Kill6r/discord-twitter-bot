const { Schema, model } = require("mongoose");

const ModelSchema = new Schema({
  guildId: String,
  prefix: String,
  channels: Array,
  commands: Array,
  welcome: {
    channel: String,
    message: {
      title: {
        status: Boolean,
        content: String,
      },
      description: {
        status: Boolean,
        content: String,
      },
      footer: {
        status: Boolean,
        content: String,
      },
      footer_icon: {
        status: Boolean,
        content: String,
      },
      image: {
        status: Boolean,
        content: String,
      },
      thumbnail: {
        status: Boolean,
        content: String,
      },
    },
  },
  log_channel: String,
  defuse_bomb_role: String,
  shop: Array,
  shop_length: Number,
  color: String,
});

module.exports = model("guild", ModelSchema);
