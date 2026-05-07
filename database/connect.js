const { connect } = require("mongoose");
const Utils = require("../Modules/Utils.js");

module.exports = async (config) => {
  await connect(config.Settings.MongoDB.Link, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      Utils.logInfo("Base de datos conectada.");
    })
    .catch((err) => {
      Utils.logError(err.message);
      Utils.logInfo("Base de datos desconectada.");
    });
};
